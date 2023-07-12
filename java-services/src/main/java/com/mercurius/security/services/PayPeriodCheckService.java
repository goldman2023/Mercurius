package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.EmployeeBasicWatchScheduleImposter;

public interface PayPeriodCheckService {
    List<String> checkPayPeriod(List<Object> shift_line,Long shift_length,List<EmployeeBasicWatchScheduleImposter>empinfo);

}
