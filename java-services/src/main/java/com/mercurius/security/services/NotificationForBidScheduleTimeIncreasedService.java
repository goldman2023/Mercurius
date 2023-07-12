package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

public interface NotificationForBidScheduleTimeIncreasedService {

	public List<Object> BidWindowTimeIcreasedForEmployee(Long BidscheduleId, Long Empid , int Roundid, String siteURL, Long prevempdurationid) throws UnsupportedEncodingException, MessagingException, ParseException;
	
}
