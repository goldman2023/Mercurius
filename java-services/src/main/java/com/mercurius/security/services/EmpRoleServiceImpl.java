package com.mercurius.security.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.AddEmployee;
import com.mercurius.models.EmployeeRole;
import com.mercurius.repository.EmpRoleDao;

@Service
public class EmpRoleServiceImpl implements EmpRoleService {
	
	@Autowired
	private EmpRoleDao role;
	
	@Override
	public EmployeeRole getbyId(long id) {
		Optional<EmployeeRole> s1 = role.findById(id);
		EmployeeRole s2 = s1.get();
		return s2;
	}

	@Override
	public List<EmployeeRole> getAll() {
		// TODO Auto-generated method stub
		return role.findAll();
	}
	
	@Override
	public EmployeeRole updateByRoleid(EmployeeRole edata, Long eid) throws ParseException {
		
		LocalDate dateObj = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String cdate = dateObj.format(formatter);
        System.out.println(cdate);
        edata.setUpdated_date(cdate);
        
        String d2 = edata.getStart_date();
        SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
	    Date date2=formatter2.parse(d2);
	    
	    String d3 = edata.getEnd_date();
		SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
		Date date3=formatter3.parse(d3); 
		
		Date date4 = formatter3.parse(cdate);
		String s1 = null;
        
        if((date2.equals(date4)||date2.before(date4))&&(date3.equals(date4)||date3.after(date4)))
		{
			 s1 = edata.setStatus("Active"); 
			 
			//return ResponseEntity.ok(new MessageResponse("Active Role added"));
		}
        else
        {
        	s1 = edata.setStatus("Inactive");  	
        }
		
		role.save(edata);
		return edata;
	}
	
	@Override
	public EmployeeRole addoneItem(EmployeeRole edata) throws ParseException {
				
		LocalDate dateObj = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String cdate = dateObj.format(formatter);
        System.out.println(cdate);
        edata.setCreated_date(cdate);
        
        String d2 = edata.getStart_date();
        SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
	    Date date2=formatter2.parse(d2);
	    
	    String d3 = edata.getEnd_date();
		SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
		Date date3=formatter3.parse(d3); 
		
		Date date4 = formatter3.parse(cdate);
		String s1 = null;
        
        if((date2.equals(date4)||date2.before(date4))&&(date3.equals(date4)||date3.after(date4)))
		{
			 s1 = edata.setStatus("Active"); 
			 
			//return ResponseEntity.ok(new MessageResponse("Active Role added"));
		}
        else
        {
        	s1 = edata.setStatus("Inactive"); 
        	
        }
		
		role.save(edata);
		return edata;
	}

	
}
