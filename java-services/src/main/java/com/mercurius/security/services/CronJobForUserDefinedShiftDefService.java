package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

public interface CronJobForUserDefinedShiftDefService {
	
	public List<Object> changeUserDefinedShiftStatus() throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException ;
	

}
