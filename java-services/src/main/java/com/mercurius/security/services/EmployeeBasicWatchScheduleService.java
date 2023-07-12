package com.mercurius.security.services;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.mercurius.models.EmployeeBasicWatchSchedule;
import com.mercurius.models.EmployeeBasicWatchScheduleImposter;

public interface EmployeeBasicWatchScheduleService {
	
	public EmployeeBasicWatchSchedule addoneItem(EmployeeBasicWatchSchedule shiftBid);
	
	public List<EmployeeBasicWatchScheduleImposter> getBasicWatchShiftBasedOnDateAndBidScheduleId( Long bidscheduleid, String shiftdate);
	
	public List<EmployeeBasicWatchScheduleImposter> getBasicWatchShiftBasedOnDateRangeAndBidScheduleId(
			Long bidscheduleid, String from, String to);
	
	public List<EmployeeBasicWatchScheduleImposter> getBasicWatchShiftBasedOnDateRangeAndBidScheduleIdAndEmpid( Long bidscheduleid,Long empid, String from, String to);

}
