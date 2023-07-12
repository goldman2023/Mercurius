package com.mercurius.models;

import java.sql.Time;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "employee_requests")
public class LeaveRequest {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "request_id")
	private Long requestId;
	
	@Column(name = "bid_schedule_id_ref")
	private Long bidschIdRef=0L;
	
	@Column(name = "request_type")
	private String requestType;
	
	@Column(name = "request_purpose")
	private String requestPurpose;
	
	@Column(name = "fmla_selection_status",columnDefinition = "integer default 0")
	private Boolean fmlaStatus;
	
	@Column(name = "fmla_purpose")
	private String fmlaPurpose;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "leave_start_date")
	private Date leaveStartDate;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "leave_end_date")
	private Date leaveEndDate;
	
	@Column(name = "leave_start_time")
	@JsonFormat(pattern = "hh:mm:ss a")
	private Time leaveStartTime;  
	
	@Column(name = "leave_end_time")
	@JsonFormat(pattern = "hh:mm:ss a")
	private Time leaveEndTime;
	
	@Column(name = "request_submitted_by")
	private Long empId;//requestSubmittedBy
	
	@Column(name = "request_submitted_date")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date requestSubmittedDate;
	
	@Column(name = "request_submitted_to")
	private Long bidManagerId;//requestSubmittedTo
	
	@Column(name = "shiftchange_from_date")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date shiftChangeFromDate;
	
	@Column(name = "shiftchange_to_date")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date shiftChangeToDate;
	
	@Column(name = "shift_change_from")
	@JsonFormat(pattern = "hh:mm:ss a")
	private Time shiftTimeChangeFrom;
	
	@Column(name = "shift_change_to")
	@JsonFormat(pattern = "hh:mm:ss a")
	private Time shiftTimeChangeTo;
	
	@Column(name = "request_remarks")
	private String remarks;
	
	@Column(name = "request_status")
	private String status;
	
	@Column(name = "shift_duration",columnDefinition = "integer default 0")
	private int shiftDuration;
	
	@Column(name = "request_denial_reason")
	private String denialReason;
	
	@Column(name = "request_updated_by",columnDefinition = "integer default 0")
	private String requestUpdatedBy;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "request_updated_date")
	private Date requestUpdatedDate;
	
	public LeaveRequest() {
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
	
	public String getRequestUpdatedBy() {
		return requestUpdatedBy;
	}

	public void setRequestUpdatedBy(String requestUpdatedBy) {
		this.requestUpdatedBy = requestUpdatedBy;
	}

	public Date getRequestUpdatedDate() {
		return requestUpdatedDate;
	}

	public void setRequestUpdatedDate(Date requestUpdatedDate) {
		this.requestUpdatedDate = requestUpdatedDate;
	}

	public Long getBidschIdRef() {
		return bidschIdRef;
	}

	public void setBidschIdRef(Long bidschIdRef) {
		this.bidschIdRef = bidschIdRef;
	}

	public LeaveRequest(Long requestId, Long bidschIdRef, String requestType, String requestPurpose, Boolean fmlaStatus,
			String fmlaPurpose, Date leaveStartDate, Date leaveEndDate, Time leaveStartTime, Time leaveEndTime,
			Long empId, Date requestSubmittedDate, Long bidManagerId, Date shiftChangeFromDate, Date shiftChangeToDate,
			Time shiftTimeChangeFrom, Time shiftTimeChangeTo, String remarks, String status, int shiftDuration,
			String denialReason, String requestUpdatedBy, Date requestUpdatedDate) {
		super();
		this.requestId = requestId;
		this.bidschIdRef = bidschIdRef;
		this.requestType = requestType;
		this.requestPurpose = requestPurpose;
		this.fmlaStatus = fmlaStatus;
		this.fmlaPurpose = fmlaPurpose;
		this.leaveStartDate = leaveStartDate;
		this.leaveEndDate = leaveEndDate;
		this.leaveStartTime = leaveStartTime;
		this.leaveEndTime = leaveEndTime;
		this.empId = empId;
		this.requestSubmittedDate = requestSubmittedDate;
		this.bidManagerId = bidManagerId;
		this.shiftChangeFromDate = shiftChangeFromDate;
		this.shiftChangeToDate = shiftChangeToDate;
		this.shiftTimeChangeFrom = shiftTimeChangeFrom;
		this.shiftTimeChangeTo = shiftTimeChangeTo;
		this.remarks = remarks;
		this.status = status;
		this.shiftDuration = shiftDuration;
		this.denialReason = denialReason;
		this.requestUpdatedBy = requestUpdatedBy;
		this.requestUpdatedDate = requestUpdatedDate;
	}

	@Override
	public String toString() {
		return "LeaveRequest [requestId=" + requestId + ", bidschIdRef=" + bidschIdRef + ", requestType=" + requestType
				+ ", requestPurpose=" + requestPurpose + ", fmlaStatus=" + fmlaStatus + ", fmlaPurpose=" + fmlaPurpose
				+ ", leaveStartDate=" + leaveStartDate + ", leaveEndDate=" + leaveEndDate + ", leaveStartTime="
				+ leaveStartTime + ", leaveEndTime=" + leaveEndTime + ", empId=" + empId + ", requestSubmittedDate="
				+ requestSubmittedDate + ", bidManagerId=" + bidManagerId + ", shiftChangeFromDate="
				+ shiftChangeFromDate + ", shiftChangeToDate=" + shiftChangeToDate + ", shiftTimeChangeFrom="
				+ shiftTimeChangeFrom + ", shiftTimeChangeTo=" + shiftTimeChangeTo + ", remarks=" + remarks
				+ ", status=" + status + ", shiftDuration=" + shiftDuration + ", denialReason=" + denialReason
				+ ", requestUpdatedBy=" + requestUpdatedBy + ", requestUpdatedDate=" + requestUpdatedDate + "]";
	}
}
