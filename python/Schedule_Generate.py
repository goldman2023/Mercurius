from Schedule_Functions import *
from ShiftLine import *
from calc_optimized_shifts import *
import pandas as pd
from flask import Flask, jsonify, request, json, send_file
from flask_cors import CORS, cross_origin
from pulp import *
# from IPython.display import Image, display

app = Flask(__name__)
CORS(app)
app.config['JSON_SORT_KEYS'] = False

pd.set_option("display.max_rows", None, "display.max_columns", None)

@app.route('/calculate_optimized_shifts', methods=['GET', 'POST'])
@cross_origin()
def calculate_optimized_shifts():
    # get requirements / shifts data
    try:
        data = json.loads(request.data, strict=False)
        requirements = data['requirements']
        shifts = data['shifts']
    except Exception as e:
        print('data from request could not be retrieved')
        print(e)
    
    # create requirement window objects
    requirement_windows = []
    for day, requirement_data in requirements.items():
        requirement_windows += [RequirementWindow(day, rd['start'], rd['end'], rd['demand']) for rd in requirement_data]

    # create time windows at the specified duration (in minutes)
    time_windows = create_time_windows(2, 30)

    # get no shift window from database
    # currently database and this function are only configured to handle one no shift window
    no_shift_window_from_db = get_no_shift_window()
    no_shift_db_data = [no_shift_window_from_db]

    # even though the db can only give us one window for now...
    # I'm going to make this a list to keep options open if we decide to expand
    no_shift_windows = []

    for nsw_dict in no_shift_db_data:
        no_shift_windows.append(NoShiftWindow(nsw_dict['start_time'], nsw_dict['end_time']))

    # create potential shift objects
    potential_shifts = []
    # if specific shifts are passed in JSON data, create PotentialShifts from these
    if len(shifts) > 0:
        for day, shift_data_dict in shifts.items():
            for start_time, length in shift_data_dict.items():
                potential_shifts.append(PotentialShift(day, start_time, length))
    # else create a PotentialShift at every time window interval
    else:
        for tw in time_windows:
            # exclude shifts if they are in a specified no-shift window
            shift_should_be_created = True
            for nsw in no_shift_windows:
                if tw.is_in_no_shift_window(nsw):
                    shift_should_be_created = False
                    break
            if shift_should_be_created:
                potential_shifts.append(PotentialShift(tw.day, tw.start_time_string, 8))

    # create decision variables to store number of workers needed per potential shift
    # num_workers_per_shift = LpVariable.dicts("num_workers_per_shift", list(range(len(potential_shifts))), lowBound=0, cat="Integer")
    num_workers_per_shift = LpVariable.dicts("num_workers_per_shift", potential_shifts, lowBound=0, cat="Integer")

    # create PuLP problem with objective to minimize
    problem = LpProblem("scheduling_workers", LpMinimize)

    # add to problem the goal of minimizing total number of workers assigned to potential shifts
    # problem += lpSum(num_workers_per_shift[j] for j in range(len(potential_shifts)))
    problem += lpSum(num_workers_per_shift[shift] for shift in potential_shifts)

    # add constraints that the demand for each time window must be satisfied
    for tw in time_windows:
        # problem += lpSum([tw.is_during_shift(potential_shifts[j]) * num_workers_per_shift[j] for j in range(len(potential_shifts))]) >= tw.get_demand(requirement_windows)
        problem += lpSum([tw.is_during_shift(shift) * num_workers_per_shift[shift] for shift in potential_shifts]) >= tw.get_demand(requirement_windows)

    # create binary tracker variables for each distinct shift (i.e. 0600, 0630, etc)
    # if one of these shifts is assigned on any day, the value of these binary variables becomes 1
    mid_shifts = {}
    day_shifts = {}
    eve_shifts = {}

    for shift in potential_shifts:
        if shift.type == 'MID':
            try:
                mid_shifts[shift.start_time]
            except KeyError:
                mid_shifts[shift.start_time] = LpVariable(shift.start_time, 0, 1, cat="Integer")  # shift is only allowed to be 0 or 1
            finally:
                problem += num_workers_per_shift[shift] <= 100000 * mid_shifts[shift.start_time]   # if number of shifts is greater than 1, y must equal 1
        elif shift.type == 'DAY':
            try:
                day_shifts[shift.start_time]
            except KeyError:
                day_shifts[shift.start_time] = LpVariable(shift.start_time, 0, 1, cat="Integer")  # shift is only allowed to be 0 or 1
            finally:
                problem += num_workers_per_shift[shift] <= 100000 * day_shifts[shift.start_time]   # if number of shifts is greater than 1, y must equal 1
        elif shift.type == 'EVE':
            try:
                eve_shifts[shift.start_time]
            except KeyError:
                eve_shifts[shift.start_time] = LpVariable(shift.start_time, 0, 1, cat="Integer")  # shift is only allowed to be 0 or 1
            finally:
                problem += num_workers_per_shift[shift] <= 100000 * eve_shifts[shift.start_time]   # if number of shifts is greater than 1, y must equal 1
        else:
            print('unknown shift type encountered')

    # get core and ancilliary data from database
    core_ancilliary_data = get_core_ancilliary_shift_data()

    # restrict number of shifts in each category to 6 (3 core and 3 ancillary)
    problem += lpSum(mid_shifts.values()) <= sum(core_ancilliary_data['mid'].values())
    problem += lpSum(day_shifts.values()) <= sum(core_ancilliary_data['day'].values())
    problem += lpSum(eve_shifts.values()) <= sum(core_ancilliary_data['eve'].values())
    
    # solve the problem with the constraints assigned
    problem.solve()
    
    # Get the status of the problem's solution
    status = LpStatus[problem.status]
    print(status)

    # create dict of workers required for each shift
    optimal_shift_requirements = {}
    optimal_shifts = []
    shift_categories = {'MID': [], 'DAY': [], 'EVE': []}
    for shift in potential_shifts:
        if num_workers_per_shift[shift].value() > 0:
            # append an instance of this shift for each time it is required
            for _ in range(int(num_workers_per_shift[shift].value())):
                optimal_shifts.append(shift)
            try:
                optimal_shift_requirements[shift.day][shift.start_time] = num_workers_per_shift[shift].value()
            except KeyError:
                optimal_shift_requirements[shift.day] = {}
                optimal_shift_requirements[shift.day][shift.start_time] = num_workers_per_shift[shift].value()
            if '{}-{}'.format(shift.start_time, shift.length) not in shift_categories[shift.type]:
                shift_categories[shift.type].append('{}-{}'.format(shift.start_time, shift.length))
    
    print(optimal_shift_requirements)
    # for day, shift_data in optimal_shift_requirements.items():
    #     print('{}: {}'.format(day, sum(shift_data.values())))
    print(shift_categories)

    create_optimized_shift_summary(time_windows, optimal_shifts, requirement_windows)

    return jsonify(optimal_shift_requirements)

@app.route('/generate_schedule_leave_summary', methods=['GET', 'POST'])
@cross_origin()
def schedule_leave_summary():
    data = json.loads(request.data, strict=False)
    leave_summary = generate_schedule_leave_summary(
        data["bid_schedule_id"],
        data["start_year"],
        data["start_month"],
        data["start_day"],
        data["end_year"],
        data["end_month"],
        data["end_day"]
    )
    print(leave_summary.filename)
    return send_file('schedule_leave_summary.xlsx', as_attachment=True)


