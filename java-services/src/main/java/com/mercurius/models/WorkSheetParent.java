package com.mercurius.models;

import java.util.ArrayList;
import java.util.List;

public class WorkSheetParent {
	
	private Long bidscheduleid;
	
	private Long managerid;
	
	private Long empid;
	
	private String empFirstName;
	
	private String empLastName;
	
	private String empinitials;

	private int areaid;
	
	private int year;
	
	private List<WorkSheetChildForShift> shiftInfo = new ArrayList<>();
	
	private List<WorkSheetChildForVacation> vacationInfo = new ArrayList<>();

	public WorkSheetParent() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getBidscheduleid() {
		return bidscheduleid;
	}

	public void setBidscheduleid(Long bidscheduleid) {
		this.bidscheduleid = bidscheduleid;
	}

	public Long getManagerid() {
		return managerid;
	}

	public void setManagerid(Long managerid) {
		this.managerid = managerid;
	}

	public Long getEmpid() {
		return empid;
	}

	public void setEmpid(Long empid) {
		this.empid = empid;
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

	public String getEmpinitials() {
		return empinitials;
	}

	public void setEmpinitials(String empinitials) {
		this.empinitials = empinitials;
	}

	public int getAreaid() {
		return areaid;
	}

	public void setAreaid(int areaid) {
		this.areaid = areaid;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public List<WorkSheetChildForShift> getShiftInfo() {
		return shiftInfo;
	}

	public void setShiftInfo(List<WorkSheetChildForShift> shiftInfo) {
		this.shiftInfo = shiftInfo;
	}

	public List<WorkSheetChildForVacation> getVacationInfo() {
		return vacationInfo;
	}

	public void setVacationInfo(List<WorkSheetChildForVacation> vacationInfo) {
		this.vacationInfo = vacationInfo;
	}

	public WorkSheetParent(Long bidscheduleid, Long managerid, Long empid, String empFirstName, String empLastName,
			String empinitials, int areaid, int year, List<WorkSheetChildForShift> shiftInfo,
			List<WorkSheetChildForVacation> vacationInfo) {
		super();
		this.bidscheduleid = bidscheduleid;
		this.managerid = managerid;
		this.empid = empid;
		this.empFirstName = empFirstName;
		this.empLastName = empLastName;
		this.empinitials = empinitials;
		this.areaid = areaid;
		this.year = year;
		this.shiftInfo = shiftInfo;
		this.vacationInfo = vacationInfo;
	}

	@Override
	public String toString() {
		return "WorkSheetParent [bidscheduleid=" + bidscheduleid + ", managerid=" + managerid + ", empid=" + empid
				+ ", empFirstName=" + empFirstName + ", empLastName=" + empLastName + ", empinitials=" + empinitials
				+ ", areaid=" + areaid + ", year=" + year + ", shiftInfo=" + shiftInfo + ", vacationInfo="
				+ vacationInfo + "]";
	}


}
