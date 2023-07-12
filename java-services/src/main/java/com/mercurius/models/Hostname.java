package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "hostname_region")
public class Hostname {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "regid")
	private Long regionid; 
	
	@Column(name = "ip_address")
	private String ip;
	
	@Column(name = "url_name")
	private String url;
	
	public Long getRegionid() {
		return regionid;
	}

	public void setRegionid(Long regionid) {
		this.regionid = regionid;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Hostname() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Hostname(Long regionid, String ip, String url) {
		super();
		this.regionid = regionid;
		this.ip = ip;
		this.url = url;
	}

	@Override
	public String toString() {
		return "Hostname [regionid=" + regionid + ", ip=" + ip + ", url=" + url + "]";
	}
	
	
}
