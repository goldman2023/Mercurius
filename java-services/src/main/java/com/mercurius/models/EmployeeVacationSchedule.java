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
@Table(name = "employee_bws_vacation_leave")
public class EmployeeVacationSchedule {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "vacation_bws_id")
	private long vacationId;
	
	@Column(name = "bid_schedule_id_ref")
	private Long bidschIdRef;
	
	@Column(name = "manager_id_ref")
	private Long managerIdRef;
	
	@Column(name = "emp_id_ref")
	private Long empIdRef;
	
	@Column(name = "employee_operating_initials")
	private String empInitials;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "vacation_start_date")
	private Date vacationStartDate;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "vacation_end_date")
	private Date vacationEndDate;
	
	@Column(name = "vacation_hours") 
	private int vacationHours;

	public EmployeeVacationSchedule() {
		super();
		// TODO Auto-generated constructor stub
	}

	public long getVacationId() {
		return vacationId;
	}

	public void setVacationId(long vacationId) {
		this.vacationId = vacationId;
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

	public Date getVacationStartDate() {
		return vacationStartDate;
	}

	public void setVacationStartDate(Date vacationStartDate) {
		this.vacationStartDate = vacationStartDate;
	}

	public Date getVacationEndDate() {
		return vacationEndDate;
	}

	public void setVacationEndDate(Date vacationEndDate) {
		this.vacationEndDate = vacationEndDate;
	}

	public int getVacationHours() {
		return vacationHours;
	}

	public void setVacationHours(int vacationHours) {
		this.vacationHours = vacationHours;
	}

	public EmployeeVacationSchedule(long vacationId, Long bidschIdRef, Long managerIdRef, Long empIdRef,
			String empInitials, Date vacationStartDate, Date vacationEndDate, int vacationHours) {
		super();
		this.vacationId = vacationId;
		this.bidschIdRef = bidschIdRef;
		this.managerIdRef = managerIdRef;
		this.empIdRef = empIdRef;
		this.empInitials = empInitials;
		this.vacationStartDate = vacationStartDate;
		this.vacationEndDate = vacationEndDate;
		this.vacationHours = vacationHours;
	}

	@Override
	public String toString() {
		return "EmployeeVacationSchedule [vacationId=" + vacationId + ", bidschIdRef=" + bidschIdRef + ", managerIdRef="
				+ managerIdRef + ", empIdRef=" + empIdRef + ", empInitials=" + empInitials + ", vacationStartDate="
				+ vacationStartDate + ", vacationEndDate=" + vacationEndDate + ", vacationHours=" + vacationHours + "]";
	}

}
