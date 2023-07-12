package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "country_details")
public class CountryDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "country_id")
	private Long cid; //empid
	
	@Column(name = "country_name")
	private String cname;

	public CountryDetails() {
		super();
		// TODO Auto-generated constructor stub
	}

	public CountryDetails(Long cid, String cname) {
		super();
		this.cid = cid;
		this.cname = cname;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getCname() {
		return cname;
	}

	public void setCname(String cname) {
		this.cname = cname;
	}

	@Override
	public String toString() {
		return "CountryDetails [cid=" + cid + ", cname=" + cname + "]";
	}
	

}
