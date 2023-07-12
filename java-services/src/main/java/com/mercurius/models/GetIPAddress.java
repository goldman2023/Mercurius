package com.mercurius.models;
import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

public class GetIPAddress {
	
	public String home(HttpServletRequest request) {
	    String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
            .replacePath(null)
            .build()
            .toUriString();
 
	    System.out.println(baseUrl);
 
		return baseUrl;
	}
	

}
