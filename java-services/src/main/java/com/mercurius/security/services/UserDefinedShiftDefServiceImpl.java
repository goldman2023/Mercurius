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

import com.mercurius.models.AreaReferenceForEmployee;
import com.mercurius.models.FacilityReferenceForEmployee;
import com.mercurius.models.ShiftCategoryMaster;
import com.mercurius.models.UserDefinedShiftDefinitions;
import com.mercurius.repository.AreaRefForEmpDao;
import com.mercurius.repository.UserdataDao;

@Service
public class UserDefinedShiftDefServiceImpl implements UserDefinedShiftDefService {

	
	@Autowired
	private UserdataDao userdataDao;
	
	@Autowired
	private ShiftCategoryService categoryService;
	
	@Autowired
	private AreaRefForEmpDao areaDao;
	
	List<UserDefinedShiftDefinitions> udList;
	
	@Override
	public List<UserDefinedShiftDefinitions> getAll() throws ParseException {
		
		List<UserDefinedShiftDefinitions> userShiftdData = userdataDao.findAll();
		return userShiftdData;

	}

	@Override
	public UserDefinedShiftDefinitions getbyId(long sId) throws ParseException {
		
		Optional<UserDefinedShiftDefinitions> userShiftdData = userdataDao.findById(sId);
		UserDefinedShiftDefinitions udata = userShiftdData.get();
		return udata;
	}

	@Override
	public UserDefinedShiftDefinitions addoneItem(UserDefinedShiftDefinitions userShift) throws ParseException {
		
        //set shift category name in "user_defined_shift" Table by fetching the data from "shift_category_master" Table
        int categoryId = userShift.getSh_category_id(); 
        Optional<ShiftCategoryMaster> categoryIdRef = categoryService.getbyId(categoryId);
        userShift.setSh_category_name_ref(categoryIdRef.get().getShcategory_name());
      
        int areaId = userShift.getSh_area_id();
        Optional<AreaReferenceForEmployee> areaData = areaDao.findById((long) areaId);
        userShift.setArea_name_ref(areaData.get().getAreaname());
        
        LocalDate dateObj = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String currentDate = dateObj.format(formatter);
        userShift.setCreated_date(currentDate);
        
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
		return userShift;
	}

	@Override
	public List<UserDefinedShiftDefinitions> addmoreItem(List<UserDefinedShiftDefinitions> uList) throws ParseException {
		
		List<UserDefinedShiftDefinitions> cList = uList;
		List<UserDefinedShiftDefinitions> rList = new ArrayList<UserDefinedShiftDefinitions>();
		
		int n = cList.size();
		
		for(int i=0;i<n;i++)
		{
			UserDefinedShiftDefinitions userShift = cList.get(i);

			LocalDate dateObj = LocalDate.now();
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	        String currentDate = dateObj.format(formatter);
	        userShift.setCreated_date(currentDate);
	        
	        int areaId = userShift.getSh_area_id();
	        Optional<AreaReferenceForEmployee> areaData = areaDao.findById((long) areaId);
	        userShift.setArea_name_ref(areaData.get().getAreaname());
	        
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
			rList.add(userShift);
		}
		
		return rList;
	}

	@Override
	public UserDefinedShiftDefinitions updateItem(UserDefinedShiftDefinitions userShift, long sId) throws ParseException {
		
		LocalDate dateObj = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String currentDate = dateObj.format(formatter);
        userShift.setUpdated_date(currentDate);
        
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
		
		Optional<UserDefinedShiftDefinitions> userOpt = userdataDao.findById(sId);
		UserDefinedShiftDefinitions ud1 = userOpt.get();
		return ud1;
		}
	

	@Override
	public void deleteItem(long sId) {
		//udList.removeIf(ud -> ud.getSh_id().equals(sId));
		UserDefinedShiftDefinitions entity = userdataDao.getOne(sId);
		userdataDao.delete(entity);
		
	}

		
}
