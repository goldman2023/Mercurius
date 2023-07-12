package com.mercurius.models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "other_leave_requests")
public class OtherLeaveRequests {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "leave_request_id")
	private long leaveId;
	
	@Column(name = "bid_schedule_id_ref")
	private Long bidschIdRef;
	
	@Column(name = "manager_id_ref")
	private Long managerIdRef;
	
	@Column(name = "emp_id_ref")
	private Long empIdRef;
	
	@Column(name = "employee_operating_initials")
	private String empInitials;
	
	@Column(name = "leave_type")
	private String leaveType;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "leave_start_date")
	private Date leaveStartDate;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "leave_end_date")
	private Date leaveEndDate;
	
	@Column(name = "leave_hours")
	@JsonFormat(pattern = "hh:mm:ss")
	private Date leaveHours;

	public OtherLeaveRequests() {
		super();
	}

	public long getLeaveId() {
		return leaveId;
	}

	public void setLeaveId(long leaveId) {
		this.leaveId = leaveId;
	}

	public Long getBidschIdRef() {
		return bidschIdRef;
	}

	public void setBidschIdRef(Long bidschIdRef) {
		this.bidschIdRef = bidschIdRef;
	}

	public Long getManagerIdRef() {
		return managerIdRef;
	}

	public void setManagerIdRef(Long managerIdRef) {
		this.managerIdRef = managerIdRef;
	}

	public Long getEmpIdRef() {
		return empIdRef;
	}

	public void setEmpIdRef(Long empIdRef) {
		this.empIdRef = empIdRef;
	}

	public String getEmpInitials() {
		return empInitials;
	}

	public void setEmpInitials(String empInitials) {
		this.empInitials = empInitials;
	}

	public String getLeaveType() {
		return leaveType;
	}

	public void setLeaveType(String leaveType) {
		this.leaveType = leaveType;
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

	public Date getLeaveHours() {
		return leaveHours;
	}

	public void setLeaveHours(Date leaveHours) {
		this.leaveHours = leaveHours;
	}

	public OtherLeaveRequests(long leaveId, Long bidschIdRef, Long managerIdRef, Long empIdRef, String empInitials,
			String leaveType, Date leaveStartDate, Date leaveEndDate, Date leaveHours) {
		super();
		this.leaveId = leaveId;
		this.bidschIdRef = bidschIdRef;
		this.managerIdRef = managerIdRef;
		this.empIdRef = empIdRef;
		this.empInitials = empInitials;
		this.leaveType = leaveType;
		this.leaveStartDate = leaveStartDate;
		this.leaveEndDate = leaveEndDate;
		this.leaveHours = leaveHours;
	}

	@Override
	public String toString() {
		return "OtherLeaveRequests [leaveId=" + leaveId + ", bidschIdRef=" + bidschIdRef + ", managerIdRef="
				+ managerIdRef + ", empIdRef=" + empIdRef + ", empInitials=" + empInitials + ", leaveType=" + leaveType
				+ ", leaveStartDate=" + leaveStartDate + ", leaveEndDate=" + leaveEndDate + ", leaveHours=" + leaveHours
				+ "]";
	}

}
