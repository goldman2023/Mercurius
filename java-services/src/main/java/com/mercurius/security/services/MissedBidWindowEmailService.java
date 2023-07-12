package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

public interface MissedBidWindowEmailService {

	public List<Object> BiddingMissed(Long BidscheduleId, Long Empid , int Roundid, String siteURL) throws UnsupportedEncodingException, MessagingException, ParseException, UnknownHostException;
	
}
