package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.BidScheduleMapShiftlineSchedule;

public interface BidScheduleMapShiftlineScheduleService {
	
	public BidScheduleMapShiftlineSchedule addoneItem( BidScheduleMapShiftlineSchedule data);
	
	public BidScheduleMapShiftlineSchedule getbyId(long id);
	
	public BidScheduleMapShiftlineSchedule updateItem(BidScheduleMapShiftlineSchedule data, long id);
	
	public BidScheduleMapShiftlineSchedule deleteItem(long id);
	
	public List<BidScheduleMapShiftlineSchedule> addmoreItem( List<BidScheduleMapShiftlineSchedule> data);

}
