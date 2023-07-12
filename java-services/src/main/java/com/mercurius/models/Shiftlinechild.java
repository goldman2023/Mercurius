
  package com.mercurius.models;
  
  import javax.persistence.Column;
  import javax.persistence.Entity;
  import javax.persistence.GeneratedValue; 
  import javax.persistence.GenerationType;
  import javax.persistence.Id; 
  import javax.persistence.Table;
  
  @Entity
  @Table(name = "shift_line") 
  public class Shiftlinechild {
  
  @Id 
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "shift_line_id") 
  private Long sh_line_id;
  
  @Column(name = "shiftline_sequence") 
  private Long seq_id;
  
  @Column(name = "mon_shift") 
  private String mon;
	
  @Column(name = "tue_shift") 
  private String tue;
	  
  @Column(name = "wed_shift") 
  private String wed;
	  
  @Column(name = "thu_shift") 
  private String thu;
	  
  @Column(name = "fri_shift") 
  private String fri;
	  
  @Column(name = "sat_shift") 
  private String sat;
	  
  @Column(name = "sun_shift") 
  private String sun;
	  
  @Column(name = "shiftline_name") 
  private String shiftname;
	  
  @Column(name = "pattern") 
  private String pattern;
  
  @Column(name = "sh_schedule_id_ref")
  private Long shidref;
  
  @Column(name = "shift_duration_child") 
  private int shiftdurationc;
  
  @Column(name = "mon2_shift") 
  private String monshift2;
	
  @Column(name = "tue2_shift") 
  private String tueshift2;
	  
  @Column(name = "wed2_shift") 
  private String wedshift2;
	  
  @Column(name = "thu2_shift") 
  private String thushift2;
	  
  @Column(name = "fri2_shift") 
  private String frishift2;
	  
  @Column(name = "sat2_shift") 
  private String satshift2;
	  
  @Column(name = "sun2_shift") 
  private String sunshift2;
	
	 

  public Long getSh_line_id() {
	return sh_line_id;
  }

  public void setSh_line_id(Long sh_line_id) {
	this.sh_line_id = sh_line_id;
  }

  public Long getSeq_id() {
	return seq_id;
  }

  public void setSeq_id(Long seq_id) {
	this.seq_id = seq_id;
  }

  public String getMon() {
	return mon;
  }

  public void setMon(String mon) {
	this.mon = mon;
  }

  public String getTue() {
	return tue;
  }

  public void setTue(String tue) {
	this.tue = tue;
  }

  public String getWed() {
	return wed;
  }

  public void setWed(String wed) {
	this.wed = wed;
  }

  public String getThu() {
	return thu;
  }

  public void setThu(String thu) {
	this.thu = thu;
  }

  public String getFri() {
	return fri;
  }

  public void setFri(String fri) {
	this.fri = fri;
  }

  public String getSat() {
	return sat;
  }

  public void setSat(String sat) {
	this.sat = sat;
  }

  public String getSun() {
	return sun;
  }

  public void setSun(String sun) {
	this.sun = sun;
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

	public Long getShidref() {
		return shidref;
	}
	
	public void setShidref(Long shidref) {
		this.shidref = shidref;
	}

	public int getShiftdurationc() {
		return shiftdurationc;
	}

	public void setShiftdurationc(int shiftdurationc) {
		this.shiftdurationc = shiftdurationc;
	}

	public String getMonshift2() {
		return monshift2;
	}

	public void setMonshift2(String monshift2) {
		this.monshift2 = monshift2;
	}

	public String getTueshift2() {
		return tueshift2;
	}

	public void setTueshift2(String tueshift2) {
		this.tueshift2 = tueshift2;
	}

	public String getWedshift2() {
		return wedshift2;
	}

	public void setWedshift2(String wedshift2) {
		this.wedshift2 = wedshift2;
	}

	public String getThushift2() {
		return thushift2;
	}

	public void setThushift2(String thushift2) {
		this.thushift2 = thushift2;
	}

	public String getFrishift2() {
		return frishift2;
	}

	public void setFrishift2(String frishift2) {
		this.frishift2 = frishift2;
	}

	public String getSatshift2() {
		return satshift2;
	}

	public void setSatshift2(String satshift2) {
		this.satshift2 = satshift2;
	}

	public String getSunshift2() {
		return sunshift2;
	}

	public void setSunshift2(String sunshift2) {
		this.sunshift2 = sunshift2;
	}
	
   
  }
 