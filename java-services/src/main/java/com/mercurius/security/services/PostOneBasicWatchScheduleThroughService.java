package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

public interface PostOneBasicWatchScheduleThroughService {
	
	public List<Object> postDataForOneBasicWatchScheduleInTable(long bidId) throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException ;
	

}
