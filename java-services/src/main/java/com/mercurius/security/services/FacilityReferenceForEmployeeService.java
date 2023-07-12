package com.mercurius.security.services;

import java.text.ParseException;
import java.util.List;

import com.mercurius.models.FacilityReferenceForEmployee;

public interface FacilityReferenceForEmployeeService {
	
	public List<String> getfacilitynames();
	
	public String getfacilityid(String facilityabbr);
	
	public List<FacilityReferenceForEmployee> getAll() throws ParseException;

	public FacilityReferenceForEmployee updateByFacilityid(FacilityReferenceForEmployee edata, Long eid) throws ParseException;

	public FacilityReferenceForEmployee addoneItem(FacilityReferenceForEmployee edata) throws ParseException;
	
}
