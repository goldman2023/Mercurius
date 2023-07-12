package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.BidLeaveChild;
import com.mercurius.repository.BidLeaveChildDao;

@Service
public class BidLeaveChildServiceImpl implements BidLeaveChildService{
	
	@Autowired 
	private BidLeaveChildDao leave;
	
	@Override
	public BidLeaveChild addoneItem(BidLeaveChild data) {
		data = leave.save(data);
		return data;
	}

	@Override
	public BidLeaveChild getbyId(long id) {
		Optional<BidLeaveChild> s1 = leave.findById(id);
		BidLeaveChild s2 = s1.get();
		return s2;
	}

	@Override
	public BidLeaveChild updateItem(BidLeaveChild data, long id) {
		data = leave.save(data);
		return data;
	}

	@Override
	public BidLeaveChild deleteItem(long id) {
		BidLeaveChild entity = leave.getOne(id);
		leave.delete(entity);
		return null;
	}

	@Override
	public List<BidLeaveChild> addmoreItem(List<BidLeaveChild> data) {
		data = leave.saveAll(data);
		return data;
	}

}
