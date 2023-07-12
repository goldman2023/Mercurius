package com.mercurius.models;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;

import com.fasterxml.jackson.annotation.JsonFormat;

public class SystemdefinedshiftdefchildOne {
	
	private long sh_def_id;
	
	private Time startTime;  
	
	private String shiftName;
		
	private Integer shiftCategory;
	 
	private Integer shift_duration;
		
	private String shift_created_by;
	
	private char sh_include_exclude;
	
	private String shiftcategory_name;
	
	private List<SystemdefinedshiftdefchildTwo> week = new ArrayList<>();

	public long getSh_def_id() {
		return sh_def_id;
	}

	public void setSh_def_id(long sh_def_id) {
		this.sh_def_id = sh_def_id;
	}

	public Time getStartTime() {
		return startTime;
	}

	public void setStartTime(Time startTime) {
		this.startTime = startTime;
	}

	public String getShiftName() {
		return shiftName;
	}

	public void setShiftName(String shiftName) {
		this.shiftName = shiftName;
	}

	public Integer getShiftCategory() {
		return shiftCategory;
	}

	public void setShiftCategory(Integer shiftCategory) {
		this.shiftCategory = shiftCategory;
	}

	public Integer getShift_duration() {
		return shift_duration;
	}

	public void setShift_duration(Integer shift_duration) {
		this.shift_duration = shift_duration;
	}

	public String getShift_created_by() {
		return shift_created_by;
	}

	public void setShift_created_by(String shift_created_by) {
		this.shift_created_by = shift_created_by;
	}

	public char getSh_include_exclude() {
		return sh_include_exclude;
	}

	public void setSh_include_exclude(char sh_include_exclude) {
		this.sh_include_exclude = sh_include_exclude;
	}

	public String getShiftcategory_name() {
		return shiftcategory_name;
	}

	public void setShiftcategory_name(String shiftcategory_name) {
		this.shiftcategory_name = shiftcategory_name;
	}

	public List<SystemdefinedshiftdefchildTwo> getWeek() {
		return week;
	}

	public void setWeek(List<SystemdefinedshiftdefchildTwo> week) {
		this.week = week;
	}

	public SystemdefinedshiftdefchildOne() {
		super();
		// TODO Auto-generated constructor stub
	}
	 
	 

}
