package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.UserDefinedShiftDefinitions;
import com.mercurius.repository.UserdataDao;

@Service
public class CronJobForUserDefinedShiftDefServiceImpl implements CronJobForUserDefinedShiftDefService{

	@Autowired
	private UserdataDao userdataDao;
	
	@Autowired
	private UserDefinedShiftDefService userShiftService;
	
	@Override
	public List<Object> changeUserDefinedShiftStatus()
			throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException {
		
		//List<UserDefinedShiftDefinitions> userShiftData = userdataDao.getshiftbyStatus("Active");
		
		List<UserDefinedShiftDefinitions> userShiftData = userShiftService.getAll();
		
		for(int i=0;i<userShiftData.size();i++)
		{
				
			UserDefinedShiftDefinitions userShift = userShiftData.get(i);
			
			LocalDate dateObj = LocalDate.now();
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	        String currentDate = dateObj.format(formatter);
	        //System.out.println(cdate);
	        
	        SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd"); 
	        Date startDate ;
	        Date endDate;
	        
	        String activationDate = userShift.getSh_activation_date();
	        if(activationDate==null||activationDate.isBlank()||activationDate.isEmpty())
	        {
	        	startDate = null;
	        }
	        else
	        {
	        
	        	startDate=formatter2.parse(activationDate);
	        }
		    
		    String expirationDate = userShift.getSh_expiration_date();
		    if(expirationDate==null||expirationDate.isBlank()||expirationDate.isEmpty())
		    {
		    	endDate = null;
		    }
		    else
		    {
		    	endDate=formatter2.parse(expirationDate); 
		    }
			
			Date todayDate = formatter2.parse(currentDate);
			
			if(startDate==null||endDate==null)
		    {
				userShift.setStatus(null);
		    } 
			else if((startDate.before(todayDate))&&(endDate.after(todayDate)))
			{
				userShift.setStatus("Active");  	
			}
			else if((startDate.equals(todayDate))||(endDate.equals(todayDate)))
			{
				userShift.setStatus("Active"); 
			}
			else if((startDate.after(todayDate))&&(endDate.after(todayDate))||(startDate.before(todayDate))&&(endDate.before(todayDate)))
			{
				userShift.setStatus("Inactive");  	
			}
			
			userdataDao.save(userShift);
		}
		
		return null;
	}

}
