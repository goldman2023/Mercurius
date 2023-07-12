package com.mercurius.models;

public class EmployeeBasicWatchScheduleImposter {
	
	private long id;
	
	private Long bidscheduleid;
	
	private Long managerid;
	
	private Long empid;
	
	private String empFirstName;
	
	private String empLastName;
	
	private String empinitials;

	private int areaid;
	
	private int year;
	
	private String date;
	
	private int time;

	private int duration;

	private String rdoDayOff;

	public EmployeeBasicWatchScheduleImposter() {
		super();
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public int getTime() {
		return time;
	}

	public void setTime(int time) {
		this.time = time;
	}

	public int getDuration() {
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}

	public String getRdoDayOff() {
		return rdoDayOff;
	}

	public void setRdoDayOff(String rdoDayOff) {
		this.rdoDayOff = rdoDayOff;
	}

	public EmployeeBasicWatchScheduleImposter(long id, Long bidscheduleid, Long managerid, Long empid,
			String empFirstName, String empLastName, String empinitials, int areaid, int year, String date, int time,
			int duration, String rdoDayOff) {
		super();
		this.id = id;
		this.bidscheduleid = bidscheduleid;
		this.managerid = managerid;
		this.empid = empid;
		this.empFirstName = empFirstName;
		this.empLastName = empLastName;
		this.empinitials = empinitials;
		this.areaid = areaid;
		this.year = year;
		this.date = date;
		this.time = time;
		this.duration = duration;
		this.rdoDayOff = rdoDayOff;
	}

	@Override
	public String toString() {
		return "EmployeeBasicWatchScheduleImposter [id=" + id + ", bidscheduleid=" + bidscheduleid + ", managerid="
				+ managerid + ", empid=" + empid + ", empFirstName=" + empFirstName + ", empLastName=" + empLastName
				+ ", empinitials=" + empinitials + ", areaid=" + areaid + ", year=" + year + ", date=" + date
				+ ", time=" + time + ", duration=" + duration + ", rdoDayOff=" + rdoDayOff + "]";
	}

}
