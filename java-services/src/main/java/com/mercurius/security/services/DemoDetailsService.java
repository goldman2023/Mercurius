package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;

import com.mercurius.models.DemoDetails;

public interface DemoDetailsService {

	public DemoDetails addoneItem(DemoDetails demodetail, String siteURL) throws UnsupportedEncodingException, MessagingException;
}
