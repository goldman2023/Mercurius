package com.mercurius.security.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.Shiftlinechild;
import com.mercurius.repository.ShiftlinechildDao;

@Service
public class ShiftlinechildServiceImpl implements ShiftlinechildService {
	
	@Autowired
	private ShiftlinechildDao shchild;

	@Override
	public Shiftlinechild getbyId(long sId) {
		Optional<Shiftlinechild> s1 = shchild.findById(sId);
		Shiftlinechild s2 = s1.get();
		return s2;
	}

	@Override
	public Shiftlinechild addoneItem(Shiftlinechild sd) {
		shchild.save(sd);
		return sd;
	}

	@Override
	public Shiftlinechild updateItem(Shiftlinechild sd, long sId) {
		shchild.save(sd);
		return sd;
	}

	@Override
	public Shiftlinechild deleteItem(long sId) {
		Shiftlinechild s3 = shchild.getOne(sId);
		shchild.delete(s3);
		return null;
		
	}

}
