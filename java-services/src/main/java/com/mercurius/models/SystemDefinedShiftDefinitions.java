package com.mercurius.models;

import java.sql.Time;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "system_defined_shift_definitions")

public class SystemDefinedShiftDefinitions {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "shift_definition_id")
	private long id;
	
	@Column(name = "shift_def_start_time")
	@JsonFormat(pattern = "hh:mm:ss")
	private Time startTime;  
	
	@Column(name = "sunday") 
	private String sun;
	
	@Column(name = "monday") 
	private String mon;
		
	@Column(name = "tuesday") 
	private String tue;
		  
	@Column(name = "wednesday") 
	private String wed;
		  
	@Column(name = "thursday") 
	private String thu;
		  
	@Column(name = "friday") 
	private String fri;
		  
	@Column(name = "saturday") 
	private String sat;
		  
	@Column(name = "shift_def_name")
	private String shiftName;
		
	@Column(name = "shift_def_category_id")
	private Integer shiftCategory;
	 	
	@Column(name = "shift_def_duration")
	private Integer shift_duration;
		
	@Column(name = "shift_def_created_by")
	private String shift_created_by;
		
	@Column(name = "shift_def_include_exclude")
	private char sh_include_exclude;
	
	@Column(name = "shift_category_name")
	private String shift_category_name;
	
	public SystemDefinedShiftDefinitions() {
	}

	public SystemDefinedShiftDefinitions(long id, Time startTime, String sun, String mon, String tue, String wed,
			String thu, String fri, String sat, String shiftName, Integer shiftCategory, Integer shift_duration,
			String shift_created_by, char sh_include_exclude, String shift_category_name) {
		super();
		this.id = id;
		this.startTime = startTime;
		this.sun = sun;
		this.mon = mon;
		this.tue = tue;
		this.wed = wed;
		this.thu = thu;
		this.fri = fri;
		this.sat = sat;
		this.shiftName = shiftName;
		this.shiftCategory = shiftCategory;
		this.shift_duration = shift_duration;
		this.shift_created_by = shift_created_by;
		this.sh_include_exclude = sh_include_exclude;
		this.shift_category_name = shift_category_name;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Time getStartTime() {
		return startTime;
	}

	public void setStartTime(Time startTime) {
		this.startTime = startTime;
	}

	public String getSun() {
		return sun;
	}

	public void setSun(String sun) {
		this.sun = sun;
	}

	public String getMon() {
		return mon;
	}

	public void setMon(String mon) {
		this.mon = mon;
	}

	public String getTue() {
		return tue;
	}

	public void setTue(String tue) {
		this.tue = tue;
	}

	public String getWed() {
		return wed;
	}

	public void setWed(String wed) {
		this.wed = wed;
	}

	public String getThu() {
		return thu;
	}

	public void setThu(String thu) {
		this.thu = thu;
	}

	public String getFri() {
		return fri;
	}

	public void setFri(String fri) {
		this.fri = fri;
	}

	public String getSat() {
		return sat;
	}

	public void setSat(String sat) {
		this.sat = sat;
	}

	public String getShiftName() {
		return shiftName;
	}

	public void setShiftName(String shiftName) {
		this.shiftName = shiftName;
	}

	public Integer getshiftCategory() {
		return shiftCategory;
	}

	public void setshiftCategory(Integer shiftCategory) {
		this.shiftCategory = shiftCategory;
	}

	public Integer getshift_duration() {
		return shift_duration;
	}

	public void setshift_duration(Integer shift_duration) {
		this.shift_duration = shift_duration;
	}

	public String getshift_created_by() {
		return shift_created_by;
	}

	public void setshift_created_by(String shift_created_by) {
		this.shift_created_by = shift_created_by;
	}

	public char getsh_include_exclude() {
		return sh_include_exclude;
	}

	public void setsh_include_exclude(char sh_include_exclude) {
		this.sh_include_exclude = sh_include_exclude;
	}
	
	public String getShift_category_name() {
		return shift_category_name;
	}

	public void setShift_category_name(String shift_category_name) {
		this.shift_category_name = shift_category_name;
	}

	@Override
	public String toString() {
		return "SystemDefinedShiftDefinitions [id=" + id + ", startTime=" + startTime + ", sun=" + sun + ", mon=" + mon
				+ ", tue=" + tue + ", wed=" + wed + ", thu=" + thu + ", fri=" + fri + ", sat=" + sat + ", shiftName="
				+ shiftName + ", shiftCategory=" + shiftCategory + ", shift_duration=" + shift_duration
				+ ", shift_created_by=" + shift_created_by + ", sh_include_exclude=" + sh_include_exclude
				+ ", shift_category_name=" + shift_category_name + "]";
	}

}
