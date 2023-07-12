package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

public interface IncompleteStatusForLeaveExhaustedService {
	
	public List<Object> IncompleteStatusUpdate(Long BidscheduleId, Long Empid , int Roundid, String siteURL,String status) throws UnsupportedEncodingException, MessagingException, ParseException;


}
