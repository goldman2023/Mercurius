package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.AddEmployee;

public interface AddNewEmployeeService {
	
	public List<AddEmployee> getAllEmployeeInfo();
	
	public AddEmployee getbyId(long id);
	
	public AddEmployee addoneItem(AddEmployee emp);
	
	public AddEmployee getbyEmail(String email);
	
	List<AddEmployee> updateListOfEmployees(List<AddEmployee> edata);
	
	public AddEmployee updateByEmpid(AddEmployee edata, Long eid);
	
	public AddEmployee updateByManagerid(AddEmployee edata, Long mid);
	
	public AddEmployee deleteByEmpid(Long eid);

}
