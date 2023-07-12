package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "time_zone_for_bidschedule")
public class TimeZoneForBidSchedule {
	
	@Id
	//@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "location_name")
	private String location;
	
	@Column(name = "time_zone_name")
	private String timezone;
	
	@Column(name = "time_zone_acronym")
	private String acronym;

	public TimeZoneForBidSchedule() {
		//super();
		// TODO Auto-generated constructor stub
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getTimezone() {
		return timezone;
	}

	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}

	public String getAcronym() {
		return acronym;
	}

	public void setAcronym(String acronym) {
		this.acronym = acronym;
	}

	public TimeZoneForBidSchedule(String location, String timezone, String acronym) {
		super();
		this.location = location;
		this.timezone = timezone;
		this.acronym = acronym;
	}
	

}
