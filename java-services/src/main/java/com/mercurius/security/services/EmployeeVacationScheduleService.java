package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.util.Date;
import java.text.ParseException;

import java.util.List;

import javax.mail.MessagingException;

import com.mercurius.models.EmployeeBasicWatchScheduleImposter;
import com.mercurius.models.EmployeePostedWatchSchedule;
import com.mercurius.models.EmployeeVacationSchedule;
import com.mercurius.models.EmployeeVacationScheduleImposter;

public interface EmployeeVacationScheduleService {
	
	public EmployeeVacationSchedule addoneItem(EmployeeVacationSchedule vacationBid);
	
	public List<Object> postVacationDetails() throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException;
	
	public EmployeeVacationScheduleImposter getBasicWatchVacationBasedOnDateAndBidScheduleId( Long bidscheduleid, Date shiftdate) throws ParseException;
	
	public List<EmployeeVacationScheduleImposter> getBasicWatchVacationBasedOnDateRangeAndBidScheduleId( Long bidscheduleid, String from, String to) throws ParseException;

	
}
