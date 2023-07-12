package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="bidschedule_employeedetails_map")
public class BidScheduleMapEmployeeDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bid_and_employee_map_id")
	private long bidemployeemapid;
	
	@Column(name = "bid_schedule_id_ref")
	private Long bidschref;
	
	@Column(name = "emp_id_ref")
	private Long empidref;
	
	@Column(name = "employee_bid_status")
	private String employeebidstatus;

	public long getBidemployeemapid() {
		return bidemployeemapid;
	}

	public void setBidemployeemapid(long bidemployeemapid) {
		this.bidemployeemapid = bidemployeemapid;
	}

	public Long getBidschref() {
		return bidschref;
	}

	public void setBidschref(Long bidschref) {
		this.bidschref = bidschref;
	}

	public Long getEmpidref() {
		return empidref;
	}

	public void setEmpidref(Long empidref) {
		this.empidref = empidref;
	}

	public String getEmployeebidstatus() {
		return employeebidstatus;
	}

	public void setEmployeebidstatus(String employeebidstatus) {
		this.employeebidstatus = employeebidstatus;
	}

}
