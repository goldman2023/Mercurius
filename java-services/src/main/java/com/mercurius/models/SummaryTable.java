package com.mercurius.models;

import java.sql.Time;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "summary")
public class SummaryTable {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sid")
	private long summaryid;

	@Column(name = "bid_schedule_id_ref")
	private Long bidschidref;
	
	@Column(name = "bid_schedule_name")
	private String bidschename;

	@Column(name = "emp_id_ref")
	private Long empidref;
	
	@Column(name = "employee_operating_initials")
	private String initials;
	
	
	@Column(name = "shift_line_schedule_id_ref")
	private Long shiftidref;
	  
	@Column(name = "shift_line_schedule_name")
	private String schedulename;
	
	@Column(name = "shiftline_sequence") 
	private Long shiftseq_id;
	
	@Column(name = "shift_line_id_ref")
	private Long shiftlineidref;
	  

	

}
