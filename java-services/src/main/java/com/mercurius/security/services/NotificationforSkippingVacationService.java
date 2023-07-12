package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

public interface NotificationforSkippingVacationService {
	
	public List<Object> SkipVacation(Long BidscheduleId, Long Empid , int Roundid,int vacationcount, String siteURL) throws UnsupportedEncodingException, MessagingException, ParseException;


}
