package com.mercurius.models;

public class ShiftCategoryChild {

	private long shcategory_id;
	
	private String shcategory_name;

	public long getShcategory_id() {
		return shcategory_id;
	}

	public void setShcategory_id(long shcategory_id) {
		this.shcategory_id = shcategory_id;
	}

	public String getShcategory_name() {
		return shcategory_name;
	}

	public void setShcategory_name(String shcategory_name) {
		this.shcategory_name = shcategory_name;
	}

	public ShiftCategoryChild(long shcategory_id, String shcategory_name) {
		super();
		this.shcategory_id = shcategory_id;
		this.shcategory_name = shcategory_name;
	}
	
}
