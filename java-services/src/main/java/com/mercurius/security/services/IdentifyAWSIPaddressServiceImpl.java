package com.mercurius.security.services;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class IdentifyAWSIPaddressServiceImpl implements IdentifyAWSIPaddressService{

	@Override
	public String Identify() {
		// TODO Auto-generated method stub
		
		String ip = null;
		try {
			ip = InetAddress.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println("IP ADDRESS:"+ip);
		return ip;
		
	}
	
	
	

}
