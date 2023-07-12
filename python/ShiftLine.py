from Shift import Shift
from Schedule_Functions import *


shift_days_one_week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
shift_days_two_weeks = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT",
                        "SUN2", "MON2", "TUE2", "WED2", "THU2", "FRI2", "SAT2"]


class ShiftLine:
    def __init__(self, num_of_weeks):
        if num_of_weeks == 1:
            self.shift_days = shift_days_one_week
            self.shift_on = {}
            for day in shift_days_one_week:
                self.shift_on[day] = Shift(day)
        else:
            self.shift_days = shift_days_two_weeks
            self.shift_on = {}
            for day in shift_days_two_weeks:
                self.shift_on[day] = Shift(day)

    @property
    def is_filled(self):
        for shift in self.shift_on.values():
            if shift.current_state == "filled":
                continue
            else:
                return False
        return True

    def __str__(self):
        string_to_return = "["
        for shift in self.shift_on.values():
            string_to_return += " " + shift.start_time_string
        string_to_return += " ]"
        return string_to_return

    def valid_number_of_consecutive_shifts(self, shift_type="MID"):
        number_of_shifts_of_given_type = 0

        # fetches business rules from database
        business_rules = transfer_business_rules()

        # create list containing all unique shift lengths (used to determine type of shift line)
        shift_lengths = []

        for day in self.shift_days:
            if self.shift_on[day].current_state != "rdo":
                shift_length = self.shift_on[day].length
                if shift_length not in shift_lengths:
                    shift_lengths.append(shift_length)

        # determine if shift line is one type or hybrid
        if len(shift_lengths) == 1:
            shift_line_shift_length = shift_lengths[0]
            max_number_of_consecutive_mids = business_rules[shift_line_shift_length]['number_of_consecutive_mid_shifts']
            print("normal schedule containing " + str(shift_line_shift_length) + " hour shifts")
        else:
            # for hybrid, assume 10 hour business rules (majority of shifts are longer than 8)
            shift_line_shift_length = 10
            max_number_of_consecutive_mids = business_rules[shift_line_shift_length]['number_of_consecutive_mid_shifts']
            print("hybrid schedule")

        # Check number of consecutive mids against business rules
        for day in self.shift_days:
            shift = self.shift_on[day]
            if determine_type_of_shift(shift.start_time_numeric, shift.length) == shift_type:
                number_of_shifts_of_given_type += 1
            else:
                number_of_shifts_of_given_type = 0

            if number_of_shifts_of_given_type > max_number_of_consecutive_mids:
                return False

        return True

    def check_business_rules(self, check_rest=True, check_desirable_moves=True, check_consecutive_mids=True):
        passes_business_rules = True
        total_hours = 0
        consecutive_rdo_found = False

        for day in self.shift_days:

            prev_shift = self.shift_on[day].start_time_numeric
            next_day = self.shift_days[(self.shift_days.index(day) + 1) % len(self.shift_days)]
            next_shift = self.shift_on[next_day].start_time_numeric

            # calculate total hours in shiftline and check for consecutive RDO
            if self.shift_on[day].start_time_string != "X":
                total_hours += self.shift_on[day].length
            else:
                if self.shift_on[next_day].start_time_string == "X":
                    consecutive_rdo_found = True

            sufficient_rest = sufficient_rest_between_shifts(prev_shift, next_shift, self.shift_on[day].length)
            if not sufficient_rest:
                passes_business_rules = False
                print("insufficient rest detected")
                return passes_business_rules

            desirable_move = desirable_move_between_shifts(prev_shift, next_shift, self.shift_on[day].length)
            if not desirable_move:
                passes_business_rules = False
                print("undesirable move detected")
                return passes_business_rules

        if not self.valid_number_of_consecutive_shifts():
            passes_business_rules = False
            print("invalid number of consecutive shifts of type MID")
            return passes_business_rules

        # check if total shiftline contains correct number of hours
        if len(self.shift_days) == 7:
            if total_hours != 40:
                passes_business_rules = False
        else:
            if total_hours != 80:
                passes_business_rules = False

        # check if consecutive rdo has been found
        if not consecutive_rdo_found:
            passes_business_rules = False

        return passes_business_rules
