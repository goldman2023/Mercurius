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
@Table(name = "shiftline_bid_transaction_table")
public class ShiftlineBidding {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bidding_id")
	private long bidid;
	
	@Column(name = "bid_status") 
	private String bidstatus;
	
	@Column(name = "window_status") 
	private String windowstatus;
	
	@JsonFormat(pattern ="mm'min'")
	@Column(name = "window_duration")
	private Time empwindowduration;
	
	//@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
	//@JsonFormat(shape=JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS][.SS][.S]")
	@Column(name = "window_start")
	private String empwindowstartdateandtime;

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
	
	@Column(name = "shift_line_schedule_id_ref")
	private Long shiftidref;
	  
	@Column(name = "shift_line_schedule_name")
	private String schedulename;
	
	@Column(name = "shiftline_sequence") 
	private Long shiftseq_id;
	
	@Column(name = "shiftline_name") 
	private String shiftname;
		  
	@Column(name = "pattern") 
	private String pattern;
	
	@Column(name = "shift_line_id_ref")
	private Long shiftlineidref;
	  

	public ShiftlineBidding() {
		super();
		// TODO Auto-generated constructor stub
	}


	public ShiftlineBidding(long bidid, String bidstatus, String windowstatus, Time empwindowduration,
			String empwindowstartdateandtime, Long bidschidref, String bidschename, Long empidref, String initials,
			int roundseq_id, Long shiftidref, String schedulename, Long shiftseq_id, String shiftname, String pattern,
			Long shiftlineidref) {
		super();
		this.bidid = bidid;
		this.bidstatus = bidstatus;
		this.windowstatus = windowstatus;
		this.empwindowduration = empwindowduration;
		this.empwindowstartdateandtime = empwindowstartdateandtime;
		this.bidschidref = bidschidref;
		this.bidschename = bidschename;
		this.empidref = empidref;
		this.initials = initials;
		this.roundseq_id = roundseq_id;
		this.shiftidref = shiftidref;
		this.schedulename = schedulename;
		this.shiftseq_id = shiftseq_id;
		this.shiftname = shiftname;
		this.pattern = pattern;
		this.shiftlineidref = shiftlineidref;
	}




	public long getBidid() {
		return bidid;
	}

	public void setBidid(long bidid) {
		this.bidid = bidid;
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

	public Time getEmpwindowduration() {
		return empwindowduration;
	}

	public void setEmpwindowduration(Time empwindowduration) {
		this.empwindowduration = empwindowduration;
	}

	public String getEmpwindowstartdateandtime() {
		return empwindowstartdateandtime;
	}

	public void setEmpwindowstartdateandtime(String empwindowstartdateandtime) {
		this.empwindowstartdateandtime = empwindowstartdateandtime;
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

	public Long getShiftidref() {
		return shiftidref;
	}


	public void setShiftidref(Long shiftidref) {
		this.shiftidref = shiftidref;
	}


	public String getSchedulename() {
		return schedulename;
	}

	public void setSchedulename(String schedulename) {
		this.schedulename = schedulename;
	}
	

	public Long getShiftseq_id() {
		return shiftseq_id;
	}

	public void setShiftseq_id(Long shiftseq_id) {
		this.shiftseq_id = shiftseq_id;
	}

	public String getShiftname() {
		return shiftname;
	}

	public void setShiftname(String shiftname) {
		this.shiftname = shiftname;
	}

	public String getPattern() {
		return pattern;
	}

	public void setPattern(String pattern) {
		this.pattern = pattern;
	}


	public Long getShiftlineidref() {
		return shiftlineidref;
	}


	public void setShiftlineidref(Long shiftlineidref) {
		this.shiftlineidref = shiftlineidref;
	}

	
}
