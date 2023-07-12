package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "employee_details")
public class AddEmployee {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "employee_id")
	private Long empid;
	
	@Column(name = "first_name")
	private String fname;
	
	@Column(name = "last_name")
	private String lname;
	
	@Column(name = "employee_operating_initials")
	private String initials;
	
	@Column(name = "phone_no")
	private long phone;
	
	@Column(name = "employee_email_id")
	private String email;
	
	@Column(name = "employee_qualification")
	private String qualification;
	
	@Column(name = "role_ref_id")
	private long role;
	
	@Column(name = "bid_manager_id")
	private Long managerid;//userid changes as managerid
	
	@Column(name = "seniority_ranking")
	private long rank;
	
	@Column(name = "vacation_leave")
	private long vacation;
	
	@Column(name = "accumulated_leave")
	private int accumulatedleave;
	
	@Column(name = "email_sent")
	private int emailsent;
	
	@Column(name = "status")
	private short status;
	
	@Column(name = "area_id_ref", columnDefinition = "integer default 1")
	private long areaid;
	
	@Column(name = "facility_id_ref", columnDefinition = "integer default 0")
	private long facailityIdRef;
	
	@Column(name = "user_id_ref")
	private Long userIdRef;
	
	public AddEmployee() {
		super();
		// TODO Auto-generated constructor stub
	}

	public AddEmployee(Long empid, String fname, String lname, String initials, long phone, String email,
			String qualification, long role, Long managerid, long rank, long vacation, int accumulatedleave,
			int emailsent, short status, long areaid, long facailityIdRef, long userIdRef) {
		super();
		this.empid = empid;
		this.fname = fname;
		this.lname = lname;
		this.initials = initials;
		this.phone = phone;
		this.email = email;
		this.qualification = qualification;
		this.role = role;
		this.managerid = managerid;
		this.rank = rank;
		this.vacation = vacation;
		this.accumulatedleave = accumulatedleave;
		this.emailsent = emailsent;
		this.status = status;
		this.areaid = areaid;
		this.facailityIdRef = facailityIdRef;
		this.userIdRef = userIdRef;
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

	public long getPhone() {
		return phone;
	}

	public void setPhone(long phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getQualification() {
		return qualification;
	}

	public void setQualification(String qualification) {
		this.qualification = qualification;
	}

	public long getrole() {
		return role;
	}

	public void setrole(long role) {
		this.role = role;
	}

	public Long getManagerid() {
		return managerid;
	}

	public void setManagerid(Long managerid) {
		this.managerid = managerid;
	}

	public long getRank() {
		return rank;
	}

	public void setRank(long rank) {
		this.rank = rank;
	}

	public long getVacation() {
		return vacation;
	}

	public void setVacation(long vacation) {
		this.vacation = vacation;
	}

	public int getEmailsent() {
		return emailsent;
	}

	public void setEmailsent(int emailsent) {
		this.emailsent = emailsent;
	}
	
	
	public int getAccumulatedleave() {
		return accumulatedleave;
	}


	public void setAccumulatedleave(int accumulatedleave) {
		this.accumulatedleave = accumulatedleave;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public long getAreaid() {
		return areaid;
	}

	public void setAreaid(long areaid) {
		this.areaid = areaid;
	}

	public long getFacailityIdRef() {
		return facailityIdRef;
	}

	public void setFacailityIdRef(long facailityIdRef) {
		this.facailityIdRef = facailityIdRef;
	}

	public Long getUserIdRef() {
		return userIdRef;
	}

	public void setUserIdRef(Long userIdRef) {
		this.userIdRef = userIdRef;
	}

	@Override
	public String toString() {
		return "AddEmployee [empid=" + empid + ", fname=" + fname + ", lname=" + lname + ", initials=" + initials
				+ ", phone=" + phone + ", email=" + email + ", qualification=" + qualification + ", role=" + role
				+ ", managerid=" + managerid + ", rank=" + rank + ", vacation=" + vacation + ", accumulatedleave="
				+ accumulatedleave + ", emailsent=" + emailsent + ", status=" + status + ", areaid=" + areaid
				+ ", facailityIdRef=" + facailityIdRef + ", userIdRef=" + userIdRef + "]";
	}

}
