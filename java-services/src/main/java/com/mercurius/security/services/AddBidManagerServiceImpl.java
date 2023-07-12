package com.mercurius.security.services;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.mercurius.models.AddBidManager;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.repository.AddBidManagerDao;

@Service
public class AddBidManagerServiceImpl implements AddBidManagerService{

	@Autowired
	private AddBidManagerDao managerdao;
	
	@Override
	public AddBidManager addOneData(AddBidManager managerData) {
		managerdao.save(managerData);
		return managerData;
	}

	@Override
	public AddBidManager getByID(long bmId) {
		Optional<AddBidManager> managerData = managerdao.findById(bmId);
		AddBidManager mData = managerData.get();
		return mData;
	}

	@Override
	public AddBidManager updateOneData(AddBidManager managerData, long bmId) {
		
		return managerdao.save(managerData);
	}
	

}
