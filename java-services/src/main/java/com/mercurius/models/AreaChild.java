package com.mercurius.models;

public class AreaChild {
	
	private long areaid;
	
	private String areaname;

	public AreaChild() {
		super();
		// TODO Auto-generated constructor stub
	}

	public long getAreaid() {
		return areaid;
	}

	public void setAreaid(long areaid) {
		this.areaid = areaid;
	}

	public String getAreaname() {
		return areaname;
	}

	public void setAreaname(String areaname) {
		this.areaname = areaname;
	}

	public AreaChild(long areaid, String areaname) {
		super();
		this.areaid = areaid;
		this.areaname = areaname;
	}

	@Override
	public String toString() {
		return "AreaChild [areaid=" + areaid + ", areaname=" + areaname + "]";
	}
}
