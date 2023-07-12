package com.mercurius.controllers;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.SystemDefinedShiftDefinitions;
import com.mercurius.models.SystemdefinedshiftdefchildOne;
import com.mercurius.models.SystemdefinedshiftdefchildThree;
import com.mercurius.models.SystemdefinedshiftdefchildTwo;
import com.mercurius.models.UserDefinedShiftDefinitions;
import com.mercurius.repository.SystemDefinedShiftDefinitionsDao;
import com.mercurius.repository.UserdataDao;
import com.mercurius.security.services.SystemDefinedShiftDefinitionsService;

@RestController
public class SystemDefinedShiftDefinitionController {
	
	// class - SystemDefinedShiftDefinitions
	
	@Autowired
	private SystemDefinedShiftDefinitionsDao systemShiftDefintion;
	
	@Autowired
	private UserdataDao userShiftDefintion;
	
	@RequestMapping(method = RequestMethod.GET, path = "/getshiftdefbasedonduration/{durationtype}")
	public List<SystemDefinedShiftDefinitions> getrecordsbasedonShiftDuration(@PathVariable("durationtype") Integer durationtype) 
	{
		List<SystemDefinedShiftDefinitions>  ld = systemShiftDefintion.getshiftbasedonShiftDuration(durationtype);
		return systemShiftDefintion.getshiftbasedonShiftDuration(durationtype);
	}
	
	@Autowired
	private SystemDefinedShiftDefinitionsService systemservice;
	
	@RequestMapping(method = RequestMethod.POST, path = "/postoneshiftdefshiftdefinitions")
	public SystemDefinedShiftDefinitions addoneItem(@RequestBody SystemDefinedShiftDefinitions sys) 
	{
		return systemservice.addoneItem(sys);
	}
	
	@RequestMapping(method = RequestMethod.POST, path = "/postmoreshiftdefshiftdefinitions")
	public SystemDefinedShiftDefinitions addmoreItem(@RequestBody List<SystemDefinedShiftDefinitions> sysList)
	{
		return systemservice.addmoreItem(sysList);
	}
	
		
	@RequestMapping(method = RequestMethod.GET, path = "/checkinbothdefinitionstable")
	public String checktwotables(@RequestParam int createdby, @RequestParam Time shiftstarttime,
			@RequestParam int shiftduration, @RequestParam int areaid )
	{
	
	String result = null;
	List<SystemDefinedShiftDefinitions> shiftExistsInSystem = systemShiftDefintion.getBasedOnStartTimeDurationAreaidCreatedby(shiftstarttime, shiftduration);
	List<UserDefinedShiftDefinitions> shiftExistsInUser = userShiftDefintion.getBasedOnStartTimeDurationAreaidCreatedby(shiftstarttime, shiftduration,createdby,areaid);
	
	if((shiftExistsInSystem.size()!=0)||(shiftExistsInUser.size()!=0))
	{
		result = "Shift already exists";
	}
	if(shiftExistsInSystem.size()==0&&shiftExistsInUser.size()==0)
	{
		result = "It's a new shift";
	}
	
	shiftExistsInSystem.clear();
	shiftExistsInUser.clear();
	return result;
	
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/getsystemdefshiftdefbyid/{sh_def_id}")
	public SystemdefinedshiftdefchildOne addoneItem(@PathVariable Long sh_def_id) 
	{
		Optional<SystemDefinedShiftDefinitions> s1 = systemShiftDefintion.getshiftbasedonShiftID(sh_def_id);
		SystemdefinedshiftdefchildOne s2 = new SystemdefinedshiftdefchildOne();
		List<SystemdefinedshiftdefchildTwo> s3 = new ArrayList<SystemdefinedshiftdefchildTwo>();
		s2.setSh_def_id(s1.get().getId());
		s2.setStartTime(s1.get().getStartTime());
		s2.setShiftName(s1.get().getShiftName());
		s2.setShiftCategory(s1.get().getshiftCategory());
		s2.setShiftcategory_name(s1.get().getShift_category_name());
		s2.setShift_created_by(s1.get().getshift_created_by());
		s2.setSh_include_exclude(s1.get().getsh_include_exclude());
		s2.setShift_duration(s1.get().getshift_duration());
		for(int i=0;i<7;i++)
		{
			if(i==0) 
			{
			SystemdefinedshiftdefchildTwo b = new SystemdefinedshiftdefchildTwo();
			b.setDay("Sun");
			b.setValue(s1.get().getSun());
			s3.add(i, b);
			}
			
			if(i==1)
			{
			SystemdefinedshiftdefchildTwo b = new SystemdefinedshiftdefchildTwo();
			b.setDay("Mon");
			b.setValue(s1.get().getMon());
			s3.add(i, b);
			}
			
			if(i==2)
			{
			SystemdefinedshiftdefchildTwo b = new SystemdefinedshiftdefchildTwo();
			b.setDay("Tue");
			b.setValue(s1.get().getTue());
			s3.add(i, b);
			}
			
			if(i==3)
			{
			SystemdefinedshiftdefchildTwo b = new SystemdefinedshiftdefchildTwo();
			b.setDay("Wed");
			b.setValue(s1.get().getWed());
			s3.add(i, b);
			}
			
			if(i==4)
			{
			SystemdefinedshiftdefchildTwo b = new SystemdefinedshiftdefchildTwo();
			b.setDay("Thu");
			b.setValue(s1.get().getThu());
			s3.add(i, b);
			}
			
			if(i==5)
			{
			SystemdefinedshiftdefchildTwo b = new SystemdefinedshiftdefchildTwo();
			b.setDay("Fri");
			b.setValue(s1.get().getFri());
			s3.add(i, b);
			}
			
			if(i==6)
			{
			SystemdefinedshiftdefchildTwo b = new SystemdefinedshiftdefchildTwo();
			b.setDay("Sat");
			b.setValue(s1.get().getSat());
			s3.add(i, b);
			}
		}
		s2.setWeek(s3);
		
		 return s2;
	}
	
	
	@RequestMapping(method = RequestMethod.GET, path = "/getallsystemdef")
	public List<SystemdefinedshiftdefchildThree> getall() 
	{
		
		List<SystemdefinedshiftdefchildThree> s3 = new ArrayList<SystemdefinedshiftdefchildThree>();
		s3 = systemShiftDefintion.getAllSystemDefinitions();
		return s3;
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/getshiftduration")
	public List<Object> getShiftDuration() 
	{
		return systemShiftDefintion.getallduration();
	}
	
}
