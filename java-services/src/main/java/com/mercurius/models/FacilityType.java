package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "ref_facility_type")
public class FacilityType {

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ref_facility_type_id")
	private long facilitytype_id;
	
	@Column(name = "ref_facility_type_name")
	private String facilitytype_name;
	
	@Column(name = "ref_facility_type_description")
	private String facilitytype_desc;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "facility_eff_start_date")
	private String start_date;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "facility_eff_end_date")
	private String end_date;
	
	@Column(name = "facility_created_by")
	private long created_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "facility_created_date")
	private String created_date;
	
	@Column(name = "facility_updated_by")
	private String updated_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "facility_updated_date")
	private String updated_date;
	
	@Column(name = "facility_status")
	private String status;

	public FacilityType() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FacilityType(long facilitytype_id, String facilitytype_name, String facilitytype_desc, String start_date,
			String end_date, long created_by, String created_date, String updated_by, String updated_date,
			String status) {
		super();
		this.facilitytype_id = facilitytype_id;
		this.facilitytype_name = facilitytype_name;
		this.facilitytype_desc = facilitytype_desc;
		this.start_date = start_date;
		this.end_date = end_date;
		this.created_by = created_by;
		this.created_date = created_date;
		this.updated_by = updated_by;
		this.updated_date = updated_date;
		this.status = status;
	}

	public long getFacilitytype_id() {
		return facilitytype_id;
	}

	public void setFacilitytype_id(long facilitytype_id) {
		this.facilitytype_id = facilitytype_id;
	}

	public String getFacilitytype_name() {
		return facilitytype_name;
	}

	public void setFacilitytype_name(String facilitytype_name) {
		this.facilitytype_name = facilitytype_name;
	}

	public String getFacilitytype_desc() {
		return facilitytype_desc;
	}

	public void setFacilitytype_desc(String facilitytype_desc) {
		this.facilitytype_desc = facilitytype_desc;
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

	@Override
	public String toString() {
		return "FacilityType [facilitytype_id=" + facilitytype_id + ", facilitytype_name=" + facilitytype_name
				+ ", facilitytype_desc=" + facilitytype_desc + ", start_date=" + start_date + ", end_date=" + end_date
				+ ", created_by=" + created_by + ", created_date=" + created_date + ", updated_by=" + updated_by
				+ ", updated_date=" + updated_date + ", status=" + status + "]";
	}

	
}
