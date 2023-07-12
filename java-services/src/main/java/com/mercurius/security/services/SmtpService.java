package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import javax.mail.MessagingException;

import com.mercurius.models.UserToLogin;

public interface SmtpService {

	//public List<UserToLogin> getAll();
	
	public UserToLogin sendVerificationUsername(String username ,String siteURL) throws UnsupportedEncodingException, MessagingException;
	
	public boolean verify(String verificationCode);
	
	/*public UserToLogin getbyId(long sId);
	
	public UserToLogin getbyEmail(String mail);
	
	public UserToLogin sendVerificationEmail(String mail, String siteURL) throws UnsupportedEncodingException, MessagingException;
	
	public boolean verify(String verificationCode);
	
	public UserToLogin getbyUsername(String username);
	
	public UserToLogin sendVerificationUsername(String username, String siteURL) throws UnsupportedEncodingException, MessagingException;*/
}
