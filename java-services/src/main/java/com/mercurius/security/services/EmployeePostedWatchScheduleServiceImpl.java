package com.mercurius.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.EmployeePostedWatchSchedule;
import com.mercurius.repository.EmployeePostedWatchScheduleDao;

@Service
public class EmployeePostedWatchScheduleServiceImpl implements EmployeePostedWatchScheduleService{
	
	@Autowired
	private EmployeePostedWatchScheduleDao postedDao;

	@Override
	public EmployeePostedWatchSchedule addoneItem(EmployeePostedWatchSchedule shiftBid) {
		postedDao.save(shiftBid);
		return shiftBid;
	}

}
