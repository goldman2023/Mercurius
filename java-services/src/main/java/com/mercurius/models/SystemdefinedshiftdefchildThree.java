package com.mercurius.models;

import java.util.Date;

public class SystemdefinedshiftdefchildThree {
	
	private long id;
	
	private String shiftName;
	
	private Integer shiftCategory;
	
	private Integer shiftDuration;
	
	//@JsonFormat(pattern = "hh:mm:ss")
	private Date startTime;  
	
	private char shiftIncludeExclude;
	
	private String shiftCategoryName;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public Integer getShiftDuration() {
		return shiftDuration;
	}

	public void setShiftDuration(Integer shiftDuration) {
		this.shiftDuration = shiftDuration;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public char getShiftIncludeExclude() {
		return shiftIncludeExclude;
	}

	public void setShiftIncludeExclude(char shiftIncludeExclude) {
		this.shiftIncludeExclude = shiftIncludeExclude;
	}

	public String getShiftCategoryName() {
		return shiftCategoryName;
	}

	public void setShiftCategoryName(String shiftCategoryName) {
		this.shiftCategoryName = shiftCategoryName;
	}

	public SystemdefinedshiftdefchildThree(long id, String shiftName, Integer shiftCategory, Integer shiftDuration,
			Date startTime, char shiftIncludeExclude, String shiftCategoryName) {
		super();
		this.id = id;
		this.shiftName = shiftName;
		this.shiftCategory = shiftCategory;
		this.shiftDuration = shiftDuration;
		this.startTime = startTime;
		this.shiftIncludeExclude = shiftIncludeExclude;
		this.shiftCategoryName = shiftCategoryName;
	}

	
	}