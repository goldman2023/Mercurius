package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "ref_area")
public class AreaReferenceForEmployee {
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ref_area_id")
	private long areaid;
	
	@Column(name = "ref_facility_id_ref")
	private long facilityidref;
	
	@Column(name = "ref_area_name") 
	private String areaname;
	
	@Column(name = "ref_area_description") 
	private String areadescription;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "ref_area_start_date")
	private String start_date;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "ref_area_eff_end_date")
	private String end_date;
	
	@Column(name = "ref_area_created_by")
	private long created_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "ref_area_created_date")
	private String created_date;
	
	@Column(name = "ref_area_updated_by")
	private String updated_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "ref_area_updated_date")
	private String updated_date;
	
	@Column(name = "ref_area_status")
	private String status;


	public AreaReferenceForEmployee() {
		super();
		// TODO Auto-generated constructor stub
	}

	public AreaReferenceForEmployee(long areaid, long facilityidref, String areaname, String areadescription,
			String start_date, String end_date, long created_by, String created_date, String updated_by,
			String updated_date, String status) {
		super();
		this.areaid = areaid;
		this.facilityidref = facilityidref;
		this.areaname = areaname;
		this.areadescription = areadescription;
		this.start_date = start_date;
		this.end_date = end_date;
		this.created_by = created_by;
		this.created_date = created_date;
		this.updated_by = updated_by;
		this.updated_date = updated_date;
		this.status = status;
	}



	public long getAreaid() {
		return areaid;
	}

	public void setAreaid(long areaid) {
		this.areaid = areaid;
	}

	public long getFacilityidref() {
		return facilityidref;
	}

	public void setFacilityidref(long facilityidref) {
		this.facilityidref = facilityidref;
	}

	public String getAreaname() {
		return areaname;
	}

	public void setAreaname(String areaname) {
		this.areaname = areaname;
	}

	public String getAreadescription() {
		return areadescription;
	}

	public void setAreadescription(String areadescription) {
		this.areadescription = areadescription;
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
