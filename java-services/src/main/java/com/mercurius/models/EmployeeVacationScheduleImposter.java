package com.mercurius.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class EmployeeVacationScheduleImposter {
	
	private String dailyDate;
	
	private Long bidscheduleIdRef;
	
	private Long managerIdRef;
	
	private List<EmployeeVacationScheduleImposterChild> empinfo = new ArrayList<>();

	public String getDailyDate() {
		return dailyDate;
	}

	public void setDailyDate(String dailyDate) {
		this.dailyDate = dailyDate;
	}

	public Long getBidscheduleIdRef() {
		return bidscheduleIdRef;
	}

	public void setBidscheduleIdRef(Long bidscheduleIdRef) {
		this.bidscheduleIdRef = bidscheduleIdRef;
	}

	public Long getManagerIdRef() {
		return managerIdRef;
	}

	public void setManagerIdRef(Long managerIdRef) {
		this.managerIdRef = managerIdRef;
	}

	public List<EmployeeVacationScheduleImposterChild> getEmpinfo() {
		return empinfo;
	}

	public void setEmpinfo(List<EmployeeVacationScheduleImposterChild> empinfo) {
		this.empinfo = empinfo;
	}

}
