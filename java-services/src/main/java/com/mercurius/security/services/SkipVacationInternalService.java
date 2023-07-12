package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

import org.springframework.stereotype.Service;

public interface SkipVacationInternalService {
	
	public List<Object> SkipVacationJavaInternal(Long BidscheduleId, Long Empid , int Roundid,int vacationcount, String siteURL,String statuspassed) throws UnsupportedEncodingException, MessagingException, ParseException;

}
