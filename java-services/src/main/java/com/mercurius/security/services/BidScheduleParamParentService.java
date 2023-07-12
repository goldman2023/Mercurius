package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.BidScheduleParamParent;

public interface BidScheduleParamParentService {
	
	public BidScheduleParamParent addoneItem( BidScheduleParamParent bp);
	
	public BidScheduleParamParent getbyId(long pId);
	
	public BidScheduleParamParent updateItem(BidScheduleParamParent bp, long pId);
	
	public BidScheduleParamParent deleteItem(long pId);
	
	public List<BidScheduleParamParent> updateItemMore(List<BidScheduleParamParent> bp);

}
