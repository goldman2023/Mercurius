package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "federal_holidays")
public class FederalHolidays {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "federal_holiday_id")
	private Long id;
	
	@Column(name = "federal_holiday_year")
	private int year;
	
	@Column(name = "federal_holiday_date")
	private String date;
	
	@Column(name = "federal_holiday_day")
	private String day;
	
	@Column(name = "federal_holiday_name")
	private String name;
	
	public FederalHolidays() {
		super();
	}

	public FederalHolidays(Long id, int year, String date, String day, String name) {
		super();
		this.id = id;
		this.year = year;
		this.date = date;
		this.day = day;
		this.name = name;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getDay() {
		return day;
	}

	public void setDay(String day) {
		this.day = day;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "FederalHolidays [id=" + id + ", year=" + year + ", date=" + date + ", day=" + day + ", name=" + name
				+ "]";
	}
	
}
