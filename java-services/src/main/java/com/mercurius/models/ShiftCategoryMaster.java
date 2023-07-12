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
@Table(name = "shift_category_master")
public class ShiftCategoryMaster {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "shift_category_id")
	private long shcategory_id;
	
	@Column(name = "shift_category_name")
	private String shcategory_name;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "shift_category_eff_start_date")
	private String start_date;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "shift_category_eff_end_date")
	private String end_date;
	
	@Column(name = "shift_category_created_by")
	private long created_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "shift_category_created_date")
	private String created_date;
	
	@Column(name = "shift_category_updated_by")
	private String updated_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "shift_category_updated_date")
	private String updated_date;
	
	@Column(name = "shift_category_status")
	private String status;
	
	@Column(name = " shift_category_starttime")
	@JsonFormat(pattern="HH:mm:ss")
	private Time startTime;
	
	@Column(name = " shift_category_endtime")
	@JsonFormat(pattern="HH:mm:ss")
	private Time endtime;

	public ShiftCategoryMaster() {
		super();
		// TODO Auto-generated constructor stub
	}

	public long getShcategory_id() {
		return shcategory_id;
	}

	public void setShcategory_id(long shcategory_id) {
		this.shcategory_id = shcategory_id;
	}

	public String getShcategory_name() {
		return shcategory_name;
	}

	public void setShcategory_name(String shcategory_name) {
		this.shcategory_name = shcategory_name;
	}

	public String getStart_date() {
		return start_date;
	}

	public void setStart_date(String start_date) {
		this.start_date = start_date;
	}

	public String getEnd_date() {
		return end_date;
	}

	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}

	public long getCreated_by() {
		return created_by;
	}

	public void setCreated_by(long created_by) {
		this.created_by = created_by;
	}

	public String getCreated_date() {
		return created_date;
	}

	public void setCreated_date(String created_date) {
		this.created_date = created_date;
	}

	public String getUpdated_by() {
		return updated_by;
	}

	public void setUpdated_by(String updated_by) {
		this.updated_by = updated_by;
	}

	public String getUpdated_date() {
		return updated_date;
	}

	public void setUpdated_date(String updated_date) {
		this.updated_date = updated_date;
	}

	public String getStatus() {
		return status;
	}

	public String setStatus(String status) {
		return this.status = status;
	}
	
	public Time getStartTime() {
		return startTime;
	}

	public void setStartTime(Time startTime) {
		this.startTime = startTime;
	}

	public Time getEndtime() {
		return endtime;
	}

	public void setEndtime(Time endtime) {
		this.endtime = endtime;
	}

	public ShiftCategoryMaster(long shcategory_id, String shcategory_name, String start_date, String end_date,
			long created_by, String created_date, String updated_by, String updated_date, String status, Time startTime,
			Time endtime) {
		super();
		this.shcategory_id = shcategory_id;
		this.shcategory_name = shcategory_name;
		this.start_date = start_date;
		this.end_date = end_date;
		this.created_by = created_by;
		this.created_date = created_date;
		this.updated_by = updated_by;
		this.updated_date = updated_date;
		this.status = status;
		this.startTime = startTime;
		this.endtime = endtime;
	}

	@Override
	public String toString() {
		return "ShiftCategoryMaster [shcategory_id=" + shcategory_id + ", shcategory_name=" + shcategory_name
				+ ", start_date=" + start_date + ", end_date=" + end_date + ", created_by=" + created_by
				+ ", created_date=" + created_date + ", updated_by=" + updated_by + ", updated_date=" + updated_date
				+ ", status=" + status + ", startTime=" + startTime + ", endtime=" + endtime + "]";
	}
	
}
