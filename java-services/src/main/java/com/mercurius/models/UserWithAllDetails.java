package com.mercurius.models;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserWithAllDetails {
	
	private Long userIdRef;
	private long areaid;
	private String areaname;
	private long facilityid;
	private String facilityname;
	private long empid;
	private long bidmanagerid;
	
	private List<UserWithAllPermissions> permissionDetails = new ArrayList<UserWithAllPermissions>();
	Map<Long, String> bidscheduleDetails = new HashMap<Long, String>();
	
	
	public UserWithAllDetails() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Long getUserIdRef() {
		return userIdRef;
	}
	public void setUserIdRef(Long userIdRef) {
		this.userIdRef = userIdRef;
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
	public long getEmpid() {
		return empid;
	}
	public void setEmpid(long empid) {
		this.empid = empid;
	}
	public long getBidmanagerid() {
		return bidmanagerid;
	}
	public void setBidmanagerid(long bidmanagerid) {
		this.bidmanagerid = bidmanagerid;
	}
	public List<UserWithAllPermissions> getPermissionDetails() {
		return permissionDetails;
	}
	public void setPermissionDetails(List<UserWithAllPermissions> permissionDetails) {
		this.permissionDetails = permissionDetails;
	}
	public Map<Long, String> getBidscheduleDetails() {
		return bidscheduleDetails;
	}
	public void setBidscheduleDetails(Map<Long, String> bidscheduleDetails) {
		this.bidscheduleDetails = bidscheduleDetails;
	}
	public UserWithAllDetails(Long userIdRef, long areaid, String areaname, long facilityid, String facilityname,
			long empid, long bidmanagerid, List<UserWithAllPermissions> permissionDetails,
			Map<Long, String> bidscheduleDetails) {
		super();
		this.userIdRef = userIdRef;
		this.areaid = areaid;
		this.areaname = areaname;
		this.facilityid = facilityid;
		this.facilityname = facilityname;
		this.empid = empid;
		this.bidmanagerid = bidmanagerid;
		this.permissionDetails = permissionDetails;
		this.bidscheduleDetails = bidscheduleDetails;
	}
	@Override
	public String toString() {
		return "UserWithAllDetails [userIdRef=" + userIdRef + ", areaid=" + areaid + ", areaname=" + areaname
				+ ", facilityid=" + facilityid + ", facilityname=" + facilityname + ", empid=" + empid
				+ ", bidmanagerid=" + bidmanagerid + ", permissionDetails=" + permissionDetails
				+ ", bidscheduleDetails=" + bidscheduleDetails + "]";
	}
	
}
