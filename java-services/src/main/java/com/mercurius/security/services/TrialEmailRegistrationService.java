package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.mail.MessagingException;

public interface TrialEmailRegistrationService {

	public List<Object> sendTrialEmail(String fname, String lname,String email ,String siteURL) throws UnsupportedEncodingException, MessagingException;
	
	
}
