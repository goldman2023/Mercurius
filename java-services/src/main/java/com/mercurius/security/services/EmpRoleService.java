package com.mercurius.security.services;

import java.text.ParseException;
import java.util.List;
import java.util.Optional;

import com.mercurius.models.EmployeeRole;

public interface EmpRoleService {

	public List<EmployeeRole> getAll();

	public EmployeeRole updateByRoleid(EmployeeRole edata, Long eid) throws ParseException;

	public EmployeeRole addoneItem(EmployeeRole edata) throws ParseException;

	EmployeeRole getbyId(long id);


	//EmployeeRole getOneRoleId(String eid); 
	
	
}
