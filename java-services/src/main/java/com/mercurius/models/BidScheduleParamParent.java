package com.mercurius.models;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mercurius.enums.BidRoundOption;

@Entity
@Table(name = "Bid_Schedule")
public class BidScheduleParamParent {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bid_schedule_id")
	private long bidschid;

	@Column(name = "bid_schedule_name")
	private String bidschename;

	@Column(name = "bid_manager_id")
	private Long bidmanagerid;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "bid_schedule_start_date")
	private Date bidschstartdate;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	@Column(name = "bid_schedule_end_date")
	private Date bidschenddate;

	@Column(name = "bid_scheudle_save_status") // 1-TRUE saved //0-FALSE not saved
	private int schedulesavestatus;

	@Column(name = "bid_leave_save_status") // 1-TRUE saved //0-FALSE not saved
	private int leavesavestatus;

	@Column(name = "bid_round_save_status") // 1-TRUE saved //0-FALSE not saved
	private int roundsavestatus;

	@Column(name="bid_leave_count")
	private long totalbidleaves ;

	@Column(name="bid_round_count")
	private long totalbidrounds ;

	@Column(name = "bid_schedule_timezone")
	private String timezone;

	@Column(name = "weekend_include_exclude_status") // 1-TRUE Exclude weekends //0 -Include weekends(default)
	private int weekendstatus;

	@Column(name = "bid_summary_email_sent")
	private String summaryemail;

	@Column(name = "interval_start_time")
	private Time intervalstarttime;
	
	@Column(name = "interval_duration")
	private Time intervalduration;

	@Column(name = "has_interval")
	private Boolean hasinterval;
	
	@Column(name = "schedule_status")
	private String status;//value should be either "Bidding Scheduled" or "Shifts Assigned"

	@Enumerated(EnumType.ORDINAL)
	@Column(name = "bid_round_option", columnDefinition = "integer default 0")
	private BidRoundOption bidroundoption = BidRoundOption.SAME;

	@OneToMany(cascade = CascadeType.ALL, fetch= FetchType.LAZY)
	  @JoinColumn(name="bid_schedule_id_ref" , referencedColumnName ="bid_schedule_id")
	  private List<BidScheduleMapShiftlineSchedule> shiftdefmap = new ArrayList<>();

	@OneToMany(cascade = CascadeType.ALL, fetch= FetchType.LAZY)
	  @JoinColumn(name="bid_schedule_id_ref" , referencedColumnName ="bid_schedule_id")
	  private List<BidScheduleMapEmployeeDetails> employeemap = new ArrayList<>();

	@OneToMany(cascade = CascadeType.ALL, fetch= FetchType.LAZY)
	  @JoinColumn(name="bid_schedule_id_ref" , referencedColumnName ="bid_schedule_id")
	  private List<BidLeaveChild> leavemap = new ArrayList<>();

	@OneToMany(cascade = CascadeType.ALL, fetch= FetchType.LAZY)
	  @JoinColumn(name="bid_schedule_id_ref" , referencedColumnName ="bid_schedule_id")
	  private List<BidRoundChild> roundmap = new ArrayList<>();



	public long getBidschid() {
		return bidschid;
	}

	public void setBidschid(long bidschid) {
		this.bidschid = bidschid;
	}

	public String getBidschename() {
		return bidschename;
	}

	public void setBidschename(String bidschename) {
		this.bidschename = bidschename;
	}

	public Long getBidmanagerid() {
		return bidmanagerid;
	}

	public void setBidmanagerid(Long bidmanagerid) {
		this.bidmanagerid = bidmanagerid;
	}

	public Date getBidschstartdate() {
		return bidschstartdate;
	}

	public void setBidschstartdate(Date bidschstartdate) {
		this.bidschstartdate = bidschstartdate;
	}

	public Date getBidschenddate() {
		return bidschenddate;
	}

	public void setBidschenddate(Date bidschenddate) {
		this.bidschenddate = bidschenddate;
	}

	public int getSchedulesavestatus() {
		return schedulesavestatus;
	}

	public void setSchedulesavestatus(int schedulesavestatus) {
		this.schedulesavestatus = schedulesavestatus;
	}

	public int getLeavesavestatus() {
		return leavesavestatus;
	}

	public void setLeavesavestatus(int leavesavestatus) {
		this.leavesavestatus = leavesavestatus;
	}

	public int getRoundsavestatus() {
		return roundsavestatus;
	}

	public void setRoundsavestatus(int roundsavestatus) {
		this.roundsavestatus = roundsavestatus;
	}

	public List<BidScheduleMapShiftlineSchedule> getShiftdefmap() {
		return shiftdefmap;
	}

	public void setShiftdefmap(List<BidScheduleMapShiftlineSchedule> shiftdefmap) {
		this.shiftdefmap = shiftdefmap;
	}

	public List<BidScheduleMapEmployeeDetails> getEmployeemap() {
		return employeemap;
	}

	public void setEmployeemap(List<BidScheduleMapEmployeeDetails> employeemap) {
		this.employeemap = employeemap;
	}

	public List<BidLeaveChild> getLeavemap() {
		return leavemap;
	}

	public void setLeavemap(List<BidLeaveChild> leavemap) {
		this.leavemap = leavemap;
	}

	public List<BidRoundChild> getRoundmap() {
		return roundmap;
	}

	public void setRoundmap(List<BidRoundChild> roundmap) {
		this.roundmap = roundmap;
	}

	public long getTotalbidleaves() {
		return totalbidleaves;
	}

	public void setTotalbidleaves(long totalbidleaves) {
		this.totalbidleaves = totalbidleaves;
	}

	public long getTotalbidrounds() {
		return totalbidrounds;
	}

	public void setTotalbidrounds(long totalbidrounds) {
		this.totalbidrounds = totalbidrounds;
	}

	public String getTimezone() {
		return timezone;
	}

	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}

	public int getWeekendstatus() {
		return weekendstatus;
	}

	public void setWeekendstatus(int weekendstatus) {
		this.weekendstatus = weekendstatus;
	}

	public String getSummaryemail() {
		return summaryemail;
	}

	public void setSummaryemail(String summaryemail) {
		this.summaryemail = summaryemail;
	}

	public Time getIntervalstarttime() {
		return intervalstarttime;
	}

	public void setIntervalstarttime(Time intervalstarttime) {
		this.intervalstarttime = intervalstarttime;
	}

	public Boolean getHasinterval() {
		return hasinterval;
	}

	public void setHasinterval(Boolean hasinterval) {
		this.hasinterval = hasinterval;
	}

	public BidRoundOption getBidroundoption() {
		return bidroundoption;
	}

	public void setBidroundoption(BidRoundOption bidroundoption) {
		this.bidroundoption = bidroundoption;
	}
	
	public Time getIntervalduration() {
		return intervalduration;
	}

	public void setIntervalduration(Time intervalduration) {
		this.intervalduration = intervalduration;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
}
