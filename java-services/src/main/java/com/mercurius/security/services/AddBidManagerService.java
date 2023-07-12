package com.mercurius.security.services;

import com.mercurius.models.AddBidManager;

public interface AddBidManagerService {
	
	public AddBidManager addOneData(AddBidManager managerData);
	
	public AddBidManager getByID(long bmId);
	
	public AddBidManager updateOneData(AddBidManager managerData,long bmId);

}
