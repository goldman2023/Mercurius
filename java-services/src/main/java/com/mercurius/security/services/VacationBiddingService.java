package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.VacationBidding;

public interface VacationBiddingService {

	public VacationBidding addoneItem( VacationBidding vadata);
	
	public VacationBidding getbyId(long vacId);
	
	public List<VacationBidding> addmoreItem(List<VacationBidding> vadata);
	
}
