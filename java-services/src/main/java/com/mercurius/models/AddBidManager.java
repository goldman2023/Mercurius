package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "bid_manager_details")
public class AddBidManager {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bid_manager_id")
	private Long bidManagerId;
	
	@Column(name = "first_name")
	private String fname;
	
	@Column(name = "last_name")
	private String lname;
	
	@Column(name = "operating_initials")
	private String initials;
	
	@Column(name = "phone_no")
	private long phone;
	
	@Column(name = "email_id")
	private String email;
	
	@Column(name = "qualification")
	private String qualification;
	
	@Column(name = "role_ref_id")
	private long roleId;
	
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
	
	@Column(name = "created_by")
	private Long createdBy;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "created_date")
	private String createdDate;
	
	@Column(name = "updated_by")
	private String updatedBy;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "updated_date")
	private String updatedDate;
	
	@Column(name = "user_id_ref")
	private Long userIdRef;

	public AddBidManager() {
		super();
		// TODO Auto-generated constructor stub
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

	public long getRoleId() {
		return roleId;
	}

	public void setRoleId(long roleId) {
		this.roleId = roleId;
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

	public int getAccumulatedleave() {
		return accumulatedleave;
	}

	public void setAccumulatedleave(int accumulatedleave) {
		this.accumulatedleave = accumulatedleave;
	}

	public int getEmailsent() {
		return emailsent;
	}

	public void setEmailsent(int emailsent) {
		this.emailsent = emailsent;
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

	public Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Long createdBy) {
		this.createdBy = createdBy;
	}

	public String getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}

	public String getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}

	public String getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(String updatedDate) {
		this.updatedDate = updatedDate;
	}
	
	public Long getUserIdRef() {
		return userIdRef;
	}

	public void setUserIdRef(Long userIdRef) {
		this.userIdRef = userIdRef;
	}

	public AddBidManager(Long bidManagerId, String fname, String lname, String initials, long phone, String email,
			String qualification, long roleId, long rank, long vacation, int accumulatedleave, int emailsent,
			short status, long areaid, long facailityIdRef, Long createdBy, String createdDate, String updatedBy,
			String updatedDate, Long userIdRef) {
		super();
		this.bidManagerId = bidManagerId;
		this.fname = fname;
		this.lname = lname;
		this.initials = initials;
		this.phone = phone;
		this.email = email;
		this.qualification = qualification;
		this.roleId = roleId;
		this.rank = rank;
		this.vacation = vacation;
		this.accumulatedleave = accumulatedleave;
		this.emailsent = emailsent;
		this.status = status;
		this.areaid = areaid;
		this.facailityIdRef = facailityIdRef;
		this.createdBy = createdBy;
		this.createdDate = createdDate;
		this.updatedBy = updatedBy;
		this.updatedDate = updatedDate;
		this.userIdRef = userIdRef;
	}

	@Override
	public String toString() {
		return "AddBidManager [bidManagerId=" + bidManagerId + ", fname=" + fname + ", lname=" + lname + ", initials="
				+ initials + ", phone=" + phone + ", email=" + email + ", qualification=" + qualification + ", roleId="
				+ roleId + ", rank=" + rank + ", vacation=" + vacation + ", accumulatedleave=" + accumulatedleave
				+ ", emailsent=" + emailsent + ", status=" + status + ", areaid=" + areaid + ", facailityIdRef="
				+ facailityIdRef + ", createdBy=" + createdBy + ", createdDate=" + createdDate + ", updatedBy="
				+ updatedBy + ", updatedDate=" + updatedDate + ", userIdRef=" + userIdRef + "]";
	}

}
