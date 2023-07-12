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
@Table(name = "ref_faa_business_rules")
public class RefFaaBusinessRules {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;
	
	@Column(name = "Parameter")
	private String parameter;
	
	@Column(name = "Value")
	private Long value;
	
	@Column(name = "Description")
	private String description;
	
	@Column(name = "Shift_Length")
	private Long shift_length;
	

	public RefFaaBusinessRules() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getValue() {
		return value;
	}

	public void setValue(Long value) {
		this.value = value;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getParameter() {
		return parameter;
	}

	public void setParameter(String parameter) {
		this.parameter = parameter;
	}

	public Long getShift_length() {
		return shift_length;
	}

	public void setShift_length(Long shift_length) {
		this.shift_length = shift_length;
	}

	

	public RefFaaBusinessRules(Long id, Long value, Long shift_length, String description, String parameter) {
		super();
		this.id = id;
		this.value = value;
		this.shift_length = shift_length;
		this.description = description;
		this.parameter = parameter;
	}

	@Override
	public String toString() {
		return "RefFaaBusinessRules [id=" + id + ", value=" + value + ", description=" + description + ", parameter=" + parameter
				+ ", shift_length=" + shift_length + "]";
	}

}
