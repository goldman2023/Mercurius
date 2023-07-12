package com.mercurius.security.services;

import java.util.*;

import org.springframework.stereotype.Service;

import com.mercurius.models.AddEmployee;

@Service
public class EmployeeInfoServiceImpl implements EmployeeInfoService {

	@Override
	public List<Object> getEmployeelistWithAreaFacility(List<Object[]> list) {
		 List<Object> outputList = new ArrayList<Object>();
		 for (Object[] array : list) {
	            Map<String, Object> objectMap = new LinkedHashMap<>();
	            // using LinkedHashMap to preserve order of properties
	            
	    		AddEmployee employee =  (AddEmployee) array[0];
	            objectMap.put("empid", employee.getEmpid());
	            objectMap.put("fname", employee.getFname());
	            objectMap.put("lname", employee.getLname());
	            objectMap.put("initials", employee.getInitials());
	            objectMap.put("phone", employee.getPhone());
	            objectMap.put("email", employee.getEmail());
	            objectMap.put("qualification", employee.getQualification());
	            objectMap.put("role", employee.getrole());
	            objectMap.put("managerid", employee.getManagerid());
	            objectMap.put("rank", employee.getRank());
	            objectMap.put("vacation", employee.getVacation());
	            objectMap.put("accumulatedleave", employee.getAccumulatedleave());
	            objectMap.put("emailsent", employee.getEmailsent());
	            objectMap.put("status", employee.getStatus());
	            objectMap.put("areaid", employee.getAreaid());
	            objectMap.put("areaName", array[array.length - 2]);
	            objectMap.put("facilityName", array[array.length - 1]);
	            
	            outputList.add(objectMap);
	        }
	        
	        return outputList;
	}

}
