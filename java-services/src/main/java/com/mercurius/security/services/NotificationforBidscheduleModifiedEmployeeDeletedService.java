package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.mail.MessagingException;

public interface NotificationforBidscheduleModifiedEmployeeDeletedService {
	
	public List<Object> BidscheduleModifiedEmpDeleted(Long BidscheduleId , Long Empid, String siteURL) throws UnsupportedEncodingException, MessagingException;
	

}
