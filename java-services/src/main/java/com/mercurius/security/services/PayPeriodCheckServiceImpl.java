package com.mercurius.security.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.EmployeeBasicWatchScheduleImposter;
import com.mercurius.models.RefFaaBusinessRules;
import com.mercurius.repository.BusinessRuleDao;

@Service
public class PayPeriodCheckServiceImpl implements PayPeriodCheckService {

    @Autowired
    BusinessRuleDao businessRuleDao;

    private List<RefFaaBusinessRules> businessRules;

    public RefFaaBusinessRules getRuleOfParameterAndLength(String parameter,Long shift_length) {
        for (RefFaaBusinessRules rule : businessRules) {
            if (rule.getParameter().equals(parameter) && rule.getShift_length() == shift_length) {
                return rule;
            }
        }
        throw new IllegalArgumentException("Parameter not found in business rules: " + parameter);
    }
    

    public String determineTypeOfShift(Object shift_start, Long shift_length) {
        if (shift_start.equals("X")) {
            return "rdo";
        } else if (shift_start == null || shift_start instanceof List) {
            return "empty";
        } else {
            double shift_start_double;
            if (shift_start instanceof Integer) {
                shift_start_double = ((Integer) shift_start).doubleValue();
            } else if (shift_start instanceof Double) {
                shift_start_double = (Double) shift_start;
            } else {
                throw new IllegalArgumentException("shift_start must be an Integer or a Double");
            }

            if ((7 - shift_length / 2.0) < shift_start_double && shift_start_double <= (7 + shift_length / 2.0)) {
                return "DAY";
            } else if ((15 - shift_length / 2.0) < shift_start_double && shift_start_double <= (15 + shift_length / 2.0)) {
                return "EVE";
            } else {
                return "MID";
            }
        }
    }



    // private Map<Integer, Map<String, Integer>> business_rules;

    public List<String> sufficientRestBetweenShifts(Object prev_shift, Object next_shift, Long shift_length) {


        List<String> rule = new ArrayList<>();

        Long shift_length_for_business_rules;

        if (shift_length == 9) {
            shift_length_for_business_rules = (long) 10;
        } else {
            shift_length_for_business_rules = shift_length;
        }

        // Map<String, Integer> business_rules_for_given_shift_length = business_rules.get(shift_length_for_business_rules);

        if (prev_shift.equals("X") || next_shift.equals("X")) {
            return rule;
        }

        if (prev_shift instanceof List || next_shift instanceof List) {
            return rule;
        }

        double time_between_shift_starts = 0.0;
        double prev_shift_double;
            if (prev_shift instanceof Integer) {
                prev_shift_double = ((Integer) prev_shift).doubleValue();
            } else if (prev_shift instanceof Double) {
                prev_shift_double = (Double) prev_shift;
            } else {
                throw new IllegalArgumentException("shift_start must be an Integer or a Double");
            }
        double next_shift_double;
            if (next_shift instanceof Integer) {
                next_shift_double = ((Integer) next_shift).doubleValue();
            } else if (next_shift instanceof Double) {
                next_shift_double = (Double) next_shift;
            } else {
                throw new IllegalArgumentException("shift_start must be an Integer or a Double");
            }
        // Double prev_shift_double =  (Double) prev_shift;
        // Double next_shift_double = (Double) next_shift;

        if (0 <= prev_shift_double && prev_shift_double <= (23 - shift_length / 2.0)) {
            if (0 <= next_shift_double && next_shift_double <= (23 - shift_length / 2.0)) {
                if (prev_shift_double < next_shift_double) {
                    return rule;
                } else {
                    time_between_shift_starts = (24 - prev_shift_double) + next_shift_double;
                }
            } else if ((23 - shift_length / 2.0) < next_shift_double && next_shift_double < 24) {
                time_between_shift_starts = next_shift_double - prev_shift_double;
            }
        } else if ((23 - shift_length / 2.0) < prev_shift_double && prev_shift_double < 24) {
            if (0 <= next_shift_double && next_shift_double <= (23 - shift_length / 2.0)) {
                return rule;
            } else if ((23 - shift_length / 2.0) < next_shift_double && next_shift_double < 24) {
                time_between_shift_starts = (24 - prev_shift_double) + next_shift_double;
            }
        }

        double rest = Math.round(time_between_shift_starts - shift_length);
        System.out.println("rest==="+rest);
        String prev_shift_type = determineTypeOfShift(prev_shift_double, shift_length);
        String next_shift_type = determineTypeOfShift(next_shift_double, shift_length);

        boolean sufficient_rest = true;

        if (prev_shift_type.equals("DAY") && next_shift_type.equals("MID")) {
            if (shift_length == 8 && prev_shift_double <= 5.5) {
                sufficient_rest = false;
                rule.add("wrong 5.5");
            } else {
                if (rest < getRuleOfParameterAndLength("time_between_day_shift_to_mid_shift",shift_length_for_business_rules).getValue()) {                                                                     //time_between_day_shift_to_mid_shift
                    sufficient_rest = false;
                    rule.add(getRuleOfParameterAndLength("time_between_day_shift_to_mid_shift",shift_length_for_business_rules).getDescription());
                }
            }
        } else if (prev_shift_type.equals("EVE") && next_shift_type.equals("DAY")) {
            if (rest < getRuleOfParameterAndLength("time_between_eve_shift_to_day_shift",shift_length).getValue()) {                                                                         //time_between_eve_shift_to_day_shift
                rule.add(getRuleOfParameterAndLength("time_between_eve_shift_to_day_shift",shift_length).getDescription());
                sufficient_rest = false;
            }
        } else if (prev_shift_type.equals("MID") && next_shift_type.equals("MID")) {
            if (rest < getRuleOfParameterAndLength("time_between_mid_shift_to_any_shift",shift_length).getValue()) {                                                                            //time_between_mid_shift_to_any_shift
                rule.add(getRuleOfParameterAndLength("time_between_mid_shift_to_any_shift",shift_length).getDescription());
                sufficient_rest = false;
            }
        } else {
            if (rest < 8) {
                rule.add(getRuleOfParameterAndLength("time_between_day_shift_to_mid_shift",shift_length).getDescription());
                sufficient_rest = false;
            }
        }
        return rule;
    }

