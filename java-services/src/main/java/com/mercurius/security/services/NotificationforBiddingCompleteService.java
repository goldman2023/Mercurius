package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

public interface NotificationforBiddingCompleteService {

	public List<Object> BiddingComplete(Long BidscheduleId, Long Empid , int Roundid,int vacationcount, String siteURL, int vaactionexhausted) throws UnsupportedEncodingException, MessagingException, ParseException;
	
}
