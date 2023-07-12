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
@Table(name = "ref_faa_qualification")
public class EmployeeQualification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ref_qualification_id")
	private Long id;
	
	@Column(name = "ref_qualification_name")
	private String qual_name;
	
	@Column(name = "ref_qualification_desc")
	private String qual_description;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "qual_eff_start_date")
	private String eff_start_date;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "qual_eff_end_date")
	private String eff_end_date;
	
	@Column(name = "qual_created_by")
	private long qual_created_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "qual_created_date")
	private String qual_created_date;
	
	@Column(name = "qual_updated_by")
	private String qual_updated_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "qual_updated_date")
	private String qual_updated_date;
	
	@Column(name = "qual_status")
	private String status;
	

	public EmployeeQualification() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getQual_name() {
		return qual_name;
	}

	public void setQual_name(String qual_name) {
		this.qual_name = qual_name;
	}

	public String getQual_description() {
		return qual_description;
	}

	public void setQual_description(String qual_description) {
		this.qual_description = qual_description;
	}

	public String getEff_start_date() {
		return eff_start_date;
	}

	public void setEff_start_date(String eff_start_date) {
		this.eff_start_date = eff_start_date;
	}

	public String getEff_end_date() {
		return eff_end_date;
	}

	public void setEff_end_date(String eff_end_date) {
		this.eff_end_date = eff_end_date;
	}

	public long getQual_created_by() {
		return qual_created_by;
	}

	public void setQual_created_by(long qual_created_by) {
		this.qual_created_by = qual_created_by;
	}

	public String getQual_created_date() {
		return qual_created_date;
	}

	public void setQual_created_date(String qual_created_date) {
		this.qual_created_date = qual_created_date;
	}

	public String getQual_updated_by() {
		return qual_updated_by;
	}

	public void setQual_updated_by(String qual_updated_by) {
		this.qual_updated_by = qual_updated_by;
	}

	public String getQual_updated_date() {
		return qual_updated_date;
	}

	public void setQual_updated_date(String qual_updated_date) {
		this.qual_updated_date = qual_updated_date;
	}

	public String getStatus() {
		return status;
	}

	public String setStatus(String status) {
		return this.status = status;
	}

	@Override
	public String toString() {
		return "EmployeeQualification [id=" + id + ", qual_name=" + qual_name + ", qual_description=" + qual_description
				+ ", eff_start_date=" + eff_start_date + ", eff_end_date=" + eff_end_date + ", qual_created_by="
				+ qual_created_by + ", qual_created_date=" + qual_created_date + ", qual_updated_by=" + qual_updated_by
				+ ", qual_updated_date=" + qual_updated_date + ", status=" + status + "]";
	}

	
}
