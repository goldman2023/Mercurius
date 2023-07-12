package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "ref_facility")
public class FacilityReferenceForEmployee {

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ref_facility_id")
	private long facilityid;
	
	@Column(name = "ref_facility_abbr") 
	private String facilityabbr;
	
	@Column(name = "ref_facility_name") 
	private String facilityname;
	
	@Column(name = "ref_facility_city") 
	private String facilitycity;
	
	@Column(name = "ref_facility_state") 
	private String facilitystate;
	
	@Column(name = "ref_facility_type_id_ref")
	private long facilitytypeidref;
	
	@Column(name = "ref_facility_type_name_ref") 
	private String facilitytypenameref;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "ref_facility_eff_start_date")
	private String start_date;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "ref_facility_eff_end_date")
	private String end_date;
	
	@Column(name = "ref_facility_created_by")
	private long created_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "ref_facility_created_date")
	private String created_date;
	
	@Column(name = "ref_facility_updated_by")
	private String updated_by;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "ref_facility_updated_date")
	private String updated_date;
	
	@Column(name = "facility_status")
	private String status;


	public FacilityReferenceForEmployee() {
		super();
		// TODO Auto-generated constructor stub
	}


	public FacilityReferenceForEmployee(long facilityid, String facilityabbr, String facilityname, String facilitycity,
			String facilitystate, long facilitytypeidref, String facilitytypenameref, String start_date, String end_date,
			long created_by, String created_date, String updated_by, String updated_date, String status) {
		super();
		this.facilityid = facilityid;
		this.facilityabbr = facilityabbr;
		this.facilityname = facilityname;
		this.facilitycity = facilitycity;
		this.facilitystate = facilitystate;
		this.facilitytypeidref = facilitytypeidref;
		this.facilitytypenameref = facilitytypenameref;
		this.start_date = start_date;
		this.end_date = end_date;
		this.created_by = created_by;
		this.created_date = created_date;
		this.updated_by = updated_by;
		this.updated_date = updated_date;
		this.status = status;
	}

	public long getFacilityid() {
		return facilityid;
	}

	public void setFacilityid(long facilityid) {
		this.facilityid = facilityid;
	}

	public String getFacilityabbr() {
		return facilityabbr;
	}

	public void setFacilityabbr(String facilityabbr) {
		this.facilityabbr = facilityabbr;
	}

	public String getFacilityname() {
		return facilityname;
	}

	public void setFacilityname(String facilityname) {
		this.facilityname = facilityname;
	}

	public String getFacilitycity() {
		return facilitycity;
	}

	public void setFacilitycity(String facilitycity) {
		this.facilitycity = facilitycity;
	}

	public String getFacilitystate() {
		return facilitystate;
	}

	public void setFacilitystate(String facilitystate) {
		this.facilitystate = facilitystate;
	}

	public long getFacilitytypeidref() {
		return facilitytypeidref;
	}

	public void setFacilitytypeidref(long facilitytypeidref) {
		this.facilitytypeidref = facilitytypeidref;
	}


	public String getFacilitytypenameref() {
		return facilitytypenameref;
	}


	public void setFacilitytypenameref(String facilitytypenameref) {
		this.facilitytypenameref = facilitytypenameref;
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