# This parses a user uploaded work schedule (as excel file) and returns parsed schedule to Angular
@app.route('/parse_user_schedule', methods=['GET', 'POST'])
@cross_origin()
def parse_user_schedule():
    # possible import using pandas
    df = pd.read_excel(request.files.get('file'))
    print(df)
    days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

    # determine if the schedule is generated by straightline.io (no conversion needed) or by user (conversion needed)
    if "Pattern" in df.columns:
        schedule_type = "straightlines.io"
    else:
        schedule_type = "user_upload_standard"

    print("schedule type: " + schedule_type)

    if schedule_type == "user_upload_standard":
        # change each shift from military time to a decimal equivalent shift
        for day in days:
            for i in range(len(df)):
                shift = df.at[i, day]
                if shift != "X":
                    hour = shift[0: 2]
                    minute = shift[2:]
                    numeric_time = int(hour) + (int(minute) / 60)
                    if ((numeric_time % 1) == 0):
                        numeric_time = int(numeric_time)
                    df.at[i, day] = numeric_time

        # create list to track shifts that have been added to total_shifts_df
        shifts = []

        # determine if this is a 8 hour or 10 hour schedule
        num_of_days_in_rdo = 0
        for day in days:
            shift = df.at[0, day]
            if shift == "X":
                num_of_days_in_rdo += 1

        if num_of_days_in_rdo == 2:
            shift_length = 8
        elif num_of_days_in_rdo == 3:
            shift_length = 10
        else:
            shift_length = "error"
            print("shift length besides 8 or 10 calculated based on number of RDO")

        # identify and add pattern for each shift line
        pattern = []

        # build pattern for each row
        for i in range(len(df)):
            pattern_string = ''
            for day in days:
                shift = df.at[i, day]
                if shift != "X":
                    if shift not in shifts:
                        shifts.append(shift)
                if shift == 'X':
                    pattern_string += 'X'
                elif shift == 7 - (shift_length / 2):
                    pattern_string += 'S'
                elif shift == 15 - (shift_length / 2):
                    pattern_string += 'S'
                elif shift == 23 - (shift_length / 2):
                    pattern_string += 'S'
                elif isinstance(shift, list):
                    pattern_string += '[ ]'
                else:
                    shift_type = determine_type_of_shift(shift, shift_length)

                    if shift_type == "MID":
                        pattern_string += 'M'
                    elif shift_type == "DAY":
                        pattern_string += "D"
                    else:
                        pattern_string += "E"

            if num_of_days_in_rdo == 2:
                if "XX" in pattern_string:
                    pattern_string_list = pattern_string.split('XX')
                    pattern_string_to_append = pattern_string_list[1] + pattern_string_list[0]
                else:
                    pattern_string_to_append = ''
                    for char in pattern_string:
                        if char != 'X':
                            pattern_string_to_append += char
            elif num_of_days_in_rdo == 3:
                if "XXX" in pattern_string:
                    pattern_string_list = pattern_string.split('XXX')
                    pattern_string_to_append = pattern_string_list[1] + pattern_string_list[0]
                elif "XX" in pattern_string:
                    pattern_string_list = pattern_string.split('XX')
                    temp_pattern_string_to_append = pattern_string_list[1] + pattern_string_list[0]
                    pattern_string_to_append = ''
                    for char in temp_pattern_string_to_append:
                        if char != 'X':
                            pattern_string_to_append += char
                else:
                    pattern_string_to_append = ''
                    for char in pattern_string:
                        if char != 'X':
                            pattern_string_to_append += char

            pattern.append(pattern_string_to_append)

        df["Pattern"] = pattern

    elif schedule_type == "straightlines.io":
        shifts = []
        for i in range(len(df)):
            for day in days:
                shift = df.at[i, day]
                if shift != "X":
                    if shift == 1:
                        shift = 13
                    elif shift == 3:
                        shift = 15
                    elif shift == 4:
                        shift = 16
                    elif shift == "M":
                        shift = 23
                    elif shift == "N":
                        shift = 0

                    df.at[i, day] = shift

                    if shift not in shifts:
                        shifts.append(shift)

    # create dataframe to hold number of each shift assigned per day
    total_shifts_df = pd.DataFrame(columns=days)
    shifts.sort()

    for shift in shifts:
        df_to_append = pd.DataFrame([[0, 0, 0, 0, 0, 0, 0]], columns=days, index=[shift])
        total_shifts_df = total_shifts_df.append(df_to_append)

    for i in range(len(df)):
        for day in days:
            shift = df.at[i, day]
            if isinstance(shift, (int, float)):
                total_shifts_df.at[shift, day] += 1

    df_st = dataframe_int_to_st(df)
    df_st.drop('ID', inplace=True, axis=1)

    json_to_return = [{"generated_schedule_1": {"schedule": df_st.to_json(), "shift totals": total_shifts_df.to_json(), "outliers": {}, "pwp_error": {}}}]

    print(total_shifts_df)
    print(df_st)

    return jsonify(json_to_return)


# This allows angular to check a user created/edited shift line
@app.route('/check_shift_line', methods=['GET', 'POST'])
@cross_origin()
def check_shift_line():
    data = json.loads(request.data, strict=False)
    shift_length = data['shift_length']
    shift_line_mt = data['shift_line']

    # convert from mt to st
    shift_line = []
    for i in range(len(shift_line_mt)):
        if shift_line_mt[i] == "X":
            shift_line.append('X')
        else:
            shift_line.append(mt_to_int(shift_line_mt[i]))

    if errors_in_shift_line(shift_line, shift_length):
        return jsonify({"business_rules": False})
    else:
        return jsonify({"business_rules": True})
    
# This allows angular to check a user created/edited shift line array
@app.route('/check_shift_line_array', methods=['GET', 'POST'])
@cross_origin()
def check_shift_line_array():
    data = json.loads(request.data, strict=False)
    results = []
    for item in data:
        if 'shift_length' in item:
            shift_length = item['shift_length']
            shift_line_mt = item['shift_line']

            # convert from mt to st
            shift_line = []
            for i in range(len(shift_line_mt)):
                if shift_line_mt[i] == "X":
                    shift_line.append('X')
                else:
                    shift_line.append(mt_to_int(shift_line_mt[i]))

            if errors_in_shift_line(shift_line, shift_length):
                results.append({"business_rules": False})
            else:
                results.append({"business_rules": True})
        else:
            if len(item) == 7:
                shift_line_nine = ShiftLine(1)
            elif len(item) == 14:
                shift_line_nine = ShiftLine(2)
            else:
                print("Incorrect number of shifts detected")

            for day, shift_length_dict in item.items():
                shift = shift_length_dict['shift']
                length = shift_length_dict['length']

                if shift != "X":
                    shift_line_nine.shift_on[day].fill(shift, length)
                else:
                    shift_line_nine.shift_on[day].make_rdo()

            print(shift_line_nine)

            if shift_line_nine.check_business_rules():
                results.append({"business_rules": True})
            else:
                results.append({"business_rules": False})
    return jsonify(results)


