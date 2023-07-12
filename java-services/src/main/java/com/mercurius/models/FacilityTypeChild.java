package com.mercurius.models;


public class FacilityTypeChild {
	
	private long facilitytype_id;
	
	private String facilitytype_name;

	public FacilityTypeChild() {
		super();
		// TODO Auto-generated constructor stub
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

	public FacilityTypeChild(long facilitytype_id, String facilitytype_name) {
		super();
		this.facilitytype_id = facilitytype_id;
		this.facilitytype_name = facilitytype_name;
	}

	@Override
	public String toString() {
		return "FacilityTypeChild [facilitytype_id=" + facilitytype_id + ", facilitytype_name=" + facilitytype_name
				+ "]";
	}
	

}
