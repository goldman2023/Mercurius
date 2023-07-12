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

import com.mercurius.models.FacilityReferenceForEmployee;
import com.mercurius.models.FacilityType;
import com.mercurius.repository.FacilityRefForEmpDao;

@Service
public class FacilityReferenceForEmployeeServiceImpl implements FacilityReferenceForEmployeeService{

	
	@Autowired
	private FacilityRefForEmpDao facility;
	
	@Override
	public List<String> getfacilitynames() {
		List<String> s1 = facility.getAllFacilityAbbrevations();
		return s1;
	}

	@Override
	public String getfacilityid(String facilityabbr) {
		String s2 = facility.getcorrectfacilityid(facilityabbr);
		String s3 = "facilityidref:"+s2;
		return s3;
	}

	@Override
	public List<FacilityReferenceForEmployee> getAll() throws ParseException {
		
		List<FacilityReferenceForEmployee> fct = facility.findAll();
		int n = fct.size();
		
		for(int i=0;i<n;i++)
		{
			FacilityReferenceForEmployee edata = fct.get(i);
			LocalDate dateObj = LocalDate.now();
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	        String cdate = dateObj.format(formatter);
	        System.out.println(cdate);
	       // edata.setUpdated_date(cdate);
	        
	        String d2 = edata.getStart_date();
	        SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
		    Date date2=formatter2.parse(d2);
		    
		    String d3 = edata.getEnd_date();
			SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
			Date date3=formatter3.parse(d3); 
			
			Date date4 = formatter3.parse(cdate);
			String s1 = null;
			
			Long ftype_id = edata.getFacilityid();
	        
			Optional<FacilityReferenceForEmployee> ft = facility.findById(ftype_id);
			
			if(ft.isPresent())
			{
	        if((date2.equals(date4)||date2.before(date4))&&(date3.equals(date4)||date3.after(date4)))
			{
				 s1 = edata.setStatus("Active"); 
				 
				//return ResponseEntity.ok(new MessageResponse("Active Role added"));
			}
	        else
	        {
	        	s1 = edata.setStatus("Inactive");  	
	        }
			}
			
			facility.save(edata);		
			
		}
		List<FacilityReferenceForEmployee> fdata = facility.findAll();
		return fdata;

	}

	@Override
	public FacilityReferenceForEmployee updateByFacilityid(FacilityReferenceForEmployee edata, Long eid)
			throws ParseException {
	
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
		
		Long ftype_id = edata.getFacilityid();
        
		Optional<FacilityReferenceForEmployee> ft = facility.findById(ftype_id);
		System.out.println("ft value:"+ft);
		
		if(ft.isPresent())
		{
        if((date2.equals(date4)||date2.before(date4))&&(date3.equals(date4)||date3.after(date4)))
		{
			 s1 = edata.setStatus("Active"); 
			 
			//return ResponseEntity.ok(new MessageResponse("Active Role added"));
		}
        else
        {
        	s1 = edata.setStatus("Inactive");  	
        }
		}
		
        facility.save(edata);
		return edata;
	
	}

	@Override
	public FacilityReferenceForEmployee addoneItem(FacilityReferenceForEmployee edata) throws ParseException {
		
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
		
        facility.save(edata);
		return edata;

		
	}

}
