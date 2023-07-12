package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "transaction_tobind_role_permissions")
public class TransactionTable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "transaction_id")
	private Long t_id; 
	
	@Column(name = "role_id_ref")
	private Long role_id; 
	
	@Column(name = "permission_id_ref")
	private Long permission_id; 
	
	@Column(name = "selection_status")
	private boolean status=false;

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

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public TransactionTable() {
		super();
		// TODO Auto-generated constructor stub
	}

	public TransactionTable(Long t_id, Long role_id, Long permission_id, boolean status) {
		super();
		this.t_id = t_id;
		this.role_id = role_id;
		this.permission_id = permission_id;
		this.status = status;
	}

	@Override
	public String toString() {
		return "TransactionTable [t_id=" + t_id + ", role_id=" + role_id + ", permission_id=" + permission_id
				+ ", status=" + status + "]";
	}

	
}
