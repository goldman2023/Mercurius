package com.mercurius.security.services;

import java.text.ParseException;
import java.util.List;

import com.mercurius.models.AreaReferenceForEmployee;

public interface AreaReferenceForEmployeeService {
	
	public List<String> getAreaNames(Long facilityid);
	
	public String getAreaid(String areaname,Long facilityid );
	
	public List<AreaReferenceForEmployee> getAll() throws ParseException;

	public AreaReferenceForEmployee updateByareaid(AreaReferenceForEmployee edata, Long eid) throws ParseException;

	public AreaReferenceForEmployee addoneItem(AreaReferenceForEmployee edata) throws ParseException;


}
