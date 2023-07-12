package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;

import javax.mail.MessagingException;

import com.mercurius.models.LeaveRequest;

public interface NotificationToSubmitLeaveRequestService {

	public LeaveRequest sendEmailToSumbitLeaveRequest(Long requestId)
			throws UnsupportedEncodingException, MessagingException, ParseException;
}
