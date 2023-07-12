package com.mercurius.controllers;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.AreaChild;
import com.mercurius.models.AreaReferenceForEmployee;
import com.mercurius.repository.AreaRefForEmpDao;
import com.mercurius.security.services.AreaReferenceForEmployeeService;

@RestController
public class AreaRefForEmpController {
	
	//facilityid and areaid to add in employee_details table
	// ref_area - Table with AreaReferenceForEmployee - Class
	
	@Autowired
	private AreaReferenceForEmployeeService areaservice;
	
	@Autowired
	private AreaRefForEmpDao areadao;
	
	
	@RequestMapping(method = RequestMethod.GET, path = "/getareanames/{facilityId}")
	public List<String> refareanames(@PathVariable("facilityId") Long facilityId) 
	{
		return areaservice.getAreaNames(facilityId);
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/getareaid")
	public String refareaid(@RequestParam String areaname,@RequestParam Long facilityId) 
	{
		return areaservice.getAreaid(areaname,facilityId);
	}
	
	
	@GetMapping("/getallareadetails")
	public List<AreaReferenceForEmployee> getAreaDetails() throws ParseException
	{
		
		List<AreaReferenceForEmployee> e1 = areaservice.getAll();
		return e1;
	}
	
	  @PostMapping("/saveareadetails") 
	  public AreaReferenceForEmployee savedata(@RequestBody AreaReferenceForEmployee data) throws ParseException
	  { 
		  
		  AreaReferenceForEmployee e1 = areaservice.addoneItem(data);
		  return e1; 
	  }
		

	  @RequestMapping(method = RequestMethod.PUT, value = "/updateareadetails/{aId}")
	  public AreaReferenceForEmployee updateItem3(@RequestBody AreaReferenceForEmployee fdata, @PathVariable("aId") Long aId) throws ParseException 
	  {
		  
		  AreaReferenceForEmployee e1 = areaservice.updateByareaid(fdata, aId);
		  return e1;
		
	  }
	  
	  @RequestMapping(method = RequestMethod.GET, path = "/getareanamesforfacilityid/{facilityId}")
		public List<AreaReferenceForEmployee> refareanamesbasedonfacilityId(@PathVariable("facilityId") Long facilityId) throws ParseException 
		{
		  	//List<AreaReferenceForEmployee> e1 = areaservice.getAll();
			return areadao.getAreaBasedonFacilityId(facilityId);
		}
	  
	  @RequestMapping(method = RequestMethod.GET, path = "/getareanamesaloneforfacilityid/{facilityId}")
		public List<AreaChild> refareanamesalonebasedonfacilityId(@PathVariable("facilityId") Long facilityId) throws ParseException 
		{
		  	List<AreaReferenceForEmployee> data = areadao.getAreaBasedonFacilityId(facilityId);
		  	List<AreaChild> cdata = new ArrayList <AreaChild>();
		  	for(int i=0;i<data.size();i++)
		  	{
		  		AreaChild areadata = new AreaChild();
		  		areadata.setAreaid(data.get(i).getAreaid());
		  		areadata.setAreaname(data.get(i).getAreaname());
		  		cdata.add(areadata);
		  	}
			return cdata;
		}
	  
	  @RequestMapping(method = RequestMethod.GET, path = "/getareanames")
		public  List<AreaChild> refareanames() 
		{
			return areadao.getAreaNames();
		}
	  
	  @RequestMapping(method = RequestMethod.GET, path = "/getareanamesbasedonfacilityid/{facilityId}")
	  public List<AreaChild> getareanames(@PathVariable("facilityId") Long facilityId) 
	  {
			return areadao.getAreaNamesBasedOnFacilityId(facilityId);
	  }
	
	  @RequestMapping(method = RequestMethod.GET, path = "/getareanamebasedonareaid/{areaid}")
	  public List<Object> getareaname(@PathVariable("areaid") Long areaid) 
	  {
			return areadao.getAreaNameBasedOnAreaId(areaid);
	  }


}
