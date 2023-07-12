package com.mercurius.models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "ref_faa_role")
public class EmployeeRole {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ref_role_id")
	private Long id;
	
	@Column(name = "ref_role_name")
	private String role_name;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "role_eff_start_date")
	private String start_date;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "role_eff_end_date")
	private String end_date;
	
	
	@Column(name = "role_created_by")
	private long created_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "role_created_date")
	private String created_date;
	
	@Column(name = "role_updated_by")
	private String updated_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "role_updated_date")
	private String updated_date;
	
	@Column(name = "role_status")
	private String status;

	public EmployeeRole() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	public EmployeeRole(Long id, String role_name, String start_date, String end_date, long created_by, String created_date,
			String updated_by, String updated_date, String status) {
		super();
		this.id = id;
		this.role_name = role_name;
		this.start_date = start_date;
		this.end_date = end_date;
		this.created_by = created_by;
		this.created_date = created_date;
		this.updated_by = updated_by;
		this.updated_date = updated_date;
		this.status = status;
	}


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRole_name() {
		return role_name;
	}

	public void setRole_name(String role_name) {
		this.role_name = role_name;
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

	
}
