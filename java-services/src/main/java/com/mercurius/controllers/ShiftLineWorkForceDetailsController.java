package com.mercurius.controllers;

import java.text.ParseException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.ShiftLineWorkForceDetails;
import com.mercurius.repository.ShiftLineWorkForceDetailsDao;
import com.mercurius.security.services.ShiftLineWorkForceDetailsService;

@RestController
public class ShiftLineWorkForceDetailsController {
	
	@Autowired
	private ShiftLineWorkForceDetailsService workService;
	
	@Autowired
	private ShiftLineWorkForceDetailsDao workDao;
	
	@RequestMapping(method = RequestMethod.POST, path = "/saveworkforcedetails")
	public List<ShiftLineWorkForceDetails> addManyItem(@RequestBody List<ShiftLineWorkForceDetails> uList) throws ParseException
	{
		return this.workService.addmoreItem(uList);
	}
	
	@GetMapping("/getworkforcebasedonid/{wId}")
	public ShiftLineWorkForceDetails getByWorkId(@PathVariable Long wId)
	{
		return this.workService.getbyId(wId);
	}
	
	@GetMapping("/getworkforcebasedonshiftlinescheduleid/{shId}")
	public List<ShiftLineWorkForceDetails> getbyShiftLineByScheduleId(@PathVariable Long shId)
	{
		return this.workDao.getbyShiftLineScheduleIdRef(shId);
	}

	@GetMapping("/getworkforcebasedonshiftlinescheduledayandid/{shDay}/{shId}")
	public List<ShiftLineWorkForceDetails> getbyShiftLineByScheduleIdAndDay(@PathVariable String shDay, @PathVariable Long shId)
	{
		return this.workDao.getbyShiftBasedOnDay(shDay, shId);
	}

}
