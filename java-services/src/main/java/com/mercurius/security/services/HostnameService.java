package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.Hostname;

public interface HostnameService {
	
	public List<Hostname> getAllInfo();
	
	public Hostname getbyId(long id);

}
