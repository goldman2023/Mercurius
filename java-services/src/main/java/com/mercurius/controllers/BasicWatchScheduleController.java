package com.mercurius.controllers;


import java.text.ParseException;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.EmployeeBasicWatchScheduleImposter;
import com.mercurius.models.EmployeeVacationScheduleImposter;
import com.mercurius.repository.EmployeeBasicWatchScheduleDao;
import com.mercurius.security.services.EmployeeBasicWatchScheduleService;
import com.mercurius.security.services.EmployeeVacationScheduleService;

@RestController
public class BasicWatchScheduleController {
	
	@Autowired
	private EmployeeBasicWatchScheduleDao basic;
	
	@Autowired
	private EmployeeBasicWatchScheduleService serviceForDisplay;
	
	@Autowired
	private EmployeeVacationScheduleService vacationServiceForDisplay;
	
	@RequestMapping(method = RequestMethod.GET, path = "/bidscheduleidpassed/{bidid}")
	public String passBidId(@PathVariable("bidid") Long bidid) throws ParseException
	{
		return "Bidschedule Id passed";

	}

	@RequestMapping(method = RequestMethod.GET, path = "/basicwatch/{bidscheduleid}/{shiftdate}")
	public List<EmployeeBasicWatchScheduleImposter> getBasicWatchBasedOnDateAndBidScheduleId(@PathVariable Long bidscheduleid, 
	@PathVariable String shiftdate) throws ParseException {
		
		return serviceForDisplay.getBasicWatchShiftBasedOnDateAndBidScheduleId(bidscheduleid, shiftdate);
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/basicwatch/{bidscheduleid}/daterange")
	public List<EmployeeBasicWatchScheduleImposter> getBasicWatchBasedOnDateRangeAndBidScheduleId(@PathVariable Long bidscheduleid, 
	@RequestParam("from") String from, 
	@RequestParam("to") String to) throws ParseException {
		
		return serviceForDisplay.getBasicWatchShiftBasedOnDateRangeAndBidScheduleId(bidscheduleid, from, to);
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/basicwatchvacation/{bidscheduleid}")
	public EmployeeVacationScheduleImposter getBasicWatchVacationBasedOnDateAndBidScheduleId(@PathVariable Long bidscheduleid, 
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date shiftdate) throws ParseException {
		
		return vacationServiceForDisplay.getBasicWatchVacationBasedOnDateAndBidScheduleId(bidscheduleid, shiftdate);
	}
	
	
	@RequestMapping(method = RequestMethod.GET, path = "/basicwatchvacation/{bidscheduleid}/daterange")
	public List<EmployeeVacationScheduleImposter> getBasicWatchVacationBasedOnDateRangeAndBidScheduleId(@PathVariable Long bidscheduleid, 
	@RequestParam("from") String from, 
	@RequestParam("to") String to) throws ParseException {
		
		return vacationServiceForDisplay.getBasicWatchVacationBasedOnDateRangeAndBidScheduleId(bidscheduleid, from, to);
	}
}
