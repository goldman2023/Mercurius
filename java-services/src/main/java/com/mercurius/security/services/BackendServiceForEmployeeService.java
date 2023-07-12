package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

public interface BackendServiceForEmployeeService {
	
	public List<Object> sendBiddingInformation(String emailid) throws ParseException ;
	

}
