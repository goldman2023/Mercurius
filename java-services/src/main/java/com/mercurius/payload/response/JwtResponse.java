package com.mercurius.payload.response;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class JwtResponse {
	private String token;
	private String type = "Bearer";
	private Long id;
	private String username;
	private String phone;
	private String verificationCode;
	private String firstname;
	private String lastname;
	//private boolean enabled;
	private long role_id_ref;
	private String start_date;
	private String end_date;
	private long trial_period;
	private boolean enabled;


	public JwtResponse(String accessToken, Long id, String username, String phone, String verificationCode,
			String firstname, String lastname, long role_id_ref, String start_date, String end_date, long trial_period,
			boolean enabled) {
		super();
		this.token = accessToken;
		//this.type = type;
		this.id = id;
		this.username = username;
		this.phone = phone;
		this.verificationCode = verificationCode;
		this.firstname = firstname;
		this.lastname = lastname;
		this.role_id_ref = role_id_ref;
		this.start_date = start_date;
		this.end_date = end_date;
		this.trial_period = trial_period;
		this.enabled = enabled;
	}

	public String getAccessToken() {
		return token;
	}

	public void setAccessToken(String accessToken) {
		this.token = accessToken;
	}

	public String getTokenType() {
		return type;
	}

	public void setTokenType(String tokenType) {
		this.type = tokenType;
	}

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
	
	public String getPhone() {
		return phone;
	}
	
	public void setPhone(String phone)
	{
		this.phone = phone;
	}

	public String getVerificationCode() {
		return verificationCode;
	}

	public void setVerificationCode(String verificationCode) {
		this.verificationCode = verificationCode;
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
	
	public boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

}
