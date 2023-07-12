package com.mercurius.models;

public class FacilityReferenceForEmployeeChild1 {
	
	private long facilityid;
	
	private String facilityname;
	
	private String facilityabbr;

	public FacilityReferenceForEmployeeChild1() {
		super();
	}

	public long getFacilityid() {
		return facilityid;
	}

	public void setFacilityid(long facilityid) {
		this.facilityid = facilityid;
	}

	public String getFacilityname() {
		return facilityname;
	}

	public void setFacilityname(String facilityname) {
		this.facilityname = facilityname;
	}

	public String getFacilityabbr() {
		return facilityabbr;
	}

	public void setFacilityabbr(String facilityabbr) {
		this.facilityabbr = facilityabbr;
	}

	public FacilityReferenceForEmployeeChild1(long facilityid, String facilityname, String facilityabbr) {
		super();
		this.facilityid = facilityid;
		this.facilityname = facilityname;
		this.facilityabbr = facilityabbr;
	}

	@Override
	public String toString() {
		return "FacilityReferenceForEmployeeChild1 [facilityid=" + facilityid + ", facilityname=" + facilityname
				+ ", facilityabbr=" + facilityabbr + "]";
	}
	
}
