package com.mercurius.models;

import java.sql.Time;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class LeaveRequestChild {

	private Long requestId;
	private String requestType;
	private String requestPurpose;
	private Boolean fmlaStatus;
	private String fmlaPurpose;
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date leaveStartDate;
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date leaveEndDate;
	private Time leaveStartTime;  
	private Time leaveEndTime;
	private Long empId;//requestSubmittedBy
	private String empFname;
	private String empLname;
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date requestSubmittedDate;
	private Long bidManagerId;//requestSubmittedTo
	private String managerFname;
	private String managerLname;
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date shiftChangeFromDate;
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date shiftChangeToDate;
	private Time shiftTimeChangeFrom;
	private Time shiftTimeChangeTo;
	private String remarks;
	private String status;
	private int shiftDuration;
	private String denialReason;
	
	public LeaveRequestChild() {
		super();
	}
	
	public Long getRequestId() {
		return requestId;
	}
	public void setRequestId(Long requestId) {
		this.requestId = requestId;
	}
	public String getRequestType() {
		return requestType;
	}
	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}
	public String getRequestPurpose() {
		return requestPurpose;
	}
	public void setRequestPurpose(String requestPurpose) {
		this.requestPurpose = requestPurpose;
	}
	public Boolean getFmlaStatus() {
		return fmlaStatus;
	}
	public void setFmlaStatus(Boolean fmlaStatus) {
		this.fmlaStatus = fmlaStatus;
	}
	public String getFmlaPurpose() {
		return fmlaPurpose;
	}
	public void setFmlaPurpose(String fmlaPurpose) {
		this.fmlaPurpose = fmlaPurpose;
	}
	public Date getLeaveStartDate() {
		return leaveStartDate;
	}
	public void setLeaveStartDate(Date leaveStartDate) {
		this.leaveStartDate = leaveStartDate;
	}
	public Date getLeaveEndDate() {
		return leaveEndDate;
	}
	public void setLeaveEndDate(Date leaveEndDate) {
		this.leaveEndDate = leaveEndDate;
	}
	public Time getLeaveStartTime() {
		return leaveStartTime;
	}
	public void setLeaveStartTime(Time leaveStartTime) {
		this.leaveStartTime = leaveStartTime;
	}
	public Time getLeaveEndTime() {
		return leaveEndTime;
	}
	public void setLeaveEndTime(Time leaveEndTime) {
		this.leaveEndTime = leaveEndTime;
	}
	public Long getEmpId() {
		return empId;
	}
	public void setEmpId(Long empId) {
		this.empId = empId;
	}
	public String getEmpFname() {
		return empFname;
	}
	public void setEmpFname(String empFname) {
		this.empFname = empFname;
	}
	public String getEmpLname() {
		return empLname;
	}
	public void setEmpLname(String empLname) {
		this.empLname = empLname;
	}
	public Date getRequestSubmittedDate() {
		return requestSubmittedDate;
	}
	public void setRequestSubmittedDate(Date requestSubmittedDate) {
		this.requestSubmittedDate = requestSubmittedDate;
	}
	public Long getBidManagerId() {
		return bidManagerId;
	}
	public void setBidManagerId(Long bidManagerId) {
		this.bidManagerId = bidManagerId;
	}
	public String getManagerFname() {
		return managerFname;
	}
	public void setManagerFname(String managerFname) {
		this.managerFname = managerFname;
	}
	public String getManagerLname() {
		return managerLname;
	}
	public void setManagerLname(String managerLname) {
		this.managerLname = managerLname;
	}
	public Date getShiftChangeFromDate() {
		return shiftChangeFromDate;
	}
	public void setShiftChangeFromDate(Date shiftChangeFromDate) {
		this.shiftChangeFromDate = shiftChangeFromDate;
	}
	public Date getShiftChangeToDate() {
		return shiftChangeToDate;
	}
	public void setShiftChangeToDate(Date shiftChangeToDate) {
		this.shiftChangeToDate = shiftChangeToDate;
	}
	
	public Time getShiftTimeChangeFrom() {
		return shiftTimeChangeFrom;
	}

	public void setShiftTimeChangeFrom(Time shiftTimeChangeFrom) {
		this.shiftTimeChangeFrom = shiftTimeChangeFrom;
	}

	public Time getShiftTimeChangeTo() {
		return shiftTimeChangeTo;
	}

	public void setShiftTimeChangeTo(Time shiftTimeChangeTo) {
		this.shiftTimeChangeTo = shiftTimeChangeTo;
	}

	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getShiftDuration() {
		return shiftDuration;
	}
	public void setShiftDuration(int shiftDuration) {
		this.shiftDuration = shiftDuration;
	}
	public String getDenialReason() {
		return denialReason;
	}
	public void setDenialReason(String denialReason) {
		this.denialReason = denialReason;
	}

	public LeaveRequestChild(Long requestId, String requestType, String requestPurpose, Boolean fmlaStatus,
			String fmlaPurpose, Date leaveStartDate, Date leaveEndDate, Time leaveStartTime, Time leaveEndTime,
			Long empId, String empFname, String empLname, Date requestSubmittedDate, Long bidManagerId,
			String managerFname, String managerLname, Date shiftChangeFromDate, Date shiftChangeToDate,
			Time shiftTimeChangeFrom, Time shiftTimeChangeTo, String remarks, String status, int shiftDuration,
			String denialReason) {
		super();
		this.requestId = requestId;
		this.requestType = requestType;
		this.requestPurpose = requestPurpose;
		this.fmlaStatus = fmlaStatus;
		this.fmlaPurpose = fmlaPurpose;
		this.leaveStartDate = leaveStartDate;
		this.leaveEndDate = leaveEndDate;
		this.leaveStartTime = leaveStartTime;
		this.leaveEndTime = leaveEndTime;
		this.empId = empId;
		this.empFname = empFname;
		this.empLname = empLname;
		this.requestSubmittedDate = requestSubmittedDate;
		this.bidManagerId = bidManagerId;
		this.managerFname = managerFname;
		this.managerLname = managerLname;
		this.shiftChangeFromDate = shiftChangeFromDate;
		this.shiftChangeToDate = shiftChangeToDate;
		this.shiftTimeChangeFrom = shiftTimeChangeFrom;
		this.shiftTimeChangeTo = shiftTimeChangeTo;
		this.remarks = remarks;
		this.status = status;
		this.shiftDuration = shiftDuration;
		this.denialReason = denialReason;
	}
	
}
