package com.mercurius.models;


import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name="bidschedule_shiftlineschedule_map" )
public class BidScheduleMapShiftlineSchedule {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bid_and_shift_map_id")
	private long bidshiftmapid;
	
	@Column(name = "bid_schedule_id_ref")
	private Long bidschref ;
	
	@Column(name = "shift_line_schedule_id_ref")
	private Long shiftdefref;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "shiftline_schedule_start_date")
	private Date shiftdefstartdate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "shiftline_schedule_end_date")
	private Date shiftdefenddate;
	
	@Column(name = "shiftlineschedule_selection_status")
	private Boolean selectionStatus;

	public long getBidshiftmapid() {
		return bidshiftmapid;
	}

	public void setBidshiftmapid(long bidshiftmapid) {
		this.bidshiftmapid = bidshiftmapid;
	}

	public Long getBidschref() {
		return bidschref;
	}

	public void setBidschref(Long bidschref) {
		this.bidschref = bidschref;
	}

	public Long getShiftdefref() {
		return shiftdefref;
	}

	public void setShiftdefref(Long shiftdefref) {
		this.shiftdefref = shiftdefref;
	}

	public Date getShiftdefstartdate() {
		return shiftdefstartdate;
	}

	public void setShiftdefstartdate(Date shiftdefstartdate) {
		this.shiftdefstartdate = shiftdefstartdate;
	}

	public Date getShiftdefenddate() {
		return shiftdefenddate;
	}

	public void setShiftdefenddate(Date shiftdefenddate) {
		this.shiftdefenddate = shiftdefenddate;
	}

	public Boolean getSelectionStatus() {
		return selectionStatus;
	}

	public void setSelectionStatus(Boolean selectionStatus) {
		this.selectionStatus = selectionStatus;
	}
	
}
