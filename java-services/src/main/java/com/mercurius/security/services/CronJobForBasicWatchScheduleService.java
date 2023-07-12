package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.util.List;
import javax.mail.MessagingException;


public interface CronJobForBasicWatchScheduleService {
	
	public List<Object> postDataInBasicWatchScheduleTable() throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException ;
	
}
