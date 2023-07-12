package com.mercurius.models;

public class WorkSheetChildForShift {
	
	private String date;
	
	private int time;

	private int duration;

	private String rdoDayOff;

	public WorkSheetChildForShift() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public int getTime() {
		return time;
	}

	public void setTime(int time) {
		this.time = time;
	}

	public int getDuration() {
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}

	public String getRdoDayOff() {
		return rdoDayOff;
	}

	public void setRdoDayOff(String rdoDayOff) {
		this.rdoDayOff = rdoDayOff;
	}

	public WorkSheetChildForShift(String date, int time, int duration, String rdoDayOff) {
		super();
		this.date = date;
		this.time = time;
		this.duration = duration;
		this.rdoDayOff = rdoDayOff;
	}

	@Override
	public String toString() {
		return "WorkSheetChildForShift [date=" + date + ", time=" + time + ", duration=" + duration + ", rdoDayOff="
				+ rdoDayOff + "]";
	}
	

}