# This allows angular to pass a single shift line with changed shifts and returns the shift line names
@app.route('/get_shift_line_name', methods=['GET', 'POST'])
@cross_origin()
def get_shift_line_name():
    data = json.loads(request.data, strict=False)
    shift_line = data['shift_line']
    days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    day_shift_dict = {}

    for i in range(0, 7):
        day_shift_dict[days[i]] = shift_line[i]

    shift_line_name = ""

    current_day = ""
    for day in days:
        shift = day_shift_dict[day]
        next_day_shift = day_shift_dict[next(day)]
        if shift == "X" and next_day_shift == "X":
            current_day = day
            break

    for x in range(0, 7):
        shift = day_shift_dict[current_day]
        if shift == "X":
            if current_day == "THU":
                shift_line_name += "Th"
            else:
                shift_line_name += current_day[0:1]
        current_day = next(current_day)

    return {'shift_line_name': shift_line_name}


# This allows angular to check a user created/edited HYBRID shift line
@app.route('/check_hybrid_shift_line', methods=['GET', 'POST'])
@cross_origin()
def check_hybrid_shift_line():
    data = json.loads(request.data, strict=False)

    if len(data) == 7:
        shift_line = ShiftLine(1)
    elif len(data) == 14:
        shift_line = ShiftLine(2)
    else:
        print("Incorrect number of shifts detected")

    for day, shift_length_dict in data.items():
        shift = shift_length_dict['shift']
        length = shift_length_dict['length']

        if shift != "X":
            shift_line.shift_on[day].fill(shift, length)
        else:
            shift_line.shift_on[day].make_rdo()

    print(shift_line)

    if shift_line.check_business_rules():
        return jsonify({"business_rules": True})
    else:
        return jsonify({"business_rules": False})
    




