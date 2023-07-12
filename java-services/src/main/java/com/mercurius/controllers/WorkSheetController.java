package com.mercurius.controllers;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.EmployeeBasicWatchScheduleImposter;
import com.mercurius.models.WorkSheetParent;
import com.mercurius.security.services.WorkSheetParentService;

@RestController
public class WorkSheetController {
	
	@Autowired
	private WorkSheetParentService worksheetService;
	
	@RequestMapping(method = RequestMethod.GET, path = "/worksheet/{bidscheduleid}/{empid}")
	public WorkSheetParent getBasicWatchBasedOnDateAndBidScheduleId(@PathVariable Long bidscheduleid, @PathVariable Long empid) throws ParseException 
	{
		return worksheetService.getEmployeeShiftAndVacation(bidscheduleid, empid);
	}

}
