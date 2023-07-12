
  package com.mercurius.models;
  
  import java.util.ArrayList;
  import java.util.List; 
  import javax.persistence.CascadeType;
  import javax.persistence.Column;
  import javax.persistence.Entity;
  import javax.persistence.FetchType;
  import javax.persistence.GeneratedValue; 
  import javax.persistence.GenerationType; 
  import javax.persistence.Id;
  import javax.persistence.JoinColumn;
  import javax.persistence.OneToMany; 
  import javax.persistence.Table;

  
  @Entity  
  @Table(name = "shift_line_schedule") 
  public class Shiftlinescheduleparent {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "shift_line_schedule_id") 
  private Long sh_schedule_id;
  
  @Column(name = "shift_line_schedule_name")
  private String schedulename;
  
  @Column(name = "area_id")
  private int areaid;
  
  @Column(name = "user_id") 
  private Long userid;
  
  @Column(name = "shift_duration_parent") 
  private int shiftdurationp;
  
  @Column(name = "selection_status")
  private Boolean status;
  
  @OneToMany(cascade = CascadeType.ALL, fetch= FetchType.LAZY)
  @JoinColumn(name="sh_schedule_id_ref" , referencedColumnName ="shift_line_schedule_id")
  private List<Shiftlinechild> schild = new ArrayList<>();

	public Long getSh_schedule_id() {
		return sh_schedule_id;
	}
	
	public void setSh_schedule_id(Long sh_schedule_id) {
		this.sh_schedule_id = sh_schedule_id;
	}
	
	public String getSchedulename() {
		return schedulename;
	}
	
	public void setSchedulename(String schedulename) {
		this.schedulename = schedulename;
	}
	
	public int getAreaid() {
		return areaid;
	}
	
	public void setAreaid(int areaid) {
		this.areaid = areaid;
	}
	
	public Long getUserid() {
		return userid;
	}
	
	public void setUserid(Long userid) {
		this.userid = userid;
	}
	
	public int getShiftdurationp() {
		return shiftdurationp;
	}

	public void setShiftdurationp(int shiftdurationp) {
		this.shiftdurationp = shiftdurationp;
	}

	public List<Shiftlinechild> getSchild() {
		return schild;
	}
	
	public void setSchild(List<Shiftlinechild> schild) {
		this.schild = schild;
	}

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}
	
  
  }
 