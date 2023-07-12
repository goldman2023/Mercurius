package com.mercurius.security.services;

import java.text.ParseException;
import java.util.List;

import com.mercurius.models.EmployeeQualification;

public interface EmpQualificationService {

	public List<EmployeeQualification> getAll(); 
	
	public EmployeeQualification addoneItem(EmployeeQualification qudata) throws ParseException;
	
	//public AddEmployee getbyEmail(String email);
	
	//List<AddEmployee> updateListOfEmployees(List<AddEmployee> edata);
	
	public EmployeeQualification updateByQualficationid(EmployeeQualification qdata, Long qid) throws ParseException;
	
	//public AddEmployee updateByManagerid(AddEmployee edata, Long mid);
	
}
