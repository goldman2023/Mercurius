package com.mercurius.controllers;

import java.text.ParseException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.UserDefinedShiftDefinitions;
import com.mercurius.repository.UserdataDao;
import com.mercurius.security.services.UserDefinedShiftDefService;

@RestController
public class UserDefinedShiftDefinitionController {
	
/*** Table - user_defined_shift_definitions  <---> class - UserDefinedShiftDefinitions ***/
	
	@Autowired
	private UserDefinedShiftDefService userdataService;
	
	@GetMapping("/shiftdefinition")
	public List<UserDefinedShiftDefinitions> getEverything() throws ParseException
	{
		return this.userdataService.getAll();
	}
	
	@GetMapping("/shiftdefinition/{sId}")
	public UserDefinedShiftDefinitions getEverythingbyId(@PathVariable String sId ) throws NumberFormatException, ParseException
	{
		return this.userdataService.getbyId(Long.parseLong(sId));
	}
	
	
	@RequestMapping(method = RequestMethod.POST, path = "/shiftdefinition")
	public UserDefinedShiftDefinitions addoneItem(@RequestBody UserDefinedShiftDefinitions ud) throws ParseException
	{
		return this.userdataService.addoneItem(ud);
	}
	
	@RequestMapping(method = RequestMethod.POST, path = "/allshiftdefinition")
	public List<UserDefinedShiftDefinitions> addmanyItem(@RequestBody List<UserDefinedShiftDefinitions> uList) throws ParseException
	{
		return this.userdataService.addmoreItem(uList);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/shiftdefinition/{sId}")
	public UserDefinedShiftDefinitions updateItem(@RequestBody UserDefinedShiftDefinitions ud, @PathVariable("sId") String sId) throws NumberFormatException, ParseException {
		return this.userdataService.updateItem(ud,Long.parseLong(sId));
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/shiftdefinitionexclude/{sId}")
	public UserDefinedShiftDefinitions updateshiftIncludeExclude(@RequestBody UserDefinedShiftDefinitions ud, @PathVariable("sId") String sId) throws NumberFormatException, ParseException {
		return this.userdataService.updateItem(ud,Long.parseLong(sId));
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/shiftdefinition/{sId}") //shiftdefinition instead of userdata
	public void deleteoneItem(@PathVariable("sId") String sId) {
		userdataService.deleteItem(Long.parseLong(sId));
	}
	
	@Autowired
	private UserdataDao shiftdef;
	
	@GetMapping("/shiftdefinitionbyuserid/{val}")
	public List<Object> getShiftByUserId(@PathVariable Long val)
	{
		return this.shiftdef.getshiftbyuserId(val);
	}
	
	@GetMapping("/shiftdefbyuserid/{sId}")
	public List<Object> getShiftByUserIds(@PathVariable Long sId)
	{
		return this.shiftdef.getshiftbyIds(sId);
	}
	
	@GetMapping("/shiftdefbyuseridandstatus/{userId}/{status}")
	public List<Object> getShiftByUserIdAndStatus(@PathVariable Long userId,@PathVariable String status)
	{
		return this.shiftdef.getshiftbyuserIdandActiveStatus(userId,status);
	}
	
	@GetMapping("/shiftdefbyaliasname/{sId}")
	public List<Object> getShiftByAliasName(@PathVariable Long sId)
	{
		return this.shiftdef.getshiftaliasname(sId);
	}

}
