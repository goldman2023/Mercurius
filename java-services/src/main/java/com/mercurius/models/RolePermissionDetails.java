package com.mercurius.models;

import java.sql.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "role_permissions")
public class RolePermissionDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "permission_id")
	private Long p_id; 
	
	@Column(name = "module_name")
	private String modu_name;
	
	@Column(name = "function_name")
	private String func_name;
	
	@Column(name = "action_name")
	private String act_name;
	
	@Column(name = "created_by")
	private long createdby;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "created_date")
	private Date createddate;
	
	@Column(name = "updated_by")
	private String updatedby;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "updated_date")
	private Date updateddate;
	
	@Column(name = "permission_status")
	private String status;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "role_eff_start_date")
	private Date start_date;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "role_eff_end_date")
	private Date end_date;
	
	public RolePermissionDetails() {
		super();
		// TODO Auto-generated constructor stub
	}


	public Long getP_id() {
		return p_id;
	}

	public void setP_id(Long p_id) {
		this.p_id = p_id;
	}

	public String getModu_name() {
		return modu_name;
	}

	public void setModu_name(String modu_name) {
		this.modu_name = modu_name;
	}

	public String getFunc_name() {
		return func_name;
	}

	public void setFunc_name(String func_name) {
		this.func_name = func_name;
	}

	public String getAct_name() {
		return act_name;
	}

	public void setAct_name(String act_name) {
		this.act_name = act_name;
	}

	public long getCreatedby() {
		return createdby;
	}

	public void setCreatedby(long createdby) {
		this.createdby = createdby;
	}

	public Date getCreateddate() {
		return createddate;
	}

	public void setCreateddate(Date createddate) {
		this.createddate = createddate;
	}

	public String getUpdatedby() {
		return updatedby;
	}

	public void setUpdatedby(String updatedby) {
		this.updatedby = updatedby;
	}

	public Date getUpdateddate() {
		return updateddate;
	}

	public void setUpdateddate(Date updateddate) {
		this.updateddate = updateddate;
	}

	public String getStatus() {
		return status;
	}


	public String setStatus(String status) {
		return this.status = status;
	}
	
	

	public Date getStart_date() {
		return start_date;
	}


	public void setStart_date(Date start_date) {
		this.start_date = start_date;
	}


	public Date getEnd_date() {
		return end_date;
	}


	public void setEnd_date(Date end_date) {
		this.end_date = end_date;
	}


	public RolePermissionDetails(Long p_id, String modu_name, String func_name, String act_name, long createdby,
			Date createddate, String updatedby, Date updateddate, String status, Date start_date,
			Date end_date) {
		super();
		this.p_id = p_id;
		this.modu_name = modu_name;
		this.func_name = func_name;
		this.act_name = act_name;
		this.createdby = createdby;
		this.createddate = createddate;
		this.updatedby = updatedby;
		this.updateddate = updateddate;
		this.status = status;
		this.start_date = start_date;
		this.end_date = end_date;
	}


	@Override
	public String toString() {
		return "RolePermissionDetails [p_id=" + p_id + ", modu_name=" + modu_name + ", func_name=" + func_name
				+ ", act_name=" + act_name + ", createdby=" + createdby + ", createddate=" + createddate
				+ ", updatedby=" + updatedby + ", updateddate=" + updateddate + ", status=" + status + ", start_date="
				+ start_date + ", end_date=" + end_date + "]";
	}



}
