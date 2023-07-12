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

import com.mercurius.models.AreaReferenceForEmployee;
import com.mercurius.models.ShiftCategoryMaster;
import com.mercurius.repository.AreaRefForEmpDao;


@Service
public class AreaReferenceForEmployeeServiceImpl implements AreaReferenceForEmployeeService{

	
	@Autowired
	private AreaRefForEmpDao areaDao;
	
	@Override
	public List<String> getAreaNames(Long facilityid) {
		
		List<String> s2 = areaDao.getAllAreaNames(facilityid);
		return s2;
	}

	@Override
	public String getAreaid(String areaname, Long facilityid) {
		System.out.println(areaname);
		System.out.println(facilityid);
		String val1 = areaDao.getcorrectareaid(areaname,facilityid);
		System.out.println(val1);
		String s1 = "areaidref:"+val1;
		System.out.println(s1);
		return s1;
	}

	@Override
	public List<AreaReferenceForEmployee> getAll() throws ParseException {
		
		List<AreaReferenceForEmployee> fct = areaDao.findAll();
		int n = fct.size();
		
		for(int i=0;i<n;i++)
		{
			AreaReferenceForEmployee edata = fct.get(i);
			LocalDate dateObj = LocalDate.now();
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	        String cdate = dateObj.format(formatter);
	       // System.out.println(cdate);
	       // edata.setUpdated_date(cdate);
	        
	        String d2 = edata.getStart_date();
	        SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
		    Date date2=formatter2.parse(d2);
		    
		    String d3 = edata.getEnd_date();
			SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
			Date date3=formatter3.parse(d3); 
			
			Date date4 = formatter3.parse(cdate);
			String s1 = null;
			
			Long ftype_id = edata.getAreaid();
	        
			Optional<AreaReferenceForEmployee> ft = areaDao.findById(ftype_id);
			
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
			
			areaDao.save(edata);		
			
		}
		List<AreaReferenceForEmployee> fdata = areaDao.findAll();
		return fdata;

	}

	@Override
	public AreaReferenceForEmployee updateByareaid(AreaReferenceForEmployee edata, Long eid) throws ParseException {
		
		LocalDate dateObj = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String cdate = dateObj.format(formatter);
        //System.out.println(cdate);
        edata.setUpdated_date(cdate);
        Date date2;
        
        String d2 = edata.getStart_date();
        if(d2==null||d2.isBlank()||d2.isEmpty())
        {
        date2 = null;
        }
        else
        {
        SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
	     date2=formatter2.parse(d2);
        }
	    
	    String d3 = edata.getEnd_date();
		SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
		Date date3;
		if(d3==null||d3.isBlank()||d3.isEmpty())
        {
        date3 = null;
        }
        else
        {
		date3=formatter3.parse(d3);
        }
		
		Date date4 = formatter3.parse(cdate);
		String s1 = null;
		
		Long ftype_id = edata.getAreaid();
        
		Optional<AreaReferenceForEmployee> ft = areaDao.findById(ftype_id);
		System.out.println("ft value:"+ft);
		
		if(ft.isPresent())
		{
		if(date2==null||date3==null)
	     {
	        s1 = edata.setStatus(null);
	     }
		else if((date2.equals(date4)||date2.before(date4))&&(date3.equals(date4)||date3.after(date4)))
		{
			 s1 = edata.setStatus("Active"); 
			 
			//return ResponseEntity.ok(new MessageResponse("Active Role added"));
		}
        else if((date2.after(date4)))
        {
        	s1 = edata.setStatus("Inactive");  	
        }
        
		}
		
		areaDao.save(edata);
		return edata;


	}

	@Override
	public AreaReferenceForEmployee addoneItem(AreaReferenceForEmployee edata) throws ParseException {
		
		LocalDate dateObj = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String cdate = dateObj.format(formatter);
        System.out.println(cdate);
        edata.setCreated_date(cdate);
        Date date2;
        
        String d2 = edata.getStart_date();
        if(d2==null||d2.isBlank()||d2.isEmpty())
        {
        date2 = null;
        }
        else
        {
        SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
	     date2=formatter2.parse(d2);
        }
	    
        String d3 = edata.getEnd_date();
		SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
		Date date3;
		if(d3==null||d3.isBlank()||d3.isEmpty())
        {
        date3 = null;
        }
        else
        {
		date3=formatter3.parse(d3);
        }
		
		Date date4 = formatter3.parse(cdate);
		String s1 = null;
        
		if(date2==null||date3==null)
	     {
	        s1 = edata.setStatus(null);
	     }
		else if((date2.equals(date4)||date2.before(date4))&&(date3.equals(date4)||date3.after(date4)))
		{
			 s1 = edata.setStatus("Active"); 
			 
			//return ResponseEntity.ok(new MessageResponse("Active Role added"));
		}
        else  if((date2.after(date4)))
        {
        	s1 = edata.setStatus("Inactive"); 
        	
        }
		
        areaDao.save(edata);
		return edata;

	}
	
	

}
