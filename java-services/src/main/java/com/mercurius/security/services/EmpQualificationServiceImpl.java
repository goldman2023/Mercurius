package com.mercurius.security.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.EmployeeQualification;
import com.mercurius.repository.EmpQualificationDao;

@Service
public class EmpQualificationServiceImpl implements EmpQualificationService {
	
	@Autowired
	private EmpQualificationDao qualification;
	
	//List<EmployeeQualification> getqualificationame = new ArrayList<EmployeeQualification>();
	//List<String> slist = new ArrayList<String>();
	//List<EmployeeQualification> next = new ArrayList<EmployeeQualification>();
	
	@Override
	public List<EmployeeQualification> getAll() {
		
		List<EmployeeQualification> eq = qualification.findAll();
		return eq;
		
		/*getqualificationame.addAll(qualification.findAll());
		for(int i=0;i<getqualificationame.size();i++)
		{
			
			String value = getqualificationame.get(i).getQual_description();
			//System.out.println(value);
			
			
			if(value!=null)
			{
				slist.add(value);
				//System.out.println(slist);
			}
		}
		
		//next = slist.toArray(next);
		
		return getqualificationame;*/
		
	}

	@Override
	public EmployeeQualification addoneItem(EmployeeQualification qudata) throws ParseException {
		
		LocalDate dateObj = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String cdate = dateObj.format(formatter);
        System.out.println(cdate);
        qudata.setQual_created_date(cdate);
        
        String d2 = qudata.getEff_start_date();
        SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
	    Date date2=formatter2.parse(d2);
	    
	    String d3 = qudata.getEff_end_date();
		SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
		Date date3=formatter3.parse(d3); 
		
		Date date4 = formatter3.parse(cdate);
		String s1 = null;
        
        if((date2.equals(date4)||date2.before(date4))&&(date3.equals(date4)||date3.after(date4)))
		{
			 s1 = qudata.setStatus("Active"); 
			//return ResponseEntity.ok(new MessageResponse("Active Role added"));
		}
        else
        {
        	s1 = qudata.setStatus("Inactive"); 
        }
        
		qualification.save(qudata);
		return qudata;
	}

	@Override
	public EmployeeQualification updateByQualficationid(EmployeeQualification qdata, Long qid) throws ParseException {
		
		EmployeeQualification a1 =  qdata;
		Optional<EmployeeQualification> a2 =  qualification.findById(qid);
		
		LocalDate dateObj = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String cdate = dateObj.format(formatter);
        System.out.println(cdate);
        qdata.setQual_created_date(cdate);
        
        String d2 = qdata.getEff_start_date();
        SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
	    Date date2=formatter2.parse(d2);
	    
	    String d3 = qdata.getEff_end_date();
		SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
		Date date3=formatter3.parse(d3); 
		
		Date date4 = formatter3.parse(cdate);
		String s1 = null;
		
		
		if(a2.get().getId().equals(qid))
		{
//			LocalDate dateObj = LocalDate.now();
//	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//	        String date = dateObj.format(formatter);
//	        System.out.println(date);
			
			if((date2.equals(date4)||date2.before(date4))&&(date3.equals(date4)||date3.after(date4)))
			{
				 s1 = qdata.setStatus("Active"); 
				 qdata.setQual_updated_date(cdate);
				//return ResponseEntity.ok(new MessageResponse("Active Role added"));
			}
	        else
	        {
	        	s1 = qdata.setStatus("Inactive"); 
	        	 qdata.setQual_updated_date(cdate);
	        }
		
			qualification.save(qdata);
		}
		return qdata;
	}
	
}
