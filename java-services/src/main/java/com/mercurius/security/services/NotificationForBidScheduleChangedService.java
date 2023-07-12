package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.mail.MessagingException;

public interface NotificationForBidScheduleChangedService {

	
	public List<Object> BidscheduleModified(Long BidscheduleId ,String siteURL) throws UnsupportedEncodingException, MessagingException;
	
	
}
