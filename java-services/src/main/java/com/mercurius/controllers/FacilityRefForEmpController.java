package com.mercurius.controllers;

import java.text.ParseException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.AreaReferenceForEmployee;
import com.mercurius.models.FacilityReferenceForEmployee;
import com.mercurius.models.FacilityReferenceForEmployeeChild1;
import com.mercurius.repository.AreaRefForEmpDao;
import com.mercurius.repository.FacilityRefForEmpDao;
import com.mercurius.security.services.FacilityReferenceForEmployeeService;

@RestController
public class FacilityRefForEmpController {
	
	//(Facility with States) - ref_facility Table - FacilityReferenceForEmployee - Class
	
	@Autowired
	private FacilityReferenceForEmployeeService facilityservice;
	
	@Autowired
	private FacilityRefForEmpDao facilitydao;

	@Autowired
	private AreaRefForEmpDao areadao;
	
	
	@RequestMapping(method = RequestMethod.GET, path = "/getfacilitybasedonname/{facilitytypename}")
	public List<FacilityReferenceForEmployee> getdetailsbasedonFacilityName(@PathVariable("facilitytypename") String facilitytypename) 
	{
		return facilitydao.getfacilityBasedOnFacilityNames(facilitytypename);
	}

	
	@RequestMapping(method = RequestMethod.GET, path = "/getfacilitynames")
	public List<String> reffacilitynames() 
	{
		return facilityservice.getfacilitynames();
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/getfacilityid/{facilityabbr}")
	public String refareaid(@PathVariable("facilityabbr") String facilityabbr) 
	{
		return facilityservice.getfacilityid(facilityabbr);
	}
	
	
	@GetMapping("/getallfacilitystates")
	public List<FacilityReferenceForEmployee> getFacilityStateDetails() throws ParseException
	{
		
		List<FacilityReferenceForEmployee> e1 = facilityservice.getAll();
		return e1;
	}
	
	@PostMapping("/savefacilitystatedetails") 
	public FacilityReferenceForEmployee savedata(@RequestBody FacilityReferenceForEmployee data) throws ParseException
	{   
		FacilityReferenceForEmployee e1 = facilityservice.addoneItem(data);
		return e1; 
	}
		
	@RequestMapping(method = RequestMethod.PUT, value = "/updatefacilitystatedetails/{ftId}")
	public FacilityReferenceForEmployee updateItem3(@RequestBody FacilityReferenceForEmployee fdata, @PathVariable("ftId") Long ftId) throws ParseException 
	{
		FacilityReferenceForEmployee e1 = facilityservice.updateByFacilityid(fdata, ftId);
		return e1;
	}
		
	@RequestMapping(method = RequestMethod.GET, path = "/getfacilitynameswithid")
	public List<FacilityReferenceForEmployeeChild1> getfacilityidandname() 
	{
		return facilitydao.getFacilityNamesWithId();
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/getfacilitynamesbasedonempareaid/{empareaid}")
	public FacilityReferenceForEmployeeChild1 getfacilitynamesbasedonempareaid(@PathVariable("empareaid") Long empareaid) 
	{
		Optional<AreaReferenceForEmployee> s1 = areadao.findById(empareaid);
		if (s1.isEmpty()) return null;
		AreaReferenceForEmployee area = s1.get();

		Optional<FacilityReferenceForEmployee> s2 = facilitydao.findById(area.getFacilityidref());
		if (s2.isEmpty()) return null;
		FacilityReferenceForEmployee facility = s2.get();

		return new FacilityReferenceForEmployeeChild1(facility.getFacilityid(), facility.getFacilityname(), facility.getFacilityabbr());
	}

}
