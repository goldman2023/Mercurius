package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.BidRoundChild;

public interface BidRoundChildService {
	
	public BidRoundChild addoneItem( BidRoundChild data);
	
	public BidRoundChild getbyId(long id);
	
	public BidRoundChild updateItem(BidRoundChild data, long id);
	
	public BidRoundChild deleteItem(long id);
	
	public List<BidRoundChild> addmoreItem( List<BidRoundChild> data);
	
	public List<BidRoundChild> updatemoreItem(List<BidRoundChild> data);

}
