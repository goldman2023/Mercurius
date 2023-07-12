package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.BidWindowDuration;
import com.mercurius.repository.BidWindowDurationDao;

@Service
public class BidWindowDurationServiceImpl implements BidWindowDurationService {

	@Autowired
	private BidWindowDurationDao durationDao;
	
	@Override
	public BidWindowDuration getbyId(long durationid) {
		
		Optional<BidWindowDuration> s1 = durationDao.findById(durationid);
		BidWindowDuration s2 = s1.get();
		return s2;
	}
	
	@Override
	public List<BidWindowDuration> addmoreItem(List<BidWindowDuration> durationlist) {
		durationDao.saveAll(durationlist);
		return durationlist;
	}

	@Override
	public BidWindowDuration updatePrimarylId(BidWindowDuration data, Long durationid) {
		durationDao.save(data);
		return data;
	}

	@Override
	public BidWindowDuration updateByEmployeeId(BidWindowDuration data, Long empid) {
		durationDao.save(data);
		return data;
	}

	@Override
	public BidWindowDuration deleteItem(long durationId) {
		BidWindowDuration entity = durationDao.getOne(durationId);
		durationDao.delete(entity);
		return null;
	}

}
