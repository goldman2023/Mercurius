package com.mercurius.security.services;

import java.text.ParseException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.LeaveRequest;
import com.mercurius.repository.LeaveRequestDao;

@Service
public class LeaveRequestServiceImpl implements LeaveRequestService{
	
	@Autowired
	private LeaveRequestDao leaveRequest;

	@Override
	public Optional<LeaveRequest> getbyId(long rid) {
		Optional<LeaveRequest> requestData = leaveRequest.findById(rid);
		return requestData;
	}

	@Override
	public LeaveRequest addoneItem(LeaveRequest requestdata) throws ParseException {
		LeaveRequest rdata = leaveRequest.save(requestdata);
		return rdata;
	}

	@Override
	public LeaveRequest updateByRoleid(LeaveRequest requestdata, Long rid) throws ParseException {
		LeaveRequest rdata = leaveRequest.save(requestdata);
		return rdata;
	}

}
