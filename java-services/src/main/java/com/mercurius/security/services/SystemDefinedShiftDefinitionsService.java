package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.SystemDefinedShiftDefinitions;

public interface SystemDefinedShiftDefinitionsService {
	
	public SystemDefinedShiftDefinitions getbyId(long sId);
	
	public SystemDefinedShiftDefinitions addoneItem(SystemDefinedShiftDefinitions ud);
	
	public SystemDefinedShiftDefinitions addmoreItem(List<SystemDefinedShiftDefinitions> uList);
	
	public void updateItem(SystemDefinedShiftDefinitions ud, long sId);
	
	public void deleteItem(long sId);

}
