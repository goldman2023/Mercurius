package com.mercurius.models;

import java.sql.Time;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "window_transaction_table")
public class BidWindowDuration {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "duration_id")
	private long duid;
	
	@Column(name = "bid_schedule_id_ref")
	private Long bidschidref;
	
	@Column(name = "bid_schedule_name")
	private String bidschename;
	
	@Column(name = "emp_id_ref")
	private Long empidref;
	
	@Column(name = "employee_operating_initials")
	private String initials;
	
	@Column(name = "seniority_ranking")
	private long rank;
	
	@Column(name = "bid_round_seq") 
	private int roundseq_id;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "bid_round_start_date")
	private Date bidstartdate;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "bid_round_end_date")
	private Date bidenddate;
	
	@JsonFormat(pattern = "h:mm TT")
	@Column(name = "emp_bid_starttime")
	private Time bidstarttime;
	
	@JsonFormat(pattern = "h:mm TT")
	@Column(name ="emp_bid_endtime")
	private Time bidendtime;
	
	@JsonFormat(pattern ="mm'min'")
	@Column(name = "bid_round_duration")
	private Time empbidduration;
	
	@Column(name = "shiftline_bid_status") 
	private String shiftlinebidstatus;
	
	@Column(name = "emp_first_name")
	private String fname;
	
	@Column(name = "emp_last_name")
	private String lname;
	
	@Column(name = "emp_seq_id") 
	private int empseq_id;
	
	@JsonFormat(pattern = "yyyy-MM-dd h:mm:ss")
	@Column(name ="actual_emp_bid_starttime")
	private String empbid_start_time;
	
	@JsonFormat(pattern = "yyyy-MM-dd h:mm:ss")
	@Column(name ="actual_emp_bid_endtime")
	private String empbid_end_time;
	
	@Column(name = "transaction_seq_id") 
	private int trans_seq_id;	
	
	@Column(name = "vacation_bid_status") 
	private String vacationbidstatus;
	
	@JsonFormat(pattern = "yyyy-MM-dd h:mm:ss")
	@Column(name ="today_bidding_time")
	private String empbid_today_time;

	public BidWindowDuration() {
		super();
		// TODO Auto-generated constructor stub
	}

	public BidWindowDuration(long duid, Long bidschidref, String bidschename, Long empidref, String initials, long rank,
			int roundseq_id, Date bidstartdate, Date bidenddate, Time bidstarttime, Time bidendtime,
			Time empbidduration, String shiftlinebidstatus, String fname, String lname, int empseq_id,
			String empbid_start_time, String empbid_end_time, int trans_seq_id, String vacationbidstatus,String empbid_today_time) {
		super();
		this.duid = duid;
		this.bidschidref = bidschidref;
		this.bidschename = bidschename;
		this.empidref = empidref;
		this.initials = initials;
		this.rank = rank;
		this.roundseq_id = roundseq_id;
		this.bidstartdate = bidstartdate;
		this.bidenddate = bidenddate;
		this.bidstarttime = bidstarttime;
		this.bidendtime = bidendtime;
		this.empbidduration = empbidduration;
		this.shiftlinebidstatus = shiftlinebidstatus;
		this.fname = fname;
		this.lname = lname;
		this.empseq_id = empseq_id;
		this.empbid_start_time = empbid_start_time;
		this.empbid_end_time = empbid_end_time;
		this.trans_seq_id = trans_seq_id;
		this.vacationbidstatus = vacationbidstatus;
		this.empbid_today_time = empbid_today_time;
	}


	public long getDuid() {
		return duid;
	}

	public void setDuid(long duid) {
		this.duid = duid;
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

	public long getRank() {
		return rank;
	}

	public void setRank(long rank) {
		this.rank = rank;
	}

	public int getRoundseq_id() {
		return roundseq_id;
	}

	public void setRoundseq_id(int roundseq_id) {
		this.roundseq_id = roundseq_id;
	}

	public Date getBidstartdate() {
		return bidstartdate;
	}

	public void setBidstartdate(Date bidstartdate) {
		this.bidstartdate = bidstartdate;
	}

	public Date getBidenddate() {
		return bidenddate;
	}

	public void setBidenddate(Date bidenddate) {
		this.bidenddate = bidenddate;
	}

	public Time getBidstarttime() {
		return bidstarttime;
	}

	public void setBidstarttime(Time bidstarttime) {
		this.bidstarttime = bidstarttime;
	}

	public Time getBidendtime() {
		return bidendtime;
	}

	public void setBidendtime(Time bidendtime) {
		this.bidendtime = bidendtime;
	}

	public Time getEmpbidduration() {
		return empbidduration;
	}

	public void setEmpbidduration(Time empbidduration) {
		this.empbidduration = empbidduration;
	}

	public String getShiftlinebidstatus() {
		return shiftlinebidstatus;
	}

	public void setShiftlinebidstatus(String shiftlinebidstatus) {
		this.shiftlinebidstatus = shiftlinebidstatus;
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

	public int getEmpseq_id() {
		return empseq_id;
	}

	public void setEmpseq_id(int empseq_id) {
		this.empseq_id = empseq_id;
	}

	public String getEmpbid_start_time() {
		return empbid_start_time;
	}

	public void setEmpbid_start_time(String empbid_start_time) {
		this.empbid_start_time = empbid_start_time;
	}

	public String getEmpbid_end_time() {
		return empbid_end_time;
	}

	public void setEmpbid_end_time(String empbid_end_time) {
		this.empbid_end_time = empbid_end_time;
	}


	public int getTrans_seq_id() {
		return trans_seq_id;
	}


	public void setTrans_seq_id(int trans_seq_id) {
		this.trans_seq_id = trans_seq_id;
	}


	public String getVacationbidstatus() {
		return vacationbidstatus;
	}

	
	public void setVacationbidstatus(String vacationbidstatus) {
		this.vacationbidstatus = vacationbidstatus;
	}

	public String getEmpbid_today_time() {
		return empbid_today_time;
	}

	public void setEmpbid_today_time(String empbid_today_time) {
		this.empbid_today_time = empbid_today_time;
	}
	
	
}
