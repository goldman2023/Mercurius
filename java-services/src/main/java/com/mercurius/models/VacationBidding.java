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
@Table(name = "vacation_bid_transaction_table")
public class VacationBidding {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "vacation_id")
	private long vacationid;
	
	@Column(name = "bid_status") 
	private String bidstatus;
	
	@Column(name = "window_status") 
	private String windowstatus;
	
	@Column(name = "bid_schedule_id_ref")
	private Long bidschidref;
	
	@Column(name = "bid_schedule_name")
	private String bidschename;

	@Column(name = "emp_id_ref")
	private Long empidref;
	
	@Column(name = "employee_operating_initials")
	private String initials;
	
	@Column(name = "bid_round_seq") 
	private int roundseq_id;
	
	@JsonFormat(pattern ="mm'min'")
	@Column(name = "vacation_selected_inhours")
	private int vcationhours;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "vacation_start_date")
	private Date vacationstartdate;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "vacation_end_date")
	private Date vacationenddate;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "actual_vacation_start_date")
	private Date actualvacationstartdate;
	
	@JsonFormat(pattern="yyyy-MM-dd")
	@Column(name = "actual_vacation_end_date")
	private Date actualvacationenddate;
	
	@Column(name = "total_rdos")
	private int rdos;

	@Column(name = "remaining_vacation_hours")
	private int vacation_hours_remain;
	
	@Column(name = "vacation_round_seq") 
	private int vacation_seq_no;
	
	@Column(name = "vacation_hours") 
	private int shift_vacation_hours;

	public VacationBidding() {
		super();
		// TODO Auto-generated constructor stub
	}

	public VacationBidding(long vacationid, String bidstatus, String windowstatus, Long bidschidref, String bidschename,
			Long empidref, String initials, int roundseq_id, int vcationhours, Date vacationstartdate,
			Date vacationenddate, Date actualvacationstartdate, Date actualvacationenddate, int rdos,
			int vacation_hours_remain, int vacation_seq_no, int shift_vacation_hours) {
		super();
		this.vacationid = vacationid;
		this.bidstatus = bidstatus;
		this.windowstatus = windowstatus;
		this.bidschidref = bidschidref;
		this.bidschename = bidschename;
		this.empidref = empidref;
		this.initials = initials;
		this.roundseq_id = roundseq_id;
		this.vcationhours = vcationhours;
		this.vacationstartdate = vacationstartdate;
		this.vacationenddate = vacationenddate;
		this.actualvacationstartdate = actualvacationstartdate;
		this.actualvacationenddate = actualvacationenddate;
		this.rdos = rdos;
		this.vacation_hours_remain = vacation_hours_remain;
		this.vacation_seq_no = vacation_seq_no;
		this.shift_vacation_hours = shift_vacation_hours;
	}

	public long getVacationid() {
		return vacationid;
	}

	public void setVacationid(long vacationid) {
		this.vacationid = vacationid;
	}

	public String getBidstatus() {
		return bidstatus;
	}

	public void setBidstatus(String bidstatus) {
		this.bidstatus = bidstatus;
	}

	public String getWindowstatus() {
		return windowstatus;
	}

	public void setWindowstatus(String windowstatus) {
		this.windowstatus = windowstatus;
	}

	public Long getBidschidref() {
		return bidschidref;
	}

	public void setBidschidref(Long bidschidref) {
		this.bidschidref = bidschidref;
	}

	public String getBidschename() {
		return bidschename;
	}

	public void setBidschename(String bidschename) {
		this.bidschename = bidschename;
	}

	public Long getEmpidref() {
		return empidref;
	}

	public void setEmpidref(Long empidref) {
		this.empidref = empidref;
	}

	public String getInitials() {
		return initials;
	}

	public void setInitials(String initials) {
		this.initials = initials;
	}

	public int getRoundseq_id() {
		return roundseq_id;
	}

	public void setRoundseq_id(int roundseq_id) {
		this.roundseq_id = roundseq_id;
	}

	public int getVcationhours() {
		return vcationhours;
	}

	public void setVcationhours(int vcationhours) {
		this.vcationhours = vcationhours;
	}

	public Date getVacationstartdate() {
		return vacationstartdate;
	}

	public void setVacationstartdate(Date vacationstartdate) {
		this.vacationstartdate = vacationstartdate;
	}

	public Date getVacationenddate() {
		return vacationenddate;
	}

	public void setVacationenddate(Date vacationenddate) {
		this.vacationenddate = vacationenddate;
	}

	public Date getActualvacationstartdate() {
		return actualvacationstartdate;
	}

	public void setActualvacationstartdate(Date actualvacationstartdate) {
		this.actualvacationstartdate = actualvacationstartdate;
	}

	public Date getActualvacationenddate() {
		return actualvacationenddate;
	}

	public void setActualvacationenddate(Date actualvacationenddate) {
		this.actualvacationenddate = actualvacationenddate;
	}

	public int getRdos() {
		return rdos;
	}

	public void setRdos(int rdos) {
		this.rdos = rdos;
	}

	public int getVacation_hours_remain() {
		return vacation_hours_remain;
	}

	public void setVacation_hours_remain(int vacation_hours_remain) {
		this.vacation_hours_remain = vacation_hours_remain;
	}

	public int getVacation_seq_no() {
		return vacation_seq_no;
	}

	public void setVacation_seq_no(int vacation_seq_no) {
		this.vacation_seq_no = vacation_seq_no;
	}

	public int getShift_vacation_hours() {
		return shift_vacation_hours;
	}

	public void setShift_vacation_hours(int shift_vacation_hours) {
		this.shift_vacation_hours = shift_vacation_hours;
	}

}
