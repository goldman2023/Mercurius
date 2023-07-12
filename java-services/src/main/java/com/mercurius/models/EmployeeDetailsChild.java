package com.mercurius.models;

public class EmployeeDetailsChild {
	
	private Long empid;
	
	private String fname;

	private String lname;

	private String initials;

	public EmployeeDetailsChild() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getEmpid() {
		return empid;
	}

	public void setEmpid(Long empid) {
		this.empid = empid;
	}

	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getLname() {
		return lname;
	}

	public void setLname(String lname) {
		this.lname = lname;
	}

	public String getInitials() {
		return initials;
	}

	public void setInitials(String initials) {
		this.initials = initials;
	}

	public EmployeeDetailsChild(Long empid, String fname, String lname, String initials) {
		super();
		this.empid = empid;
		this.fname = fname;
		this.lname = lname;
		this.initials = initials;
	}


}
