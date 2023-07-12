package com.mercurius.security.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class TwilioService {
	@Value("${spring.twilio.phoneNumber}")
	private String phoneNumber;
	
	public TwilioService(
		@Value("${spring.twilio.sid}") String sid, 
		@Value("${spring.twilio.token}") String token
	) {
		Twilio.init(sid, token);
	}
	
	public void sendSMS(String to, String message) {
		Message.creator(new PhoneNumber(to), new PhoneNumber(phoneNumber), message)
		       .create();
	}
}