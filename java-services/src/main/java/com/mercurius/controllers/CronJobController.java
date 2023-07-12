package com.mercurius.controllers;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.util.List;
import javax.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.security.services.CronJobForBasicWatchScheduleService;
import com.mercurius.security.services.CronJobForUserDefinedShiftDefService;
import com.mercurius.security.services.EmployeeVacationScheduleService;

@RestController
public class CronJobController {
	
	@Autowired
	private CronJobForBasicWatchScheduleService basicwatch;
	
	@GetMapping("/basicwatchcronjob")
	public List<Object> basicWatchScheduleAlgorithm() throws UnsupportedEncodingException, UnknownHostException, ParseException, MessagingException
	{
		return this.basicwatch.postDataInBasicWatchScheduleTable();
	}
	
	@Autowired
	private EmployeeVacationScheduleService vacationPostService;
	
	@GetMapping("/vacationpostbid")
	public List<Object> postVacationBidding() throws UnsupportedEncodingException, UnknownHostException, ParseException, MessagingException
	{
		return this.vacationPostService.postVacationDetails();
	}
	
	@Autowired
	private CronJobForUserDefinedShiftDefService userDefinedShiftsStatusChange;
	
	@GetMapping("/usershiftstatus")
	public List<Object> userShiftStatus() throws UnsupportedEncodingException, UnknownHostException, ParseException, MessagingException
	{
		return this.userDefinedShiftsStatusChange.changeUserDefinedShiftStatus();
	}
}
