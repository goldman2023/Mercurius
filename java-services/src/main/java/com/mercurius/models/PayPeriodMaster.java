package com.mercurius.models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "pay_period_master")
public class PayPeriodMaster {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pay_period_uuid")
	private Long uuid;
	
	@Column(name = "pay_period_year")
	private Long year;
	
	@Column(name = "pay_period_number")
	private Long number;
	
	@Column(name = "pay_period_name")
	private String name;
	
	// @JsonFormat(pattern = "yyyy-MM-dd")
	@Column(name ="pay_period_start_date")
	private String start_date;
	
	// @JsonFormat(pattern = "yyyy-MM-dd")
	@Column(name ="pay_period_end_date")
	private String end_date;

	public PayPeriodMaster() {
		super();
	}

	public Long getUuid() {
		return uuid;
	}

	public void setUuid(Long uuid) {
		this.uuid = uuid;
	}

	public Long getYear() {
		return year;
	}

	public void setYear(Long year) {
		this.year = year;
	}

	public Long getNumber() {
		return number;
	}

	public void setNumber(Long number) {
		this.number = number;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public PayPeriodMaster(Long uuid, Long year, Long number, String name, String start_date, String end_date) {
		super();
		this.uuid = uuid;
		this.year = year;
		this.number = number;
		this.name = name;
		this.start_date = start_date;
		this.end_date = end_date;
	}

	@Override
	public String toString() {
		return "PayPeriosMaster [uuid=" + uuid + ", year=" + year + ", number=" + number + ", name=" + name
				+ ", start_date=" + start_date + ", end_date=" + end_date + "]";
	}

}