@app.route('/schedule/<int:employees_number>', methods=['GET', 'POST'])
@cross_origin()
def main(employees_number):

    # # set a 15 second allotment for the program to run
    # timeout = time.time() + 15

    # list of days to aid in looping through various tasks
    days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

    # load JSON
    input_data = json.loads(request.data, strict=False)
    # print(input_data)

    # store shift length
    shift_length = input_data["shift_length"]
    # store preferred work pattern (list)
    preferred_work_pattern = input_data['PWP']

    # Indicate if user wants contiguous RDO pairs - will need to be passed from user in future!
    RDO_is_contiguous = True

    # store preferred shift order (list)
    preferred_shift_order_military_time = input_data['PSO']
    # convert preferred shift order values from military time to integer equivalents
    preferred_shift_order = []
    for i in range(0, len(preferred_shift_order_military_time)):
        preferred_shift_order.append(mt_to_int(preferred_shift_order_military_time[i]))

    # determine if user requested a PSO that violates business rules
    if errors_in_PSO(preferred_shift_order, preferred_shift_order_military_time, RDO_is_contiguous, shift_length):
        PSO_error_string = errors_in_PSO(preferred_shift_order, preferred_shift_order_military_time, RDO_is_contiguous, shift_length)
        print(PSO_error_string)
        return jsonify([{"generated_schedule_1": {"schedule": {}, "shift totals": {}, "outliers": {}, "pwp_error": PSO_error_string}}])


    # store daily shifts (object)
    daily_shifts_military_time = input_data['daily_shifts']

    # check for outlier in data set
    outliers = check_for_large_outliers(daily_shifts_military_time)
    if outliers:
        for shift in outliers.keys():
            for day, quantity in outliers[shift].items():
                print('Outlier of {} found on {} for shift {}'.format(quantity, day, shift))
        return jsonify([{"generated_schedule_1": {"schedule": {}, "shift totals": {}, "outliers": outliers, "pwp_error": {}}}])
    else:
        print('No outliers detected')

    number_of_attempts = 0
    num_RDO_failures = 0
    extra_workers = 0
    list_of_schedules = []
    number_of_random_schedules = 1
    schedule_incomplete = True

    # Constant that determines how many attempts will be made before returning an imperfect list
    max_number_of_attempts = 6

    # The below code will continue to run (with extra shifts assigned randomly) until solution is found or number of attempts is exceeded
    while schedule_incomplete:

    #     if time.time() > timeout:
    #         return "Schedule could not be generated, please try again"

        # convert daily shift data from military time to integer equivalents
        # this must be redone every loop to remove random shifts from last pass
        daily_shifts = {}
        for day in days:
            daily_shifts[day] = {}
            for shift_time, quantity in daily_shifts_military_time[day].items():
                daily_shifts[day][mt_to_int(shift_time)] = quantity
        # print(daily_shifts)

        # ensure daily shifts is in the correct order
        daily_shifts = sort_daily_shifts(daily_shifts)
        # print('daily shifts', daily_shifts)

        # if RDO failures are repeatedly happening, add an extra worker
        if num_RDO_failures == 3 and number_of_attempts < max_number_of_attempts:
            num_RDO_failures = 0
            extra_workers += 1

        # sort possible shifts by type
        # allows code to search for alternate options if preferred shift is not possible
        shifts_of_type = {}
        shifts_of_type['EVE'] = []
        shifts_of_type['DAY'] = []
        shifts_of_type['MID'] = []
        for shift in daily_shifts['SUN'].keys():
            shifts_of_type[determine_type_of_shift(shift, shift_length)].insert(0, shift)
        # print('shift types:', shifts_of_type)

        # Find the total # shifts per day for SUN - SAT
        total_shifts_per_day = {}
        for day in days:
            total_shifts_per_day[day] = 0
            for quantity in daily_shifts[day].values():
                total_shifts_per_day[day] += quantity
        # print('total shifts per day:', total_shifts_per_day)

        # find total number of shifts for the week
        total_shifts_in_week = 0
        for day, total_shifts in total_shifts_per_day.items():
            total_shifts_in_week += total_shifts
        # print('total shifts in week', total_shifts_in_week)

        # determine number of extra shifts to assign to make total number of shifts divisible
        # by 5 if 8-hr shift or by 4 if 10-hr shift
        shifts_to_assign = int(((40 / shift_length) - (total_shifts_in_week % (40 / shift_length))) % (40 / shift_length))
        # print('shifts_to_assign', shifts_to_assign)

        # add shifts based on necessary extra workers
        shifts_to_assign = int(shifts_to_assign + (extra_workers * (int(40/shift_length))))
        # print('shifts_to_assign (with extra workers)', shifts_to_assign)

        # if there are extra shifts to assign...
        if shifts_to_assign != 0:

            # Assigning random shifts will make multiple schedule solutions possible
            # This will tell the code to try to find and save multiple solution
            number_of_random_schedules = 3

            if number_of_attempts % 2 == 0:
                daily_shifts = generate_busiest_workday_shifts_to_add(shifts_to_assign, daily_shifts)

                # update daily shift totals
                total_shifts_per_day = {}
                for day in days:
                    total_shifts_per_day[day] = 0
                    for quantity in daily_shifts[day].values():
                        total_shifts_per_day[day] += quantity
                # print('updated total shifts per day:', total_shifts_per_day)

                # update total shifts in week
                total_shifts_in_week = 0
                # find total number of shifts for the week
                for day, total_shifts in total_shifts_per_day.items():
                    total_shifts_in_week += total_shifts
                # print('updated total shifts in week', total_shifts_in_week)

            else:
                # add shifts randomly to schedule to make total shifts evenly divisible
                daily_shifts, total_shifts_per_day = generate_targeted_random_shifts_to_add(shifts_to_assign, total_shifts_per_day, daily_shifts)

                # update total shifts in week
                total_shifts_in_week = 0
                # find total number of shifts for the week
                for day, total_shifts in total_shifts_per_day.items():
                    total_shifts_in_week += total_shifts
                # print('updated total shifts in week', total_shifts_in_week)

        # determine number of workers needed based on shift length
        number_of_workers = int(total_shifts_in_week / (40 / shift_length))
        # print('number of workers:', number_of_workers)

        # determine days off per day for SUN - SAT
        days_off_per_day = {}
        for day, shifts in daily_shifts.items():
            days_off_per_day[day] = 0
            for shift_time, quantity in shifts.items():
                days_off_per_day[day] = number_of_workers - total_shifts_per_day[day]
        # print('Days off per day:', days_off_per_day)

        # calculate total days off
        total_days_off = 0
        for day in days:
            total_days_off += days_off_per_day[day]
        # print('total days off:', total_days_off)

        # determine the number of days in RDO based on shift length
        num_of_days_in_rdo = 7 - int((40 / shift_length))

        # identify pattern for RDOs to follow
        if num_of_days_in_rdo == 3:
            if RDO_is_contiguous:
                RDO_pattern = [1, 1, 1, 0, 0, 0, 0]
            else:
                RDO_pattern = [1, 1, 0, 0, 1, 0, 0]
        else:
            RDO_pattern = [1, 1, 0, 0, 0, 0, 0]

        # determine number of each rdo pair/triple needed
        # this is a dictionary where the value of each sequence is stored as an element
        try:
            RDO = calc_num_of_each_rdo_sequence(num_of_days_in_rdo, RDO_pattern, RDO_is_contiguous, days_off_per_day, num_RDO_failures)
        except ImpossibleRdoError:
            print('impossible RDO pair/triple value encountered')
            number_of_attempts += 1
            num_RDO_failures += 1
            continue
        print('RDO:', RDO)

        # create dataframe to hold worker schedule
        blank_schedule = {}
        for day in days:
            blank_schedule[day] = [None] * number_of_workers
        df = pd.DataFrame(blank_schedule)

        # # determine number of mid shifts in PSO
        # num_of_mid_in_PSO = 0
        # for shift in preferred_shift_order:
        #     if shift in shifts_of_type['MID']:
        #         num_of_mid_in_PSO += 1
        # # print(num_of_mid_in_PSO)

        # Assign RDO
        ind = 0
        pair_triple_lists = []
        pair_triple_filled = {}
        for pair_triple, quantity in RDO.items():
            pair_triple_filled[pair_triple] = True
            pair_triple_days = pair_triple.split("_")
            pair_triple_lists.append(pair_triple_days)
            for i in range(ind, ind + quantity):
                for day in pair_triple_days:
                    df.at[i, day] = "X"
            ind += quantity

        # Create dict to track number of each shift assigned
        shifts_assigned_on = {}
        for day in days:
            shifts_assigned_on[day] = {}
            for shift in daily_shifts[day].keys():
                shifts_assigned_on[day][shift] = 0

        # Assign PSO when possible
        while True in pair_triple_filled.values():
            # Look at each RDO pair/triple one at a time
            for pair_triple_days in pair_triple_lists:
                # only look at a pair_triple if it was filled on the last pass of the loop
                if pair_triple_filled['_'.join(pair_triple_days)]:
                    # set pair_triple_filled to false --- this will be changed to true if a successful assignment occurs later
                    pair_triple_filled['_'.join(pair_triple_days)] = False
                    # Look at each row
                    for i in range(0, number_of_workers):
                        # Identify the first row with this RDO pair/triple
                        row_to_fill = True
                        for day in pair_triple_days:
                            if df.at[i, day] == 'X':
                                continue
                            else:
                                row_to_fill = False
                                break

                        # If row with given RDO pair/triple identified
                        if row_to_fill == True:
                            # Determine if row is empty
                            if None in list(df.loc[i]):
                                # If so, find the first day after 2 consecutive RDO
                                for day in days:
                                    if df.at[i, previous(day)] == 'X' and df.at[i, day] == 'X' and df.at[i, next(day)] != 'X':
                                        current_day_to_fill = next(day)
                                        break
                                # Starting at day after RDO...
                                # Fill in empty days according to PSO
                                for j in range(0, len(preferred_shift_order)):
                                    pair_triple_filled['_'.join(pair_triple_days)] = False
                                    PSO_shift = preferred_shift_order[j]
                                    # check if PSO shift can be assigned without exceeding # specified by daily_shifts
                                    if shifts_assigned_on[current_day_to_fill][PSO_shift] < daily_shifts[current_day_to_fill][PSO_shift] and sufficient_rest_between_shifts(df.at[i, previous(current_day_to_fill)], PSO_shift, shift_length):
                                        df.at[i, current_day_to_fill] = PSO_shift
                                        shifts_assigned_on[current_day_to_fill][PSO_shift] += 1
                                        pair_triple_filled['_'.join(pair_triple_days)] = True
                                        # advance current day -- if it is an RDO (for non-contiguous RDO) move past RDO day
                                        current_day_to_fill = next(current_day_to_fill)
                                        while df.at[i, current_day_to_fill] == "X":
                                            current_day_to_fill = next(current_day_to_fill)
                                    # If not, identify and assign alternative shift of same type
                                    else:
                                        # try to assign alternative shifts of same type if first attempt
                                        # This could potentially be too restrictive (only do the first 2 attempts)
                                        if number_of_attempts < 2:
                                            # identify type of PSO shift
                                            type_of_PSO_shift = determine_type_of_shift(PSO_shift, shift_length)
                                            # identify shifts on day of same type as PSO shift
                                            for alternative_shift in daily_shifts[current_day_to_fill].keys():
                                                if determine_type_of_shift(alternative_shift, shift_length) == type_of_PSO_shift and alternative_shift != PSO_shift and daily_shifts[current_day_to_fill][alternative_shift] != 0 and sufficient_rest_between_shifts(df.at[i, previous(current_day_to_fill)], alternative_shift, shift_length):
                                                    # assign alternative shift of same type if possible without exceeding daily_shifts limits
                                                    if shifts_assigned_on[current_day_to_fill][alternative_shift] < daily_shifts[current_day_to_fill][alternative_shift]:
                                                        df.at[i, current_day_to_fill] = alternative_shift
                                                        shifts_assigned_on[current_day_to_fill][alternative_shift] += 1
                                                        pair_triple_filled['_'.join(pair_triple_days)] = True
                                                        # advance current day -- if it is an RDO (for non-contiguous RDO) move past RDO day
                                                        current_day_to_fill = next(current_day_to_fill)
                                                        while df.at[i, current_day_to_fill] == "X":
                                                            current_day_to_fill = next(current_day_to_fill)
                                                        break

                                    # check to see if PSO_shift or alternative was not assigned
                                    # need to use previous since day has already been advanced
                                    if not pair_triple_filled['_'.join(pair_triple_days)]:
                                        # if no shift assigned, clear row and move on
                                        for day in days:
                                            if df.at[i, day] != 'X' and df.at[i, day] != None:
                                                shifts_assigned_on[day][df.at[i, day]] -= 1
                                                df.at[i, day] = None
                                        break
                                break

        print('df after PSO assigned')
        print(df)

        # check if any mid-shifts still need to be assigned
        mids_filled_for_day = {}
        for day in days:
            mids_filled_for_day[day] = True

        # First assign to empty days that occur before RDO (5 day schedule) or after RDO (4 day schedule)
        for day in days:
            for mid_shift in shifts_of_type['MID']:
                for i in range(0, number_of_workers):
                    if num_of_shifts_of_type_assigned_for_day(day, mid_shift, df) < daily_shifts[day][mid_shift]:
                        # for 8 hour schedule, fill mids before RDO
                        if num_of_days_in_rdo == 2:
                            if df.at[i, day] == None and df.at[i, next(day)] == 'X':
                                df.at[i, day] = mid_shift
                        # for 10 hour schedule, fill mids after RDO and try to stack as many as possible
                        else:
                            if df.at[i, day] == None and df.at[i, previous(day)] == "X":
                                df.at[i, day] = mid_shift
                                next_day_to_fill = next(day)
                                while df.at[i, next_day_to_fill] == None and num_of_shifts_of_type_assigned_for_day(next_day_to_fill, mid_shift, df) < daily_shifts[next_day_to_fill][mid_shift] and valid_number_of_consecutive_shifts(i, df, 'MID', shift_length, mid_shift, next_day_to_fill):
                                    df.at[i, next_day_to_fill] = mid_shift
                                    next_day_to_fill = next(next_day_to_fill)
                    else:
                        break
                # if we make it through the for loop without breaking a mid-shift has not been assigned
                if i == number_of_workers - 1:
                    mids_filled_for_day[day] = False

        # next assign to empty days that occur before a mid-shift (8 hour schedule) or after a mid-shift (10 hour schedule)
        for day in days:
            if mids_filled_for_day[day]:
                continue
            else:
                mids_filled_for_day[day] = True
                for mid_shift in shifts_of_type['MID']:
                    for i in range(0, number_of_workers):
                        if num_of_shifts_of_type_assigned_for_day(day, mid_shift, df) < daily_shifts[day][mid_shift]:
                            # if 8 hour schedule, fill in before mid-shifts with mid-shifts
                            if num_of_days_in_rdo == 2:
                                if df.at[i, day] == None and df.at[i, next(day)] in shifts_of_type['MID']:
                                    if df.at[i, previous(day)] == None or sufficient_rest_between_shifts(df.at[i, previous(day)], mid_shift, shift_length):
                                        df.at[i, day] = mid_shift
                            # if 10 hour schedule, fill in after mid-shifts with mid-shifts
                            else:
                                if df.at[i, day] == None and df.at[i, previous(day)] in shifts_of_type['MID']:
                                    if df.at[i, next(day)] == None or sufficient_rest_between_shifts(mid_shift, df.at[i, next(day)], shift_length):
                                        if valid_number_of_consecutive_shifts(i, df, 'MID', shift_length, mid_shift, day):
                                            df.at[i, day] = mid_shift
                        else:
                            break
                    # if we make it through the for loop without breaking a mid-shift has not been assigned
                    if i == number_of_workers - 1:
                        mids_filled_for_day[day] = False

        # next assign to filled days that occur before/after a mid-shift / RDO
        for day in days:
            if mids_filled_for_day[day]:
                continue
            else:
                mids_filled_for_day[day] = True
                for mid_shift in shifts_of_type['MID']:
                    for i in range(0, number_of_workers):
                        if num_of_shifts_of_type_assigned_for_day(day, mid_shift, df) < daily_shifts[day][mid_shift]:

                            # assign remaining mids before existing mids for 8 hour schedule
                            if num_of_days_in_rdo == 2:
                                if (not (df.at[i, day] in shifts_of_type['MID'])) and df.at[i, day] != "X" and df.at[i, next(day)] in shifts_of_type['MID']:
                                    df.at[i, day] = mid_shift
                                else:
                                    continue
                                # check if assigning mid-shift broke rest rule with previous shift
                                # if so, find alternative shift for previous shift
                                if df.at[i, previous(day)] != None:
                                    if not sufficient_rest_between_shifts(df.at[i, previous(day)], mid_shift, shift_length):
                                        rest_issue = True
                                        for alt_shift, quantity in daily_shifts[day].items():
                                            if quantity != 0:
                                                if num_of_shifts_of_type_assigned_for_day(previous(day), alt_shift, df) < daily_shifts[previous(day)][alt_shift]:
                                                    if desirable_move_between_shifts(df.at[i, previous(day)], alt_shift, shift_length):
                                                        if sufficient_rest_between_shifts(df.at[i, previous(previous(day))], alt_shift, shift_length) and sufficient_rest_between_shifts(alt_shift, mid_shift, shift_length):
                                                            df.at[i, previous(day)] = alt_shift
                                                            rest_issue = False
                                        # if the rest issue cannot be resolved, clear row of all but the mid-shifts
                                        if rest_issue:
                                            for day in days:
                                                if df.at[i, day] != 'X':
                                                    if determine_type_of_shift(df.at[i, day], shift_length) != 'MID':
                                                        df.at[i, day] == None

                            # assign remaining mids after existing mids for 10 hour schedule
                            else:
                                if (not (df.at[i, day] in shifts_of_type['MID'])) and df.at[i, day] != "X" and df.at[i, previous(day)] in shifts_of_type['MID'] and valid_number_of_consecutive_shifts(i, df, 'MID', shift_length, mid_shift, day):
                                    df.at[i, day] = mid_shift
                                else:
                                    continue
                                # check if assigning mid-shift broke rest rule with next shift
                                # if so, find alternative shift for next shift
                                if df.at[i, previous(day)] != None:
                                    if not sufficient_rest_between_shifts(mid_shift, df.at[i, next(day)], shift_length):
                                        rest_issue = True
                                        for alt_shift, quantity in daily_shifts[day].items():
                                            if quantity != 0:
                                                if num_of_shifts_of_type_assigned_for_day(next(day), alt_shift, df) < daily_shifts[next(day)][alt_shift]:
                                                    if desirable_move_between_shifts(alt_shift, df.at[i, next(day)], shift_length):
                                                        if sufficient_rest_between_shifts(alt_shift, df.at[i, next(next(day))], shift_length) and sufficient_rest_between_shifts(mid_shift, alt_shift, shift_length):
                                                            df.at[i, next(day)] = alt_shift
                                                            rest_issue = False
                                        # if the rest issue cannot be resolved, clear row of all but the mid-shifts
                                        if rest_issue:
                                            for day in days:
                                                if df.at[i, day] != 'X':
                                                    if determine_type_of_shift(df.at[i, day], shift_length) != 'MID':
                                                        df.at[i, day] == None
                        else:
                            break
                    # if we make it through the for loop without breaking a mid-shift has not been assigned
                    if i == number_of_workers - 1:
                        mids_filled_for_day[day] = False

        # Finally fill in filled cells after RDO (for 10 hour shifts)
        for day in days:
            if mids_filled_for_day[day]:
                continue
            else:
                mids_filled_for_day[day] = True
                for mid_shift in shifts_of_type['MID']:
                    for i in range(0, number_of_workers):
                        if num_of_shifts_of_type_assigned_for_day(day, mid_shift, df) < daily_shifts[day][mid_shift]:
                            # if the previous day is an RDO and the current days is not an RDO or a mid-shift
                            if df.at[i, previous(day)] == "X" and df.at[i, day] != 'X' and (not (df.at[i, day] in shifts_of_type['MID'])) and valid_number_of_consecutive_shifts(i, df, 'MID', shift_length, mid_shift, day):
                                # Replace the shift with a mid-shift
                                # rest does not need to be checked since any shift can follow a mid-shift
                                df.at[i, day] = mid_shift
                        else:
                            break
                    # if we make it through the for loop without breaking a mid-shift has not been assigned
                    if i == number_of_workers - 1:
                        mids_filled_for_day[day] = False


        print('df after remaining mids assigned')
        print(df)

        # Update shifts_assigned_on based on mid-shift assignment
        shifts_assigned_on = {}
        for day in days:
            shifts_assigned_on[day] = {}
            for shift in daily_shifts[day].keys():
                shifts_assigned_on[day][shift] = num_of_shifts_of_type_assigned_for_day(day, shift, df)

        # Look at each day - assign list of all potential shifts to empty cells
        for day in days:
            for i in range(0, number_of_workers):
                if df.at[i, day] == None:
                    df.at[i, day] = list_of_potential_shifts(day, shifts_assigned_on, daily_shifts)

        # Check cascade on all existing shifts
        for day in days:
            for i in range(0, number_of_workers):
                if isinstance(df.at[i, day], int):
                    try:
                        cascade(i, day, shifts_assigned_on, daily_shifts, df, shift_length, number_of_workers)
                    except CascadeError:
                        print("Cascade Error")

        # Check if any impossible shifts have been created
        impossible_cells_to_fill = det_impossible_cells_to_fill(df, number_of_workers)
        print('impossible cells to fill:', impossible_cells_to_fill)

        # look at each day one by one (start with Sunday)
        # fill in missing shifts starting with earliest and working towards latest

        # look at each day
        for day in days:
            # start by assuming there is no index to fill (i is equal to the number of workers)
            index_of_first_shift_to_fill = number_of_workers
            # for each day, track when the first shift to fill is located
            first_shift_after_days_off_located = False
            # cycle through each shift
            for i in range(1, number_of_workers):
                # locate the first row after consecutive day off shifts
                if df.at[i - 1, day] == 'X' and df.at[i, day] != 'X' and df.at[i, next(day)] == "X" and df.at[i, next(next(day))] == "X":
                    first_shift_after_days_off_located = True
                # then locate the first shift to fill
                if first_shift_after_days_off_located and isinstance(df.at[i, day], list):
                    index_of_first_shift_to_fill = i
                    break

            # Fill in all empty shifts after earliest shift with the earliest possible shift
            for i in range(index_of_first_shift_to_fill, number_of_workers):
                # look at each possible shift in order M-D-E
                if isinstance(df.at[i, day], list):
                    shift_after_mid_shift = False
                    if not isinstance(df.at[i, previous(day)], list) and df.at[i, previous(day)] != "X":
                        if determine_type_of_shift(df.at[i, previous(day)], shift_length) == "MID":
                            shift_after_mid_shift = True
                    if shift_after_mid_shift:
                        temp_list_of_shifts = []
                        for s in daily_shifts[day].keys():
                            if shifts_assigned_on[day][s] < daily_shifts[day][s]:
                                temp_list_of_shifts.append(s)
                    else:
                        temp_list_of_shifts = df.at[i, day].copy()
                    for shift in temp_list_of_shifts:
                        # check if current cell is empty
                        # check if current shift can be assigned without exceeding specified number of shift type
                        shift_assigned = assign_shift(i, day, shift, shifts_assigned_on, daily_shifts, df, shift_length, number_of_workers)
                        if shift_assigned:
                            shifts_assigned_on = shift_assigned
                            break

            # cycle back and fill in shifts that were above RDO in the table
            for i in range(0, index_of_first_shift_to_fill):
                # look at each possible shift in order M-D-E
                if isinstance(df.at[i, day], list):
                    shift_after_mid_shift = False
                    if not isinstance(df.at[i, previous(day)], list) and df.at[i, previous(day)] != "X":
                        if determine_type_of_shift(df.at[i, previous(day)], shift_length) == "MID":
                            shift_after_mid_shift = True
                    if shift_after_mid_shift:
                        temp_list_of_shifts = []
                        for s in daily_shifts[day].keys():
                            if shifts_assigned_on[day][s] < daily_shifts[day][s]:
                                temp_list_of_shifts.append(s)
                    else:
                        temp_list_of_shifts = df.at[i, day].copy()
                    for shift in temp_list_of_shifts:
                        # check if current cell is empty
                        # check if current shift can be assigned without exceeding specified number of shift type
                        shift_assigned = assign_shift(i, day, shift, shifts_assigned_on, daily_shifts, df, shift_length, number_of_workers)
                        if shift_assigned:
                            shifts_assigned_on = shift_assigned
                            break

        # determine number of each type of shift assigned on each day
        number_of_each_shift_on = determine_number_of_each_shift(df, number_of_workers)

        # find number of each type of shift per day that could not be assigned
        missing_shifts = determine_number_of_missing_shifts_per_day(number_of_each_shift_on, daily_shifts)

        # Use these for debugging -- check number of missing shifts before replacement
        print('missing shifts before replacement:', missing_shifts)
        print(df)

        # track if every day is looked at without any missing shifts assigned (avoid infinite loop)
        missing_shifts_assigned = True

        # Keep looking at missing shifts dict until a pass is made with no shifts assigned
        while missing_shifts_assigned:
            # track if every day is looked at without any missing shifts assigned (avoid infinite loop)
            missing_shifts_assigned = False
            # Look at each day remaining for the current pass of the dict
            for day in missing_shifts.keys():
                # check if any missing shifts remain on this day
                if len(list(missing_shifts[day].keys())) == 0:
                    continue
                else:
                    # Track if day still contains missing shifts
                    missing_shifts_on_current_day = True
                    # Identify a missing shift on the day
                    missing_shift = list(missing_shifts[day].keys())[0]
                    # Locate row/schedule with missing shift
                    for i in range(0, number_of_workers):
                        if isinstance(df.at[i, day], list):
                            index_of_missing_shift = i

                            # Look at each worker schedule
                            for j in range(0, number_of_workers):
                                # Check if the missing shift fits into given schedule
                                current_for_given_shift = df.at[j, day]
                                if current_for_given_shift == 'X':
                                    continue
                                previous_for_given_shift = df.at[j, previous(day)]
                                next_for_given_shift = df.at[j, next(day)]

                                if number_of_attempts < max_number_of_attempts - 2:
                                    missing_shift_can_be_inserted = sufficient_rest_between_shifts(previous_for_given_shift, missing_shift, shift_length) and sufficient_rest_between_shifts(missing_shift, next_for_given_shift, shift_length) and desirable_move_between_shifts(previous_for_given_shift, missing_shift, shift_length) and desirable_move_between_shifts(missing_shift, next_for_given_shift, shift_length) and valid_number_of_consecutive_shifts(j, df, 'MID', shift_length, missing_shift, day)
                                else:
                                    missing_shift_can_be_inserted = sufficient_rest_between_shifts(previous_for_given_shift, missing_shift, shift_length) and sufficient_rest_between_shifts(missing_shift, next_for_given_shift,shift_length) and valid_number_of_consecutive_shifts(j, df, 'MID', shift_length, missing_shift, day)

                                # check if shift from given schedule fits in missing slot
                                if missing_shift_can_be_inserted:
                                    previous_for_missing_shift = df.at[index_of_missing_shift, previous(day)]
                                    next_for_missing_shift = df.at[index_of_missing_shift, next(day)]

                                    if number_of_attempts < max_number_of_attempts - 2:
                                        current_given_shift_can_replace_missing = sufficient_rest_between_shifts(previous_for_missing_shift, current_for_given_shift, shift_length) and sufficient_rest_between_shifts(current_for_given_shift, next_for_missing_shift, shift_length) and desirable_move_between_shifts(previous_for_missing_shift, current_for_given_shift, shift_length) and desirable_move_between_shifts(current_for_given_shift, next_for_missing_shift, shift_length) and valid_number_of_consecutive_shifts(j, df, 'MID', shift_length, current_for_given_shift, day)
                                    else:
                                        current_given_shift_can_replace_missing = sufficient_rest_between_shifts(previous_for_missing_shift, current_for_given_shift, shift_length) and sufficient_rest_between_shifts(current_for_given_shift, next_for_missing_shift, shift_length) and valid_number_of_consecutive_shifts(j, df, 'MID', shift_length, current_for_given_shift, day)

                                    # if so, change shift assignments
                                    if current_given_shift_can_replace_missing:
                                        df.at[j, day] = missing_shift
                                        df.at[index_of_missing_shift, day] = current_for_given_shift
                                        # track that a missing shift has been assigned (keep the loop going)
                                        missing_shifts_assigned = True
                                        # remove quantity of one from missing shift list
                                        missing_shifts[day][missing_shift] -= 1
                                        # if no more of that missing shift exist, remove it
                                        if missing_shifts[day][missing_shift] == 0:
                                            del missing_shifts[day][missing_shift]
                                        # look at the next missing shift on the given day (if there are any)
                                        try:
                                            missing_shift = list(missing_shifts[day].keys())[0]
                                            break
                                        # if the day no longer has a missing shift, delete it
                                        except IndexError:
                                            missing_shifts_on_current_day = False
                                            break

                            # if there are no longer missing shifts on this day, move on to the next day
                            if not missing_shifts_on_current_day:
                                break

        # Use these for debugging purposes -- see how close a failed schedule is to full
        missing_shifts = clear_empty_days(missing_shifts)
        print('missing shifts after replacement:', missing_shifts)
        missing_shift_count = get_missing_shift_count(missing_shifts)
        print(df)

        # Try to fill remaining missing shifts by swapping series of shifts before/after to allow missing shift to be filled

        # look at each day that still contains a missing shift
        for day in missing_shifts.keys():
            # locate a cell with a missing shift
            for i in range(0, number_of_workers):
                if isinstance(df.at[i, day], list):
                    # Look at each possible shift to fill it one-by-one
                    for shift, quantity in missing_shifts[day].items():
                        # determine if shift before/after/both is preventing shift assignment
                        direction = None
                        if not sufficient_rest_between_shifts(df.at[i, previous(day)], shift, shift_length) or not desirable_move_between_shifts(df.at[i, previous(day)], shift, shift_length):
                            direction = "previous"
                        if not sufficient_rest_between_shifts(shift, df.at[i, next(day)], shift_length) or not desirable_move_between_shifts(shift, df.at[i, next(day)], shift_length):
                            if direction == None:
                                direction = "next"
                            else:
                                direction = "both"

                        # track if the current shift was successfully swapped:
                        successful_swap = False

                        # attempt shift swap in the appropriate direction(s)
                        if direction == "both":
                            successful_swap = swap_series_of_days(i, day, shift, "previous", df, number_of_workers, shift_length, number_of_attempts, max_number_of_attempts) and swap_series_of_days(i, day, shift, "next", df, number_of_workers, shift_length, number_of_attempts, max_number_of_attempts)
                        else:
                            successful_swap = swap_series_of_days(i, day, shift, direction, df, number_of_workers, shift_length, number_of_attempts, max_number_of_attempts)

                        # if swap was successful
                        if successful_swap:
                            df.at[i, day] = shift
                            # remove quantity of one from missing shift list
                            missing_shifts[day][shift] -= 1
                            # if no more of that missing shift exist, remove it
                            if missing_shifts[day][shift] == 0:
                                del missing_shifts[day][shift]
                            break

        # Use these for debugging purposes -- see how close a failed schedule is to full (after swap replacement)
        missing_shifts = clear_empty_days(missing_shifts)
        print('missing shifts after swap replacement:', missing_shifts)
        missing_shift_count = get_missing_shift_count(missing_shifts)
        print(df)


        # Try one more round of direct swapping (now that rows have been changed by series swap)
        for day in missing_shifts.keys():
            for i in range(0, number_of_workers):
                if isinstance(df.at[i, day], list):
                    for shift, quantity in missing_shifts[day].items():
                        if get_potential_shift_to_swap(shift, i, day, df, shift_length, number_of_workers):
                            shift_to_swap, row = get_potential_shift_to_swap(shift, i, day, df, shift_length, number_of_workers)
                            df.at[i, day] = shift_to_swap
                            df.at[row, day] = shift
                            missing_shifts[day][shift] -= 1
                            break
                    if missing_shifts[day][shift] == 0:
                        del missing_shifts[day][shift]

        missing_shifts = clear_empty_days(missing_shifts)
        print('missing shifts after final direct replacement:', missing_shifts)
        print(df)

        # Finally, see if the missing shift can be filled when ignoring desirable moves
        for day in missing_shifts.keys():
            for i in range(0, number_of_workers):
                if isinstance(df.at[i, day], list):
                    for missing_shift in missing_shifts[day].keys():
                        if sufficient_rest_between_shifts(df.at[i, previous(day)], missing_shift,shift_length) and sufficient_rest_between_shifts(missing_shift, df.at[i, next(day)], shift_length):
                            df.at[i, day] = missing_shift
                            missing_shifts[day][missing_shift] -= 1
                            break
                    if missing_shifts[day][missing_shift] == 0:
                        del missing_shifts[day][missing_shift]

        # Use this for debugging
        # Show missing shifts after direct assignment of missing shifts is attempted
        missing_shifts = clear_empty_days(missing_shifts)
        print('missing shifts after direct assignment (without desirable moves check):', missing_shifts)
        print(df)

        # recalculate number of shifts based on missing shifts filled into schedule
        total_shifts = determine_number_of_each_shift(df, number_of_workers)
        # print(total_shifts)

        # Calculate number of missing shifts and undesirable moves
        # These will be used to grade the schedule
        number_of_missing_shifts = 0
        number_of_undesirable_moves = 0

        # check if any cells in schedule are empty and if any rows contain undesirable moves
        for i in range(0, number_of_workers):
            for day in days:
                if isinstance(df.at[i, day], list):
                    number_of_missing_shifts += 1
                if not desirable_move_between_shifts(df.at[i, day], df.at[i, next(day)], shift_length):
                    number_of_undesirable_moves += 1

        # start with a schedule grade of 100
        schedule_grade = 100

        # Attempt to fill in missing shifts (if any exist)
        # Return filled in df, totals, and a bool indicating if any missing shifts still remain
        if number_of_missing_shifts > 0:
            df, total_shifts, missing_shifts_remaining = fill_in_missing_shifts(df, total_shifts, daily_shifts, number_of_workers, shift_length)
            if missing_shifts_remaining:
                schedule_grade = 0
        # Calculate grade for schedule
        # This will be used to determine if a schedule is better than any currently saved

        if schedule_grade != 0:
            schedule_grade -= (10 * number_of_missing_shifts)
            schedule_grade -= (number_of_undesirable_moves)

        # create pattern column as list:
        pattern = []

        # build pattern for each row
        for i in range(0, number_of_workers):
            pattern_string = ''
            for day in days:
                shift = df.at[i, day]
                if shift == 'X':
                    pattern_string += 'X'
                elif shift == 7 - (shift_length / 2):
                    pattern_string += 'S'
                elif shift == 15 - (shift_length / 2):
                    pattern_string += 'S'
                elif shift == 23 - (shift_length / 2):
                    pattern_string += 'S'
                elif isinstance(shift, list):
                    pattern_string += '[ ]'
                else:
                    shift_type = determine_type_of_shift(shift, shift_length)

                    if shift_type == "MID":
                        pattern_string += 'M'
                    elif shift_type == "DAY":
                        pattern_string += "D"
                    else:
                        pattern_string += "E"

            if num_of_days_in_rdo == 2:
                if "XX" in pattern_string:
                    pattern_string_list = pattern_string.split('XX')
                    pattern_string_to_append = pattern_string_list[1] + pattern_string_list[0]
                else:
                    pattern_string_to_append = ''
                    for char in pattern_string:
                        if char != 'X':
                            pattern_string_to_append += char
            elif num_of_days_in_rdo == 3:
                if "XXX" in pattern_string:
                    pattern_string_list = pattern_string.split('XXX')
                    pattern_string_to_append = pattern_string_list[1] + pattern_string_list[0]
                elif "XX" in pattern_string:
                    pattern_string_list = pattern_string.split('XX')
                    temp_pattern_string_to_append = pattern_string_list[1] + pattern_string_list[0]
                    pattern_string_to_append = ''
                    for char in temp_pattern_string_to_append:
                        if char != 'X':
                            pattern_string_to_append += char
                else:
                    pattern_string_to_append = ''
                    for char in pattern_string:
                        if char != 'X':
                            pattern_string_to_append += char

            pattern.append(pattern_string_to_append)

        df["Pattern"] = pattern

        # create shift line name column as list:
        shift_line_names = []

        # create shift line name for each shift line
        for i in range(0, number_of_workers):
            shift_line_name = ''
            # find first day of consecutive rdo
            current_day = ""
            for day in days:
                shift = df.at[i, day]
                next_day_shift = df.at[i, next(day)]
                if shift == "X" and next_day_shift == "X":
                    current_day = day
                    break

            for x in range(0, 7):
                shift = df.at[i, current_day]
                if shift == "X":
                    if current_day == "THU":
                        shift_line_name += "Th"
                    else:
                        shift_line_name += current_day[0:1]
                current_day = next(current_day)
            shift_line_names.append(shift_line_name)

        df["shiftline_name"] = shift_line_names

        # # create dataframe to hold if time between shifts is sufficient
        # # This can be turned on to view if every shift has sufficient rest
        # blank_schedule = {}
        # for day in days:
        #     blank_schedule[day] = [None] * number_of_workers
        # rest_df = pd.DataFrame(blank_schedule)
        #
        # # cycle through each row
        # for i in range(0, number_of_workers):
        #     # look at each pair of shifts and determine if rest is sufficient
        #     for day in days:
        #         shift_on_day = df.at[i, day]
        #         shift_on_next_day = df.at[i, next(day)]
        #         if shift_on_day != 'X' and shift_on_next_day != 'X':
        #             rest_df.at[i, day] = sufficient_rest_between_shifts(shift_on_day, shift_on_next_day, shift_length)
        #         else:
        #             rest_df.at[i, day] = True
        # print(rest_df)

        # check number of evening, day, and mid shifts total
        # can be checked to verify total of each type of shift
        # print(determine_number_of_each_type_of_shift(df, number_of_workers, shift_length))

        # create dataframe holding total number of each shift type assigned
        shift_totals_df = create_shift_totals_df(total_shifts, daily_shifts)
        # display table to console
        print(shift_totals_df)


        df_st = dataframe_int_to_st(df)
        print(df_st)

        number_of_attempts += 1

        print('number of attempts:', number_of_attempts)
        print('extra workers added:', extra_workers)
        print('schedule grade:', schedule_grade)

        # Create list of top 3 grades in list_of_schedules so far
        top_3_schedule_grades = []
        for existing_schedule in list_of_schedules:
            top_3_schedule_grades.append(existing_schedule['grade'])

        # Compare current schedule grade to list of grades
        # If current schedule grade is higher, insert schedule into list in appropriate location
        schedule_inserted = False
        if len(top_3_schedule_grades) > 0:
            for i in range(len(top_3_schedule_grades)):
                if schedule_grade > top_3_schedule_grades[i]:
                    list_of_schedules.insert(i, {"schedule": df_st.to_json(), "shift totals": shift_totals_df.to_json(), 'grade': schedule_grade})
                    schedule_inserted = True
                    break
            if len(list_of_schedules) > number_of_random_schedules:
                list_of_schedules.pop(number_of_random_schedules)
            elif len(list_of_schedules) < number_of_random_schedules:
                if not schedule_inserted:
                    list_of_schedules.append({"schedule": df_st.to_json(), "shift totals": shift_totals_df.to_json(), 'grade': schedule_grade})
        else:
            list_of_schedules.append({"schedule": df_st.to_json(), "shift totals": shift_totals_df.to_json(), 'grade': schedule_grade})

        print('list of schedules length:', len(list_of_schedules))

        # check if sufficient schedules saved
        if len(list_of_schedules) == number_of_random_schedules:
            # check if every grade is a 100 OR if max attempts have been attempted
            if number_of_attempts == max_number_of_attempts:
                schedule_incomplete = False
            else:
                schedule_incomplete = False
                for existing_schedule in list_of_schedules:
                    if existing_schedule['grade'] == 100:
                        continue
                    else:
                        schedule_incomplete = True
                        break

    # Use this for debugging
    # Print grades of schedules in list of schedules
    for schedule in list_of_schedules:
        print('Grade:', schedule['grade'])

    # create a list to store unique schedules
    unique_schedules = []

    # check if any schedules in list of schedule are duplicates
    for schedule in list_of_schedules:
        schedule_is_unique = True

        if len(unique_schedules) > 0:
            for unique_schedule in unique_schedules:
                if schedule["schedule"] == unique_schedule["schedule"]:
                    print("duplicate schedule identified and removed")
                    schedule_is_unique = False

        if schedule_is_unique:
            unique_schedules.append(schedule)

    # check if there are 2 schedules. If so, shorten to just 1 schedule
    if len(unique_schedules) == 2:
        unique_schedules.pop(1)

    # this will execute outside the while loop after schedule incomplete is False
    json_to_return = []
    n = 1
    for schedule_dict in unique_schedules:
        json_to_return.append({"generated_schedule_" + str(n):
                                   {"schedule": schedule_dict['schedule'],
                                    "shift totals": schedule_dict['shift totals'],
                                    "outliers": {},
                                    "pwp_error": {}}
                               })
        n += 1

    return jsonify(json_to_return)


if __name__ == '__main__':
    from werkzeug.serving import run_simple
    run_simple('0.0.0.0', 5000, app)
