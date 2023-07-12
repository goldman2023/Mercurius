package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

public interface NotificationforShiftlineBiddingBySystemService {
	
	public List<Object> ShiftlineBiddingCompleteBySystem(Long BidscheduleId, Long Empid , int Roundid, String siteURL) throws UnsupportedEncodingException, MessagingException, ParseException;


}
