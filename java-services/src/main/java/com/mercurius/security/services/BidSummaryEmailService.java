package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

public interface BidSummaryEmailService {
	
	public List<Object> BiddingSummary(Long BidscheduleId, Long Empid, String siteURL) throws UnsupportedEncodingException, MessagingException, ParseException;
	

}
