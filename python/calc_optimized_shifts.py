from xlsxwriter import *
from xlsxwriter.utility import xl_rowcol_to_cell

def create_time_windows(num_of_weeks, length_in_minutes):
    # create empty list to store created time_windows
    time_windows = []

    # create list of days of the week (return empty list if any number besides 1 or 2 is specified)
    days = ['SUN1', 'MON1', 'TUE1', 'WED1', 'THU1', 'FRI1', 'SAT1']
    if num_of_weeks == 2:
        days += ['SUN2', 'MON2', 'TUE2', 'WED2', 'THU2', 'FRI2', 'SAT2']
    elif num_of_weeks != 1:
        return []
    
    # create time windows
    for day in days:
        time_windows += [TimeWindow(day, x, length_in_minutes) for x in range(0, 60*24, length_in_minutes)]
    
    return time_windows


class TimeWindow:
    def __init__(self, day, start_time_in_minutes, duration_in_minutes):
        self.day = day
        self.start_time_in_minutes = float(start_time_in_minutes)
        self.duration_in_minutes = float(duration_in_minutes)
    
    @property
    def start_time_hours(self):
        try:
            return float(self.start_time_in_minutes) / 60
        except Exception as e:
            return False
        
    @property
    def end_time_hours(self):
        try:
            return (self.start_time_hours + (self.duration_in_minutes / 60))
        except Exception as e:
            print(e)
            return False
    
    @property
    def start_time_string(self):
        if self.start_time_hours >= 10:
            hour = str(int(self.start_time_hours // 1))
        else:
            hour = '0{}'.format(int(self.start_time_hours // 1))
        
        if self.start_time_hours % 1 == 0:
            minute = '00'
        else:
            minute = str(int(60 * (self.start_time_hours % 1)))
        
        return '{}{}'.format(hour, minute)
    
    @property
    def end_time_string(self):
        if self.end_time_hours >= 10:
            hour = str(int(self.end_time_hours // 1))
        else:
            hour = '0{}'.format(int(self.end_time_hours // 1))
        
        if self.end_time_hours % 1 == 0:
            minute = '00'
        else:
            minute = str(int(60 * (self.end_time_hours % 1)))
        
        return '{}{}'.format(hour, minute)

    def __str__(self):
        return '{}  {} - {}'.format(self.day, self.start_time_string, self.end_time_string)
    
    # return boolean indicating if this time window is inside a givn requirement window
    def is_in_requirement_window(self, requirement_window):
        if self.day == requirement_window.day:
            if self.start_time_hours >= requirement_window.start_time_numeric and self.end_time_hours <= requirement_window.end_time_numeric:
                return True
            else:
                return False
        else:
            return False
    
    # return boolean indicating if this time window is inside a given no shift window
    def is_in_no_shift_window(self, no_shift_window):
        if self.start_time_hours >= no_shift_window.start_time_numeric and self.end_time_hours <= no_shift_window.end_time_numeric:
            return True
        else:
            return False

    
    # calculates demand for this window by looking at list of requirement windows
    def get_demand(self, requirement_windows):
        return max([rw.demand for rw in requirement_windows if self.is_in_requirement_window(rw)])
    
    # return 1 or 0 indicating if this time window is during a given shift
    def is_during_shift(self, shift):

        if shift.start_and_end_days_are_equal:
            if self.day == shift.day:
                if self.start_time_hours >= shift.start_time_numeric and self.end_time_hours <= shift.end_time_numeric:
                    return 1
                else:
                    return 0
            else:
                return 0
        
        else:
            if self.day == shift.start_time_day:
                if self.start_time_hours >= shift.start_time_numeric:
                    return 1
                else:
                    return 0
            elif self.day == shift.end_time_day:
                if self.end_time_hours <= shift.end_time_numeric:
                    return 1
                else:
                    return 0
            else:
                return 0


class RequirementWindow:

    def __init__(self, day, start_time, end_time, demand):
        self.day = day
        self.start_time = start_time
        self.end_time = end_time
        self.demand = demand
    
    @property
    def start_time_numeric(self):
        try:
            return (float(self.start_time[0:2]) + float(self.start_time[2:])/60)
        except Exception as e:
            return False
        
    @property
    def end_time_numeric(self):
        try:
            return (float(self.end_time[0:2]) + float(self.end_time[2:])/60)
        except Exception as e:
            return False
    
    def __str__(self):
        return 'requirement window on {} from {} - {} with demand of {}'.format(self.day, self.start_time, self.end_time, self.demand)

class NoShiftWindow:

    def __init__(self, start_time, end_time):
        self.start_time = start_time
        self.end_time = end_time
    
    @property
    def start_time_numeric(self):
        try:
            return (float(self.start_time[0:2]) + float(self.start_time[2:])/60)
        except Exception as e:
            return False
        
    @property
    def end_time_numeric(self):
        try:
            return (float(self.end_time[0:2]) + float(self.end_time[2:])/60)
        except Exception as e:
            return False
    
    def __str__(self):
        return 'no shift window from {} - {}'.format(self.start_time, self.end_time)

def previous_day(day):
    days = ['SUN1', 'MON1', 'TUE1', 'WED1', 'THU1', 'FRI1', 'SAT1', 'SUN2', 'MON2', 'TUE2', 'WED2', 'THU2', 'FRI2', 'SAT2']

    try:
        index_of_day = days.index(day)
    except Exception:
        print('invalid day of week')
        return False

    try:
        return days[index_of_day - 1]
    except IndexError:
        return days[-1]

def next_day(day):
    days = ['SUN1', 'MON1', 'TUE1', 'WED1', 'THU1', 'FRI1', 'SAT1', 'SUN2', 'MON2', 'TUE2', 'WED2', 'THU2', 'FRI2', 'SAT2']

    try:
        index_of_day = days.index(day)
    except Exception:
        print('invalid day of week')
        return False

    try:
        return days[index_of_day + 1]
    except IndexError:
        return(days[0])
    
class PotentialShift:

    def __init__(self, day, start_time, length):
        self.day = day
        self.start_time = start_time
        self.length = float(length)
    
    @property
    def start_time_numeric(self):
        try:
            return (float(self.start_time[0:2]) + float(self.start_time[2:])/60)
        except Exception as e:
            return False
        
    @property
    def end_time_numeric(self):
        try:
            return ((self.start_time_numeric + self.length) % 24)
        except Exception as e:
            return False

    @property
    def start_time_day(self):
        if self.start_time_numeric >= 22.5:
            return previous_day(self.day)
        else:
            return self.day

    @property
    def end_time_day(self):
        if self.start_time_numeric < 22.5 and self.end_time_numeric < self.start_time_numeric:
            return next_day(self.day)
        else:
            return self.day
    
    # returns boolean indicating if endtime is less than start time (i.e. transitions through midnight)
    @property
    def start_and_end_days_are_equal(self):
        if self.start_time_day == self.end_time_day:
            return True
        return False
    
    @property
    def type(self):
        if (7 - self.length / 2) < self.start_time_numeric <= (7 + self.length / 2):
            return "DAY"
        elif (15 - self.length / 2) < self.start_time_numeric <= (15 + self.length / 2):
            return "EVE"
        else:
            return "MID"
    
    def __str__(self):
        return '{} - {} - {}'.format(self.day, self.start_time, self.length)


def create_optimized_shift_summary(time_windows, optimal_shifts, requirement_windows):

    # create workbook and worksheet
    optimized_shift_summary = Workbook('optimized_summary.xlsx', {'in_memory': True})
    worksheet1 = optimized_shift_summary.add_worksheet('Optimized Shift Summary')

    row = 0
    col = 0

    # create first column with all time windows
    worksheet1.write(row, col, 'Time Windows')
    row += 1
    for tw in time_windows:
        worksheet1.write(row, col, str(tw))
        row += 1

    # add in columns for each optimal shift
    for shift in optimal_shifts:
        # move over to the next column
        col += 1
        row = 0

        # identify the shift as the column header
        worksheet1.write(row, col, str(shift))
        row += 1

        for tw in time_windows:
            worksheet1.write(row, col, tw.is_during_shift(shift))
            row += 1
    
    # add in column showing coverage for each time window by created shifts
    col += 1
    row = 0
    worksheet1.write(row, col, "Shift Coverage")
    row += 1

    for tw in time_windows:
        worksheet1.write_formula(row, col, "=SUM({}:{})".format(xl_rowcol_to_cell(row, 1),xl_rowcol_to_cell(row, col-1)))
        row += 1
    
    # add in column showing demand requested for each time window
    col += 1
    row = 0
    worksheet1.write(row, col, 'Demand')
    row += 1

    for tw in time_windows:
        worksheet1.write(row, col, tw.get_demand(requirement_windows))
        row += 1

    optimized_shift_summary.close()
