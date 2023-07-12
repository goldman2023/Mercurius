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
@Table(name = "Bid_Round")
public class BidRoundChild {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bid_round_id")
	private long bidroundid;
	
	@Column(name = "bid_schedule_id_ref")
	private Long bidschref;
	
	@JsonFormat(pattern ="mm'min'")
	@Column(name = "bid_round_duration")
	private Time roundduration;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "bid_round_start_date")
	private Date roundstartdate;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "bid_round_end_date")
	private Date roundenddate;
	
	@JsonFormat(pattern = "h:mm TT")
	@Column(name = "bid_daily_starttime")
	private Time roundstarttime;
	
	@JsonFormat(pattern = "h:mm TT")
	@Column(name ="bid_daily_endtime")
	private Time roundendttime;
	
	@Column(name = "bid_leave_rules_reason")
	private String bidleavereason;
	
	@Column(name = "bid_round_seq") 
	private int roundseq_id;
	
	@JsonFormat(pattern = "h:mm TT")
	@Column(name ="actual_bid_round_starttime")
	private Time actual_bidround_start_time;
	
	@JsonFormat(pattern = "h:mm TT")
	@Column(name ="actual_bid_round_endtime")
	private Time actual_bidround_end_time;

	public long getBidroundid() {
		return bidroundid;
	}

	public void setBidroundid(long bidroundid) {
		this.bidroundid = bidroundid;
	}

	public Long getBidschref() {
		return bidschref;
	}

	public void setBidschref(Long bidschref) {
		this.bidschref = bidschref;
	}

	public Time getRoundduration() {
		return roundduration;
	}

	public void setRoundduration(Time roundduration) {
		this.roundduration = roundduration;
	}

	public Date getRoundstartdate() {
		return roundstartdate;
	}

	public void setRoundstartdate(Date roundstartdate) {
		this.roundstartdate = roundstartdate;
	}

	public Date getRoundenddate() {
		return roundenddate;
	}

	public void setRoundenddate(Date roundenddate) {
		this.roundenddate = roundenddate;
	}

	public Time getRoundstarttime() {
		return roundstarttime;
	}

	public void setRoundstarttime(Time roundstarttime) {
		this.roundstarttime = roundstarttime;
	}

	public Time getRoundendttime() {
		return roundendttime;
	}

	public void setRoundendttime(Time roundendttime) {
		this.roundendttime = roundendttime;
	}

	public String getBidleavereason() {
		return bidleavereason;
	}

	public void setBidleavereason(String bidleavereason) {
		this.bidleavereason = bidleavereason;
	}

	public int getRoundseq_id() {
		return roundseq_id;
	}

	public void setRoundseq_id(int roundseq_id) {
		this.roundseq_id = roundseq_id;
	}

	public Time getActual_bidround_start_time() {
		return actual_bidround_start_time;
	}

	public void setActual_bidround_start_time(Time actual_bidround_start_time) {
		this.actual_bidround_start_time = actual_bidround_start_time;
	}

	public Time getActual_bidround_end_time() {
		return actual_bidround_end_time;
	}

	public void setActual_bidround_end_time(Time actual_bidround_end_time) {
		this.actual_bidround_end_time = actual_bidround_end_time;
	}

}
