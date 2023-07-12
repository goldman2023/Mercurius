package com.mercurius.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.sql.Date;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(	name = "userlogin", 		//name = "loginversion1"
		uniqueConstraints = { 
			@UniqueConstraint(columnNames = "user_email_id")
		})
public class UserToLogin {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "user_email_id")
	private String username;


	@Column(name = "password")
	private String password;
	
	private String token;
	
	
	@Column(name = "token_creation_date", columnDefinition = "TIMESTAMP")
	private LocalDateTime tokenCreationDate;
	
	@Column(name = "phone")
	private String phone;
	
	@Column(name = "verification_code", length = 64)
	private String verificationCode;
	
	private boolean enabled;
	
	@Column(name = "forgot_pwd_verify")
	private boolean fpverify;
	
	@Column(name = "first_name")
	private String firstname;
	
	@Column(name = "last_name")
	private String lastname;
	
	@Column(name = "role_id_ref")
	private long role_id_ref;
	
	@Column(name = "trial_start_date")
	private String start_date;
	
	@Column(name = "trial_end_date")
	private String end_date;
	
	@Column(name = "trial_duration")
	private long trial_period = 0;
	
	public UserToLogin() {
	}

	public UserToLogin(String username, String password,
			String phone, String verificationCode, boolean enabled, boolean fpverify, String firstname, String lastname,
			long role_id_ref, String start_date, String end_date, long trial_period) {
		super();
		//this.id = id;
		this.username = username;
		this.password = password;
		//this.token = token;
		//this.tokenCreationDate = tokenCreationDate;
		this.phone = phone;
		this.verificationCode = verificationCode;
		this.enabled = enabled;
		this.fpverify = fpverify;
		this.firstname = firstname;
		this.lastname = lastname;
		this.role_id_ref = role_id_ref;
		this.start_date = start_date;
		this.end_date = end_date;
		this.trial_period = trial_period;
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


	@Override
	public String toString() {
		return "UserToLogin [id=" + id + ", username=" + username + ", password=" + password + ", token=" + token
				+ ", tokenCreationDate=" + tokenCreationDate + ", phone=" + phone + ", verificationCode="
				+ verificationCode + ", enabled=" + enabled + ", fpverify=" + fpverify + ", firstname=" + firstname
				+ ", lastname=" + lastname + ", role_id_ref=" + role_id_ref + ", start_date=" + start_date
				+ ", end_date=" + end_date + ", trial_period=" + trial_period 
				+ "]";
	}
	
}
