package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.BidWindowDuration;

public interface BidWindowDurationService {
	
	
	public BidWindowDuration getbyId(long durationid);
	
	public List<BidWindowDuration> addmoreItem(List<BidWindowDuration> durationlist);
	
	public BidWindowDuration updatePrimarylId(BidWindowDuration data, Long durationid);

	public BidWindowDuration updateByEmployeeId(BidWindowDuration data, Long empid);
	
	public BidWindowDuration deleteItem(long durationId);

}
