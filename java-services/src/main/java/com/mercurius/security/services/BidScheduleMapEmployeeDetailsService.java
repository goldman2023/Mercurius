package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.BidScheduleMapEmployeeDetails;

public interface BidScheduleMapEmployeeDetailsService {
	
	public BidScheduleMapEmployeeDetails addoneItem( BidScheduleMapEmployeeDetails bpemp);
	
	public BidScheduleMapEmployeeDetails getbyId(long bidempId);
	
	public BidScheduleMapEmployeeDetails updateItem(BidScheduleMapEmployeeDetails bpemp, long bidempId);
	
	public BidScheduleMapEmployeeDetails deleteItem(long bidempId);
	
	public List<BidScheduleMapEmployeeDetails> addmoreItem( List<BidScheduleMapEmployeeDetails> bpemp);

}
