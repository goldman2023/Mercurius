package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.BidScheduleMapShiftlineSchedule;
import com.mercurius.repository.BidScheduleMapShiftlineScheduleDao;

@Service
public class BidScheduleMapShiftlineScheduleServiceImpl implements BidScheduleMapShiftlineScheduleService {
	
	@Autowired 
	private BidScheduleMapShiftlineScheduleDao shift;
	
	@Override
	public BidScheduleMapShiftlineSchedule addoneItem(BidScheduleMapShiftlineSchedule data) {
		data = shift.save(data);
		return data;
	}

	@Override
	public BidScheduleMapShiftlineSchedule getbyId(long id) {
		Optional<BidScheduleMapShiftlineSchedule> s1 = shift.findById(id);
		BidScheduleMapShiftlineSchedule s2 = s1.get();
		return s2;
	}

	@Override
	public BidScheduleMapShiftlineSchedule updateItem(BidScheduleMapShiftlineSchedule data, long id) {
		data = shift.save(data);
		return data;
	}

	@Override
	public BidScheduleMapShiftlineSchedule deleteItem(long id) {
		BidScheduleMapShiftlineSchedule entity = shift.getOne(id);
		shift.delete(entity);
		return null;
	}

	@Override
	public List<BidScheduleMapShiftlineSchedule> addmoreItem(List<BidScheduleMapShiftlineSchedule> data) {
		data = shift.saveAll(data);
		return data;
	}


}
