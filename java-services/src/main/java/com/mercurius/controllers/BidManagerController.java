package com.mercurius.controllers;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.AddBidManager;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.security.services.AddBidManagerService;

@RestController
public class BidManagerController {
	
	@Autowired
	private AddBidManagerService managerService;
	

	@RequestMapping(method = RequestMethod.GET, path = "/bidmanageridpassed/{bmId}")
	public AddBidManager getbasedOnBidManagerId(@PathVariable("bmId") Long bmId) throws ParseException
	{
		return this.managerService.getByID(bmId);
	}
	
	@PostMapping("/bidmanagerdatasave") 
	public AddBidManager savedata(@RequestBody AddBidManager managerData)
	{ 
		AddBidManager mData = managerService.addOneData(managerData);
		return mData; 
	}
	 

	@RequestMapping(method = RequestMethod.PUT, value = "/bidmanagerdataupdate/{bmId}")
	public AddBidManager updateData(@RequestBody AddBidManager managerData, @PathVariable("bmId") Long bmId) 
	{
		return this.managerService.updateOneData(managerData,bmId);
	}
	
}
