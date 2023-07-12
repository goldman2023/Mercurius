package com.mercurius.models;

import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonFormat;


@Entity
@Table(name = "user_defined_shift_definitions")

public class UserDefinedShiftDefinitions {

	//Here "sh" means Shift
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "shift_definition_id")
	private long sh_id;
	
	@Column(name = "shift_name")
	private String sh_name;
	
	@Column(name = "shift_category_id")
	private Integer sh_category_id;
	
	@Column(name = "shift_start_time")
	@JsonFormat(pattern = "hh:mm:ss a")
	private Time sh_starttime;  
	
	@Column(name = "shift_end_time")
	@JsonFormat(pattern = "hh:mm:ss a")
	private Time sh_endtime;
	
	@Column(name = "shift_priority")
	private Integer sh_priority;
	
	@Column(name = "shift_activation_date")
	@JsonFormat(pattern="yyyy-MM-dd")
    private String sh_activation_date;
	
	@Column(name = "shift_expiration_date")
	@JsonFormat(pattern="yyyy-MM-dd")
	private String sh_expiration_date;
	
	@Column(name = "shift_created_by")
	private long sh_created_by;
	
	@Column(name = "shift_include_exclude")
	private char sh_include_exclude;

	@Column(name = "area_id")
	private Integer sh_area_id;
	
	@Column(name = "shift_duration")
	private Integer sh_duration;
	
	@Column(name = "area_name")
	private String area_name_ref;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "usr_shift_created_date")
	private String created_date;
	
	@Column(name = "usr_shift_updated_by")
	private String updated_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "usr_shift_updated_date")
	private String updated_date;
	
	@Column(name = "shift_category_name")
	private String sh_category_name_ref;
	
	@Column(name = "status")
	private String status;
	
	static List<UserDefinedShiftDefinitions> uList = new ArrayList<>();
	
	
	public UserDefinedShiftDefinitions(long sh_id, String sh_name, Integer sh_category_id, Time sh_starttime,
			Time sh_endtime, Integer sh_priority, String sh_activation_date, String sh_expiration_date,
			long sh_created_by, char sh_include_exclude, Integer sh_area_id, Integer sh_duration, String area_name_ref,
			String created_date, String updated_by, String updated_date, String sh_category_name_ref, String status) {
		super();
		this.sh_id = sh_id;
		this.sh_name = sh_name;
		this.sh_category_id = sh_category_id;
		this.sh_starttime = sh_starttime;
		this.sh_endtime = sh_endtime;
		this.sh_priority = sh_priority;
		this.sh_activation_date = sh_activation_date;
		this.sh_expiration_date = sh_expiration_date;
		this.sh_created_by = sh_created_by;
		this.sh_include_exclude = sh_include_exclude;
		this.sh_area_id = sh_area_id;
		this.sh_duration = sh_duration;
		this.area_name_ref = area_name_ref;
		this.created_date = created_date;
		this.updated_by = updated_by;
		this.updated_date = updated_date;
		this.sh_category_name_ref = sh_category_name_ref;
		this.status = status;
	}

	public UserDefinedShiftDefinitions() {
		super();
		// TODO Auto-generated constructor stub
	}

	public long getSh_id() {
		return sh_id;
	}

	public void setSh_id(long sh_id) {
		this.sh_id = sh_id;
	}

	public String getSh_name() {
		return sh_name;
	}

	public void setSh_name(String sh_name) {
		this.sh_name = sh_name;
	}

	public Integer getSh_category_id() {
		return sh_category_id;
	}

	public void setSh_category_id(Integer sh_category_id) {
		this.sh_category_id = sh_category_id;
	}

	public Time getSh_starttime() {
		return sh_starttime;
	}

	public void setSh_starttime(Time sh_starttime) {
		this.sh_starttime = sh_starttime;
	}

	public Time getSh_endtime() {
		return sh_endtime;
	}

	public void setSh_endtime(Time sh_endtime) {
		this.sh_endtime = sh_endtime;
	}

	public Integer getSh_priority() {
		return sh_priority;
	}

	public void setSh_priority(Integer sh_priority) {
		this.sh_priority = sh_priority;
	}

	public String getSh_activation_date() {
		return sh_activation_date;
	}

	public void setSh_activation_date(String sh_activation_date) {
		this.sh_activation_date = sh_activation_date;
	}

	public String getSh_expiration_date() {
		return sh_expiration_date;
	}

	public void setSh_expiration_date(String sh_expiration_date) {
		this.sh_expiration_date = sh_expiration_date;
	}

	public long getSh_created_by() {
		return sh_created_by;
	}

	public void setSh_created_by(long sh_created_by) {
		this.sh_created_by = sh_created_by;
	}

	public char getSh_include_exclude() {
		return sh_include_exclude;
	}

	public void setSh_include_exclude(char sh_include_exclude) {
		this.sh_include_exclude = sh_include_exclude;
	}

	public Integer getSh_area_id() {
		return sh_area_id;
	}

	public void setSh_area_id(Integer sh_area_id) {
		this.sh_area_id = sh_area_id;
	}

	public Integer getSh_duration() {
		return sh_duration;
	}

	public void setSh_duration(Integer sh_duration) {
		this.sh_duration = sh_duration;
	}

	public String getArea_name_ref() {
		return area_name_ref;
	}

	public void setArea_name_ref(String area_name_ref) {
		this.area_name_ref = area_name_ref;
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

	public String getSh_category_name_ref() {
		return sh_category_name_ref;
	}

	public void setSh_category_name_ref(String sh_category_name_ref) {
		this.sh_category_name_ref = sh_category_name_ref;
	}

	public String getStatus() {
		return status;
	}

	public String setStatus(String status) {
		return this.status = status;
	}

	@Override
	public String toString() {
		return "UserDefinedShiftDefinitions [sh_id=" + sh_id + ", sh_name=" + sh_name + ", sh_category_id="
				+ sh_category_id + ", sh_starttime=" + sh_starttime + ", sh_endtime=" + sh_endtime + ", sh_priority="
				+ sh_priority + ", sh_activation_date=" + sh_activation_date + ", sh_expiration_date="
				+ sh_expiration_date + ", sh_created_by=" + sh_created_by + ", sh_include_exclude=" + sh_include_exclude
				+ ", sh_area_id=" + sh_area_id + ", sh_duration=" + sh_duration + ", area_name_ref=" + area_name_ref
				+ ", created_date=" + created_date + ", updated_by=" + updated_by + ", updated_date=" + updated_date
				+ ", sh_category_name_ref=" + sh_category_name_ref + ", status=" + status + "]";
	}
	
}
