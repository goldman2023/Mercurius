package com.mercurius.security.services;

import java.text.ParseException;
import java.util.Optional;

import com.mercurius.models.LeaveRequest;

public interface LeaveRequestService {
	
	public Optional<LeaveRequest> getbyId(long rid);
	
	public LeaveRequest addoneItem(LeaveRequest requestdata) throws ParseException;

	public LeaveRequest updateByRoleid(LeaveRequest requestdata, Long rid) throws ParseException;

}
