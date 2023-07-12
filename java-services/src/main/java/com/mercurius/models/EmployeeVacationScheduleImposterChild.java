package com.mercurius.models;

import java.util.Date;

public class EmployeeVacationScheduleImposterChild {
	
	private Long empIdRef;
	
	private String empFirstName;
	
	private String empLastName;
	
	private String empInitials;

	private String vacationStartDate;
	
	private String vacationEndDate;

	private int vacationHours;

	public Long getEmpIdRef() {
		return empIdRef;
	}

	public void setEmpIdRef(Long empIdRef) {
		this.empIdRef = empIdRef;
	}

	public String getEmpFirstName() {
		return empFirstName;
	}

	public void setEmpFirstName(String empFirstName) {
		this.empFirstName = empFirstName;
	}

	public String getEmpLastName() {
		return empLastName;
	}

	public void setEmpLastName(String empLastName) {
		this.empLastName = empLastName;
	}

	public String getEmpInitials() {
		return empInitials;
	}

	public void setEmpInitials(String empInitials) {
		this.empInitials = empInitials;
	}

	public String getVacationStartDate() {
		return vacationStartDate;
	}

	public void setVacationStartDate(String vacationStartDate) {
		this.vacationStartDate = vacationStartDate;
	}

	public String getVacationEndDate() {
		return vacationEndDate;
	}

	public void setVacationEndDate(String vacationEndDate) {
		this.vacationEndDate = vacationEndDate;
	}

	public int getVacationHours() {
		return vacationHours;
	}

	public void setVacationHours(int vacationHours) {
		this.vacationHours = vacationHours;
	}


}
