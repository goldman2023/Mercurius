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
@Table(name = "Bid_Leave")
public class BidLeaveChild {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bid_leave_id")
	private long bidleaveid;
	
	@Column(name = "bid_schedule_id_ref")
	private Long bidschref;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "bid_leave_start_date")
	private Date leavestartdate;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "bid_leave_end_date")
	private Date leaveenddate;
	
	@Column(name = "bid_leave_slot_count")
	private int leaveslots;
	
	@Column(name = "bid_leave_seq") 
	private int leaveseq_id;

	public long getBidleaveid() {
		return bidleaveid;
	}

	public void setBidleaveid(long bidleaveid) {
		this.bidleaveid = bidleaveid;
	}

	public Long getBidschref() {
		return bidschref;
	}

	public void setBidschref(Long bidschref) {
		this.bidschref = bidschref;
	}

	public Date getLeavestartdate() {
		return leavestartdate;
	}

	public void setLeavestartdate(Date leavestartdate) {
		this.leavestartdate = leavestartdate;
	}

	public Date getLeaveenddate() {
		return leaveenddate;
	}

	public void setLeaveenddate(Date leaveenddate) {
		this.leaveenddate = leaveenddate;
	}

	public int getLeaveslots() {
		return leaveslots;
	}

	public void setLeaveslots(int leaveslots) {
		this.leaveslots = leaveslots;
	}

	public int getLeaveseq_id() {
		return leaveseq_id;
	}

	public void setLeaveseq_id(int leaveseq_id) {
		this.leaveseq_id = leaveseq_id;
	}
	
}
