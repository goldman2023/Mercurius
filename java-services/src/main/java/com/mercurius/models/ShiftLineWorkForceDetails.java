package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "shift_line_work_force") 
public class ShiftLineWorkForceDetails {
	  
	  @Id 
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  @Column(name = "work_id") 
	  private Long workId;
	  
	  @Column(name = "shift_line_schedule_id_ref") 
	  private Long shiftLineScheduleIdRef;
	  
	  @Column(name = "shift_time") 
	  private int shiftTime;
		
	  @Column(name = "shift_name") 
	  private String shiftName;
	  
	  @Column(name = "shift_day") 
	  private String shiftDay;
	  
	  @Column(name = "shift_duration") 
	  private int shiftDuration;
	  
	  @Column(name = "bid_manager_id_ref") 
	  private long managerIdRef;
	  
	  @Column(name = "shift_emp_count") 
	  private int countOfEmp;
	  
	  @Column(name = "system_defined_shift_def_id_ref") 
	  private long systemShiftIdRef;
	  
	  @Column(name = "user_defined_shift_def_id_ref") 
	  private long userShiftIdRef;
	  
	  @Column(name = "shift_category_name")
	  private String shiftCategoryNameRef;

	  public ShiftLineWorkForceDetails() {
		super();
	  }

	public Long getWorkId() {
		return workId;
	}

	public void setWorkId(Long workId) {
		this.workId = workId;
	}

	public Long getShiftLineScheduleIdRef() {
		return shiftLineScheduleIdRef;
	}

	public void setShiftLineScheduleIdRef(Long shiftLineScheduleIdRef) {
		this.shiftLineScheduleIdRef = shiftLineScheduleIdRef;
	}

	public int getShiftTime() {
		return shiftTime;
	}

	public void setShiftTime(int shiftTime) {
		this.shiftTime = shiftTime;
	}

	public String getShiftName() {
		return shiftName;
	}

	public void setShiftName(String shiftName) {
		this.shiftName = shiftName;
	}

	public String getShiftDay() {
		return shiftDay;
	}

	public void setShiftDay(String shiftDay) {
		this.shiftDay = shiftDay;
	}

	public int getShiftDuration() {
		return shiftDuration;
	}

	public void setShiftDuration(int shiftDuration) {
		this.shiftDuration = shiftDuration;
	}

	public long getManagerIdRef() {
		return managerIdRef;
	}

	public void setManagerIdRef(long managerIdRef) {
		this.managerIdRef = managerIdRef;
	}

	public long getSystemShiftIdRef() {
		return systemShiftIdRef;
	}

	public void setSystemShiftIdRef(long systemShiftIdRef) {
		this.systemShiftIdRef = systemShiftIdRef;
	}

	public long getUserShiftIdRef() {
		return userShiftIdRef;
	}

	public void setUserShiftIdRef(long userShiftIdRef) {
		this.userShiftIdRef = userShiftIdRef;
	}

	public int getCountOfEmp() {
		return countOfEmp;
	}

	public void setCountOfEmp(int countOfEmp) {
		this.countOfEmp = countOfEmp;
	}

	public String getShiftCategoryNameRef() {
		return shiftCategoryNameRef;
	}

	public void setShiftCategoryNameRef(String shiftCategoryNameRef) {
		this.shiftCategoryNameRef = shiftCategoryNameRef;
	}
	
	public ShiftLineWorkForceDetails(Long workId, Long shiftLineScheduleIdRef, int shiftTime, String shiftName,
			String shiftDay, int shiftDuration, long managerIdRef, int countOfEmp, long systemShiftIdRef,
			long userShiftIdRef, String shiftCategoryNameRef) {
		super();
		this.workId = workId;
		this.shiftLineScheduleIdRef = shiftLineScheduleIdRef;
		this.shiftTime = shiftTime;
		this.shiftName = shiftName;
		this.shiftDay = shiftDay;
		this.shiftDuration = shiftDuration;
		this.managerIdRef = managerIdRef;
		this.countOfEmp = countOfEmp;
		this.systemShiftIdRef = systemShiftIdRef;
		this.userShiftIdRef = userShiftIdRef;
		this.shiftCategoryNameRef = shiftCategoryNameRef;
	}

	@Override
	public String toString() {
		return "ShiftLineWorkForceDetails [workId=" + workId + ", shiftLineScheduleIdRef=" + shiftLineScheduleIdRef
				+ ", shiftTime=" + shiftTime + ", shiftName=" + shiftName + ", shiftDay=" + shiftDay
				+ ", shiftDuration=" + shiftDuration + ", managerIdRef=" + managerIdRef + ", countOfEmp=" + countOfEmp
				+ ", systemShiftIdRef=" + systemShiftIdRef + ", userShiftIdRef=" + userShiftIdRef
				+ ", shiftCategoryNameRef=" + shiftCategoryNameRef + "]";
	}


}
