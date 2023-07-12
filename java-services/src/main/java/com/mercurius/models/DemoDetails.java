package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "demo_details")
public class DemoDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "demoid")
	private Long did; 
	
	@Column(name = "first_name")
	private String fname;
	
	@Column(name = "last_name")
	private String lname;
	
	@Column(name = "phone_no")
	private String phone;
	
	@Column(name = "email_id")
	private String email;
	
	@Column(name = "company_name")
	private String company;
	
	@Column(name = "country_name")
	private String country;
	
	@Column(name = "details")
	private String notes;

	public DemoDetails() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getDid() {
		return did;
	}

	public void setDid(Long did) {
		this.did = did;
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

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public DemoDetails(Long did, String fname, String lname, String phone, String email, String company, String country,
			String notes) {
		super();
		this.did = did;
		this.fname = fname;
		this.lname = lname;
		this.phone = phone;
		this.email = email;
		this.company = company;
		this.country = country;
		this.notes = notes;
	}

	@Override
	public String toString() {
		return "DemoDetails [did=" + did + ", fname=" + fname + ", lname=" + lname + ", phone=" + phone + ", email="
				+ email + ", company=" + company + ", country=" + country + ", notes=" + notes + "]";
	}
	

}
