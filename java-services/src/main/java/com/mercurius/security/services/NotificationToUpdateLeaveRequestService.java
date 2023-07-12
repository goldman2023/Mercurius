package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;

import javax.mail.MessagingException;

import com.mercurius.models.LeaveRequest;

public interface NotificationToUpdateLeaveRequestService {
	
	public LeaveRequest sendEmailToUpdateLeaveRequest(Long requestId)
			throws UnsupportedEncodingException, MessagingException, ParseException;
}

