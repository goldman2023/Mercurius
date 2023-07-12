package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.mail.MessagingException;

public interface NotificationForRegistrationService {

	
	public List<Object> sendVerificationUsername(Long BidmanagerId ,String siteURL) throws UnsupportedEncodingException, MessagingException;
	
}
