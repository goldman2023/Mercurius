package com.mercurius.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.FederalHolidays;
import com.mercurius.security.services.FederalHolidaysService;

@RestController
public class FederalHolidayController {
	
	@Autowired
	private FederalHolidaysService fhservice;
	
	@RequestMapping(method = RequestMethod.GET, value = "/federal_holidays")
	public List<FederalHolidays>  getAllFederalHolidays()
	{
	return fhservice.getAll();
	}

}
