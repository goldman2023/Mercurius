package com.mercurius.controllers;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.AddEmployee;
import com.mercurius.models.EmployeeQualification;
import com.mercurius.models.LeaveRequest;
import com.mercurius.models.LeaveRequestChild;
import com.mercurius.repository.AddBidManagerDao;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.LeaveRequestDao;
import com.mercurius.security.services.LeaveRequestService;
import com.mercurius.security.services.NotificationToSubmitLeaveRequestService;
import com.mercurius.security.services.NotificationToUpdateLeaveRequestService;

@RestController
public class LeaveRequestController {
	
	@Autowired
	private LeaveRequestService leaveService;
	
	@Autowired
	private LeaveRequestDao leaveDao;
	
	@Autowired
	private AddBidManagerDao bidmanagerDao;
	
	@Autowired
	private AddEmployeeDao employeeDao;
	
	@Autowired
	private NotificationToSubmitLeaveRequestService requestService;
	
	@Autowired
	private NotificationToUpdateLeaveRequestService updateService;
	
	List<LeaveRequestChild> leavereqchild = new ArrayList<LeaveRequestChild>();
	
	@RequestMapping(method = RequestMethod.GET, path = "/leaverequest/{requestId}")
	public Optional<LeaveRequest> getLeaveRequestBasedOnId(@PathVariable("requestId") long requestid) 
	{
		return this.leaveService.getbyId(requestid);
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/leaverequestfromempid/{empId}")
	public List<LeaveRequestChild> getLeaveRequestBasedOnEmpId(@PathVariable("empId") long empId) 
	{
		 leavereqchild.clear();
		 List<LeaveRequest> requestData = leaveDao.getLeaveRequestByEmpId(empId);
		 for(int i=0;i<requestData.size();i++)
		 {
			 LeaveRequestChild childData = new LeaveRequestChild();
			 
			 childData.setRequestId(requestData.get(i).getRequestId());
			 childData.setBidManagerId(requestData.get(i).getBidManagerId());
			 childData.setManagerFname(bidmanagerDao.findById(requestData.get(i).getBidManagerId()).get().getFname());
			 childData.setManagerLname(bidmanagerDao.findById(requestData.get(i).getBidManagerId()).get().getLname());
			 childData.setEmpId(requestData.get(i).getEmpId());
			 childData.setEmpFname(employeeDao.findById(requestData.get(i).getEmpId()).get().getFname());
			 childData.setEmpLname(employeeDao.findById(requestData.get(i).getEmpId()).get().getLname());
			 childData.setRequestType(requestData.get(i).getRequestType());
			 childData.setRequestPurpose(requestData.get(i).getRequestPurpose());
			 childData.setFmlaStatus(requestData.get(i).getFmlaStatus());
			 childData.setFmlaPurpose(requestData.get(i).getFmlaPurpose());
			 childData.setLeaveStartDate(requestData.get(i).getLeaveStartDate());
			 childData.setLeaveEndDate(requestData.get(i).getLeaveEndDate());
			 childData.setLeaveStartTime(requestData.get(i).getLeaveStartTime());
			 childData.setLeaveEndTime(requestData.get(i).getLeaveEndTime());
			 childData.setShiftChangeFromDate(requestData.get(i).getShiftChangeFromDate());
			 childData.setShiftChangeToDate(requestData.get(i).getShiftChangeToDate());
			 childData.setShiftTimeChangeFrom(requestData.get(i).getShiftTimeChangeFrom());
			 childData.setShiftTimeChangeTo(requestData.get(i).getShiftTimeChangeTo());
			 childData.setShiftDuration( requestData.get(i).getShiftDuration());
			 childData.setRequestSubmittedDate(requestData.get(i).getRequestSubmittedDate());
			 childData.setRemarks(requestData.get(i).getRemarks());
			 childData.setDenialReason(requestData.get(i).getDenialReason());
			 childData.setStatus(requestData.get(i).getStatus()); 
			 leavereqchild.add(childData);
		 }
		return leavereqchild;
	}
	
	@RequestMapping(method = RequestMethod.POST, path = "/leaverequestsave") 
	public LeaveRequest saveLeaveRequest(@RequestBody LeaveRequest rdata) throws UnsupportedEncodingException, MessagingException, ParseException
	{
		LeaveRequest reqData = leaveDao.save(rdata);
		requestService.sendEmailToSumbitLeaveRequest(reqData.getRequestId());
		return reqData;
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/leaverequesttobidmanagerid/{mId}")
	public List<LeaveRequestChild> getLeaveRequestBasedOnBidManagerId(@PathVariable("mId") long mId) 
	{
		 leavereqchild.clear();
		 List<LeaveRequest> requestData = leaveDao.getLeaveRequestByBidManagerId(mId);
		
		 for(int i=0;i<requestData.size();i++)
		 {
			 LeaveRequestChild childData = new LeaveRequestChild();
			 
			 childData.setRequestId(requestData.get(i).getRequestId());
			 childData.setBidManagerId(requestData.get(i).getBidManagerId());
			 childData.setManagerFname(bidmanagerDao.findById(requestData.get(i).getBidManagerId()).get().getFname());
			 childData.setManagerLname(bidmanagerDao.findById(requestData.get(i).getBidManagerId()).get().getLname());
			 childData.setEmpId(requestData.get(i).getEmpId());
			 childData.setEmpFname(employeeDao.findById(requestData.get(i).getEmpId()).get().getFname());
			 childData.setEmpLname(employeeDao.findById(requestData.get(i).getEmpId()).get().getLname());
			 childData.setRequestType(requestData.get(i).getRequestType());
			 childData.setRequestPurpose(requestData.get(i).getRequestPurpose());
			 childData.setFmlaStatus(requestData.get(i).getFmlaStatus());
			 childData.setFmlaPurpose(requestData.get(i).getFmlaPurpose());
			 childData.setLeaveStartDate(requestData.get(i).getLeaveStartDate());
			 childData.setLeaveEndDate(requestData.get(i).getLeaveEndDate());
			 childData.setLeaveStartTime(requestData.get(i).getLeaveStartTime());
			 childData.setLeaveEndTime(requestData.get(i).getLeaveEndTime());
			 childData.setShiftChangeFromDate(requestData.get(i).getShiftChangeFromDate());
			 childData.setShiftChangeToDate(requestData.get(i).getShiftChangeToDate());
			 childData.setShiftTimeChangeFrom(requestData.get(i).getShiftTimeChangeFrom());
			 childData.setShiftTimeChangeTo(requestData.get(i).getShiftTimeChangeTo());
			 childData.setShiftDuration( requestData.get(i).getShiftDuration());
			 childData.setRequestSubmittedDate(requestData.get(i).getRequestSubmittedDate());
			 childData.setRemarks(requestData.get(i).getRemarks());
			 childData.setDenialReason(requestData.get(i).getDenialReason());
			 childData.setStatus(requestData.get(i).getStatus()); 
			 leavereqchild.add(childData);
		 }
		return leavereqchild;
	}
	
	
	@RequestMapping(method = RequestMethod.PUT, value = "/leaverequestupdate/{requestId}")
	public LeaveRequest updateLeaveRequest(@RequestBody LeaveRequest rdata, @PathVariable("requestId") Long requestId) throws ParseException, UnsupportedEncodingException, MessagingException 
	{
		LeaveRequest reqData = leaveDao.save(rdata);
		updateService.sendEmailToUpdateLeaveRequest(reqData.getRequestId());
		return reqData;	
	}
	

}
