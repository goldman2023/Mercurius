package com.mercurius.security.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.FederalHolidays;
import com.mercurius.repository.FederalHolidaysDao;

@Service
public class FederalHolidaysServiceImpl implements FederalHolidaysService{
	
	
	@Autowired
	private FederalHolidaysDao fhd;

	@Override
	public List<FederalHolidays> getAll() {
		List<FederalHolidays> fddetails = fhd.findAll();
		// TODO Auto-generated method stub
		return fddetails;
	}

}
