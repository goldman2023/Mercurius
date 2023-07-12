package com.mercurius.models;


//@AllArgsContrsuctor
public class RoleChild {
	
	public long id;
	public String role_name;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getRole_name() {
		return role_name;
	}
	public void setRole_name(String role_name) {
		this.role_name = role_name;
	}
	public RoleChild(long id, String role_name) {
		super();
		this.id = id;
		this.role_name = role_name;
	}
	
	

}
