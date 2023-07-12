package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.ShiftlineBidding;

public interface ShiftlineBiddingService {

	public ShiftlineBidding getbyId(long bId);
	
	public ShiftlineBidding addoneItem(ShiftlineBidding bdata);
	
	public List<ShiftlineBidding> addmoreItem(List<ShiftlineBidding> bdata);
	
	public ShiftlineBidding updateByEmployeeId(ShiftlineBidding bdata, long empId);

	public ShiftlineBidding updateById(ShiftlineBidding bdata, long bidId);

	public List<ShiftlineBidding> updateItemMore(List<ShiftlineBidding> bdata);
}
