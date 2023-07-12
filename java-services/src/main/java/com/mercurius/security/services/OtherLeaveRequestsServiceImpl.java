package com.mercurius.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.OtherLeaveRequests;
import com.mercurius.repository.OtherLeaveRequestsDao;

@Service
public class OtherLeaveRequestsServiceImpl implements OtherLeaveRequestsService{
	
	@Autowired
	private OtherLeaveRequestsDao requestDao;

	@Override
	public OtherLeaveRequests addOneData(OtherLeaveRequests requestData) {
		OtherLeaveRequests data =  requestDao.save(requestData);
		return data;
	}

}
