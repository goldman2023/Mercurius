package com.mercurius.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserLoginImposter {
	
	private Long id;
	private String username;
	private String password;
	private String token;
	private LocalDateTime tokenCreationDate;
	private String phone;
	private String verificationCode;
	private boolean enabled;
	private boolean fpverify;
	private String firstname;
	private String lastname;
	private long role_id_ref;
	private String start_date;
	private String end_date;
	private long trial_period;
	private long areaid;
	private String areaname;
	private long facilityid;
	private String facilityname;
	Map<Long, String> bidmap = new HashMap<Long, String>();
	private String type = "Bearer";

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public LocalDateTime getTokenCreationDate() {
		return tokenCreationDate;
	}

	public void setTokenCreationDate(LocalDateTime tokenCreationDate) {
		this.tokenCreationDate = tokenCreationDate;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getVerificationCode() {
		return verificationCode;
	}

	public void setVerificationCode(String verificationCode) {
		this.verificationCode = verificationCode;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public boolean isFpverify() {
		return fpverify;
	}

	public void setFpverify(boolean fpverify) {
		this.fpverify = fpverify;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public long getRole_id_ref() {
		return role_id_ref;
	}

	public void setRole_id_ref(long role_id_ref) {
		this.role_id_ref = role_id_ref;
	}

	public String getStart_date() {
		return start_date;
	}

	public void setStart_date(String start_date) {
		this.start_date = start_date;
	}

	public String getEnd_date() {
		return end_date;
	}

	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}

	public long getTrial_period() {
		return trial_period;
	}

	public void setTrial_period(long trial_period) {
		this.trial_period = trial_period;
	}

	public long getAreaid() {
		return areaid;
	}

	public void setAreaid(long areaid) {
		this.areaid = areaid;
	}

	public long getFacilityid() {
		return facilityid;
	}

	public void setFacilityid(long facilityid) {
		this.facilityid = facilityid;
	}

	public String getAreaname() {
		return areaname;
	}

	public void setAreaname(String areaname) {
		this.areaname = areaname;
	}

	public String getFacilityname() {
		return facilityname;
	}

	public void setFacilityname(String facilityname) {
		this.facilityname = facilityname;
	}

	public Map<Long, String> getBidmap() {
		return bidmap;
	}

	public void setBidmap(Map<Long, String> bidmap) {
		this.bidmap = bidmap;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
}
