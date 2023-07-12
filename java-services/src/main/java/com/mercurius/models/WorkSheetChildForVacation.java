package com.mercurius.models;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class WorkSheetChildForVacation {
	
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date vacationStartDate;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date vacationEndDate;

	private int vacationHours;

	public WorkSheetChildForVacation() {
		super();
		// TODO Auto-generated constructor stub
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

	public WorkSheetChildForVacation(Date vacationStartDate, Date vacationEndDate, int vacationHours) {
		super();
		this.vacationStartDate = vacationStartDate;
		this.vacationEndDate = vacationEndDate;
		this.vacationHours = vacationHours;
	}

	@Override
	public String toString() {
		return "WorkSheetChildForVacation [vacationStartDate=" + vacationStartDate + ", vacationEndDate="
				+ vacationEndDate + ", vacationHours=" + vacationHours + "]";
	}
	
	
}
