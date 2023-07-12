package com.mercurius.models;

import javax.persistence.Column;
import javax.persistence.Entity;
//import javax.persistence.GeneratedValue;
//import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "leave_rules_for_vacationbidding")
public class LeaveRuleForVacationBidding {

	
	@Id
	//@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "leave_rule")
	private String leaverule;
	
	@Column(name = "max_hours_allocated")
	private int maxhrsallocated;

	public LeaveRuleForVacationBidding() {
		//super();
		// TODO Auto-generated constructor stub
	}

	public String getLeaverule() {
		return leaverule;
	}

	public void setLeaverule(String leaverule) {
		this.leaverule = leaverule;
	}

	public int getMaxhrsallocated() {
		return maxhrsallocated;
	}

	public void setMaxhrsallocated(int maxhrsallocated) {
		this.maxhrsallocated = maxhrsallocated;
	}

	public LeaveRuleForVacationBidding(String leaverule, int maxhrsallocated) {
		super();
		this.leaverule = leaverule;
		this.maxhrsallocated = maxhrsallocated;
	}
	
}