    @Override
    public List<String> checkPayPeriod(List<Object> shift_line, Long shift_length,List<EmployeeBasicWatchScheduleImposter>empinfo) {
        // int temp = 0;
        businessRules = businessRuleDao.getBusinessRules();
        int total_hours = 0;
        List<String> rule = new ArrayList<>();
        int num_of_rdo = 0;
        boolean consecutive_rdo_found = false;

        for (int i = 0; i < empinfo.size(); i++) {
            EmployeeBasicWatchScheduleImposter empinf = empinfo.get(i);
            if (empinf.getRdoDayOff() == null) {
                total_hours += empinf.getDuration();
            }
        }
        if (total_hours != 80) {
            rule.add(getRuleOfParameterAndLength("hours_of_payperiod",shift_length).getDescription());
            return rule;
        }
        for (int i = 0; i < shift_line.size(); i++) {
            Object prev_shift = shift_line.get(i % 7);
            Object next_shift = shift_line.get((i + 1) % 7);

            if (prev_shift.equals("X")) {

                num_of_rdo += 1;
                if (next_shift.equals("X")) {
                    consecutive_rdo_found = true;

                }
            }
        }
        if (num_of_rdo != 2) {
            rule.add(getRuleOfParameterAndLength("incorrect_num_of_rdo",shift_length).getDescription());
            return rule;
        }
        if (!consecutive_rdo_found) {
            rule.add(getRuleOfParameterAndLength("no_consecutive_rdo",shift_length).getDescription());
            return rule;
        }
        for (int i = 0; i < shift_line.size(); i++) {
            Object prev_shift = shift_line.get(i % 7);
            Object next_shift = shift_line.get((i + 1) % 7);
            List<String> sufficient_rest_between_shifts = sufficientRestBetweenShifts(prev_shift, next_shift,
                    shift_length);

            if (sufficient_rest_between_shifts.size() == 0) {
                continue;
            } else {
                rule.addAll(sufficient_rest_between_shifts);
                break;
            }
        }

        for (int i = 0; i < shift_line.size(); i++) {
            int consecutive_mid_count = 0;
            int consecutive_mid_index = i;
            Object current_shift = shift_line.get(consecutive_mid_index);
            boolean exception_case = true;
            boolean business_rule_violation = false;
    
            // keep counting next day until shift of type not encountered
            while (determineTypeOfShift(current_shift, shift_length).equals("MID")) {
                // during while loop, if we encounter one non-exception shift, exception case does not apply
                if (!current_shift.equals(21)) {
                    exception_case = false;
                }
                consecutive_mid_count++;
                // check if maximum number of consecutive shift exceeded while not being an exception case
                if (consecutive_mid_count > 5 && !exception_case) {  //number_of_consecutive_mid_shifts
                    business_rule_violation = true;
                    rule.add(getRuleOfParameterAndLength("number_of_consecutive_mid_shifts",shift_length).getDescription());
                    break;
                }
                consecutive_mid_index = (consecutive_mid_index + 1) % 7;
                current_shift = shift_line.get(consecutive_mid_index);
            }
            if (business_rule_violation) {
                break;
            }
        }
    
        
        return rule;
    }
}
