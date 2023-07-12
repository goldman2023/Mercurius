package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.BidLeaveChild;

public interface BidLeaveChildService {
	
	public BidLeaveChild addoneItem( BidLeaveChild data);
	
	public BidLeaveChild getbyId(long id);
	
	public BidLeaveChild updateItem(BidLeaveChild data, long id);
	
	public BidLeaveChild deleteItem(long id);
	
	public List<BidLeaveChild> addmoreItem( List<BidLeaveChild> data);

}
