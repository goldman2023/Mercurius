package com.mercurius.models;

public class AddBidManagerChild {
	
	private Long bidManagerId;
	private String fname;
	private String lname;
	
	public AddBidManagerChild() {
		super();
	}
	public Long getBidManagerId() {
		return bidManagerId;
	}
	public void setBidManagerId(Long bidManagerId) {
		this.bidManagerId = bidManagerId;
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
	
	public AddBidManagerChild(Long bidManagerId, String fname, String lname) {
		super();
		this.bidManagerId = bidManagerId;
		this.fname = fname;
		this.lname = lname;
	}

}
