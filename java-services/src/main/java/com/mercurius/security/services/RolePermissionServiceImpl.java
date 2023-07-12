package com.mercurius.security.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.RolePermissionDetails;
import com.mercurius.repository.RolePermissionDetailsDao;

@Service
public class RolePermissionServiceImpl implements RolePermissionService {
	
	
	@Autowired
	private RolePermissionDetailsDao perm;

	@Override
	public RolePermissionDetails updateByPermissionId(RolePermissionDetails edata, Long eid) throws ParseException {
		
		LocalDate dateObj = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String currentdate = dateObj.format(formatter);
  
        Long permission_id = edata.getP_id();
        Date date2 = edata.getStart_date();
	    Date date3 = edata.getEnd_date();
	    Date date4 = new SimpleDateFormat("yyyy-MM-dd").parse(currentdate);  
		String s1 = null;
        
		Optional<RolePermissionDetails> rp = perm.findById(permission_id);
		
		if(rp.isPresent())
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
		
		perm.save(edata);
		return edata;
	}
	
	

}
