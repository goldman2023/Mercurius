package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.Hostname;
import com.mercurius.repository.HostnameDao;

@Service
public class HostnameServiceImpl  implements HostnameService{

	@Autowired
	private HostnameDao name;
	
	@Override
	public List<Hostname> getAllInfo() {
		return name.findAll();
	}
	
	@Override
	public Hostname getbyId(long id) {
		Optional<Hostname> s1 = name.findById(id);
		Hostname s2 = s1.get();
		return s2;
	}	

}
