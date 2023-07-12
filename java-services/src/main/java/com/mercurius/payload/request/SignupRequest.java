package com.mercurius.payload.request;

import java.sql.Date;

import javax.persistence.Column;

public class SignupRequest {

    private String username;

    private String password;
    
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

	
}
