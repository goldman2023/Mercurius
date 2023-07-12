package com.mercurius.security.services;

import java.text.ParseException;
import java.util.List;

import com.mercurius.models.UserDefinedShiftDefinitions;

public interface UserDefinedShiftDefService {

	public List<UserDefinedShiftDefinitions> getAll() throws ParseException;
	
	public UserDefinedShiftDefinitions getbyId(long sId) throws ParseException;
	
	public UserDefinedShiftDefinitions addoneItem(UserDefinedShiftDefinitions ud) throws ParseException;
	
	public List<UserDefinedShiftDefinitions> addmoreItem(List<UserDefinedShiftDefinitions> uList) throws ParseException;
	
	public UserDefinedShiftDefinitions updateItem(UserDefinedShiftDefinitions ud, long sId) throws ParseException;
	
	public void deleteItem(long sId);

	//Optional<UserData> findById(long uid);
	
	//public List<UserData> getshiftbyuserId(long val);
	
	//public List<UserData> getshiftbyIds(long val);
	
	
}
