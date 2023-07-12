package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.ShiftLineWorkForceDetails;
import com.mercurius.repository.ShiftLineWorkForceDetailsDao;

@Service
public class ShiftLineWorkForceDetailsServiceImpl implements  ShiftLineWorkForceDetailsService{
	
	@Autowired
	private ShiftLineWorkForceDetailsDao work;

	@Override
	public ShiftLineWorkForceDetails getbyId(long workId) {
		Optional<ShiftLineWorkForceDetails> wdata = work.findById(workId);
		ShiftLineWorkForceDetails wd = wdata.get();
		return wd;
	}

	@Override
	public ShiftLineWorkForceDetails addoneItem(ShiftLineWorkForceDetails workdata) {
		work.save(workdata);
		return workdata;
	}

	@Override
	public List<ShiftLineWorkForceDetails> addmoreItem(List<ShiftLineWorkForceDetails> worklist) {
		work.saveAll(worklist);
		return worklist;
	}

}
