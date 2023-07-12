package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;

import javax.mail.MessagingException;

import org.springframework.stereotype.Service;

@Service
public class NotificationForBidWindowIcreaseWithDurationServiceImpl implements NotificationForBidWindowIcreaseWithDurationService{

	@Override
	public List<Object> BidWindowTimeIcreasedForEmployeeWithDuration(Long BidscheduleId, Long Empid, int Roundid,
			String siteURL, Long prevempdurationid)
			throws UnsupportedEncodingException, MessagingException, ParseException {
		
		System.out.println("have to work on this part");
		return null;
	}

}
