package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.BidScheduleMapEmployeeDetails;
import com.mercurius.repository.BidScheduleMapEmployeeDetailsDao;

@Service
public class BidScheduleMapEmployeeDetailsServiceImpl implements BidScheduleMapEmployeeDetailsService {

	@Autowired 
	private BidScheduleMapEmployeeDetailsDao emp;
	
	@Override
	public BidScheduleMapEmployeeDetails addoneItem(BidScheduleMapEmployeeDetails bpemp) {
		bpemp = emp.save(bpemp);
		return bpemp;
	}

	@Override
	public BidScheduleMapEmployeeDetails getbyId(long bidempId) {
		Optional<BidScheduleMapEmployeeDetails> s1 = emp.findById(bidempId);
		BidScheduleMapEmployeeDetails s2 = s1.get();
		return s2;
	}

	@Override
	public BidScheduleMapEmployeeDetails updateItem(BidScheduleMapEmployeeDetails bpemp, long bidempId) {
		bpemp = emp.save(bpemp);
		return bpemp;
	}

	@Override
	public BidScheduleMapEmployeeDetails deleteItem(long bidempId) {
		BidScheduleMapEmployeeDetails entity = emp.getOne(bidempId);
		emp.delete(entity);
		return null;
	}

	@Override
	public List<BidScheduleMapEmployeeDetails> addmoreItem(List<BidScheduleMapEmployeeDetails> bpemp) {
		bpemp = emp.saveAll(bpemp);
		return bpemp;
	}

}
