package com.mercurius.security.services;

import java.text.ParseException;
import java.util.List;

import com.mercurius.models.FacilityType;

public interface FacilityTypeService {
	
	public List<FacilityType> getAll() throws ParseException;

	public FacilityType updateByFacilityid(FacilityType edata, Long eid) throws ParseException;

	public FacilityType addoneItem(FacilityType edata) throws ParseException;


}
