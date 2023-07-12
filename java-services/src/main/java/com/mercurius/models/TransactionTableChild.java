package com.mercurius.models;

public class TransactionTableChild {
	
	private Long t_id; 
	private Long role_id; 
	private Long permission_id; 
	private String modu_name;
	private String act_name;
	private boolean status=false;
	
	public TransactionTableChild() {
		super();
	}
	public Long getT_id() {
		return t_id;
	}
	public void setT_id(Long t_id) {
		this.t_id = t_id;
	}
	public Long getRole_id() {
		return role_id;
	}
	public void setRole_id(Long role_id) {
		this.role_id = role_id;
	}
	public Long getPermission_id() {
		return permission_id;
	}
	public void setPermission_id(Long permission_id) {
		this.permission_id = permission_id;
	}
	public String getModu_name() {
		return modu_name;
	}
	public void setModu_name(String modu_name) {
		this.modu_name = modu_name;
	}
	public String getAct_name() {
		return act_name;
	}
	public void setAct_name(String act_name) {
		this.act_name = act_name;
	}
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	public TransactionTableChild(Long t_id, Long role_id, Long permission_id, String modu_name, String act_name,
			boolean status) {
		super();
		this.t_id = t_id;
		this.role_id = role_id;
		this.permission_id = permission_id;
		this.modu_name = modu_name;
		this.act_name = act_name;
		this.status = status;
	}

}
