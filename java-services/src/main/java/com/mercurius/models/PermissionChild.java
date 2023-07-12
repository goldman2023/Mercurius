package com.mercurius.models;

public class PermissionChild {

	public Long p_id;
	private String modu_name;
	private String act_name;
	private String func_name;
	//s.modu_name,s.act_name,s.func_name
	public PermissionChild() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public Long getP_id() {
		return p_id;
	}

	public void setP_id(Long p_id) {
		this.p_id = p_id;
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

	public String getFunc_name() {
		return func_name;
	}

	public void setFunc_name(String func_name) {
		this.func_name = func_name;
	}

	@Override
	public String toString() {
		return "PermissionChild [p_id=" + p_id + ", modu_name=" + modu_name + ", act_name=" + act_name + ", func_name="
				+ func_name + "]";
	}

	public PermissionChild(Long p_id, String modu_name, String act_name, String func_name) {
		super();
		this.p_id = p_id;
		this.modu_name = modu_name;
		this.act_name = act_name;
		this.func_name = func_name;
	}
	
	
}
