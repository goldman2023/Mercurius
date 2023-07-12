package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.SystemDefinedShiftDefinitions;
import com.mercurius.repository.SystemDefinedShiftDefinitionsDao;

@Service
public class SystemDefinedShiftDefinitionsServiceImpl implements SystemDefinedShiftDefinitionsService{

	
	@Autowired
	private SystemDefinedShiftDefinitionsDao system;
	
	@Override
	public SystemDefinedShiftDefinitions getbyId(long sId) {
		Optional<SystemDefinedShiftDefinitions> userOpt = system.findById(sId);
		SystemDefinedShiftDefinitions ud = userOpt.get();
		return ud;
	}

	@Override
	public SystemDefinedShiftDefinitions addoneItem(SystemDefinedShiftDefinitions ud) {
		system.save(ud);
		return ud;
	}

	@Override
	public SystemDefinedShiftDefinitions addmoreItem(List<SystemDefinedShiftDefinitions> uList) {
		system.saveAll(uList);
		return null;
	}

	@Override
	public void updateItem(SystemDefinedShiftDefinitions ud, long sId) {
		system.save(ud);
		
	}

	@Override
	public void deleteItem(long sId) {
		SystemDefinedShiftDefinitions entity = system.getOne(sId);
		system.delete(entity);
	}
	
	

}
