package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "employee_posted_watch_schedule")
public class EmployeePostedWatchSchedule {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "posted_id")
	private long id;
	
	@Column(name = "bid_schedule_id_ref")
	private Long bidscheduleid;
	
	@Column(name = "manager_id_ref")
	private Long managerid;
	
	@Column(name = "employee_id_ref")
	private Long empid;
	
	@Column(name = "employee_initials")
	private String empinitials;
	
	@Column(name = "area_id_ref")
	private int areaid;
	
	@Column(name = "bidding_year")
	private int year;
	
	@Column(name = "shift_date")
	private String date;
	
	@Column(name = "shift_time")
	private int time;
	
	@Column(name = "shift_duration") 
	private int duration;
	
	@Column(name = "rdo_day_off")
	private String rdoDayOff;

	public EmployeePostedWatchSchedule() {
		super();
		// TODO Auto-generated constructor stub
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

	public EmployeePostedWatchSchedule(long id, Long bidscheduleid, Long managerid, Long empid, String empinitials,
			int areaid, int year, String date, int time, int duration, String rdoDayOff) {
		super();
		this.id = id;
		this.bidscheduleid = bidscheduleid;
		this.managerid = managerid;
		this.empid = empid;
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
		return "EmployeePostedWatchSchedule [id=" + id + ", bidscheduleid=" + bidscheduleid + ", managerid=" + managerid
				+ ", empid=" + empid + ", empinitials=" + empinitials + ", areaid=" + areaid + ", year=" + year
				+ ", date=" + date + ", time=" + time + ", duration=" + duration + ", rdoDayOff=" + rdoDayOff + "]";
	}

}
