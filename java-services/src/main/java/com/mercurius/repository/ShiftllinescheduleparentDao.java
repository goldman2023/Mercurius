
  package com.mercurius.repository;
  
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mercurius.models.Shiftlinescheduleparent;
  
  @Repository 
  public interface ShiftllinescheduleparentDao extends JpaRepository<Shiftlinescheduleparent,Long> {
  
	  @Query("select s from Shiftlinescheduleparent s where s.userid =:userid")
	    List<Object> getShlineSchByUserId(@Param("userid") Long userid);
	 
	  
	  @Query("select s from Shiftlinescheduleparent s where s.sh_schedule_id =:sh_schedule_id")
	    List<Object> getShlineSchByScheduleId(@Param("sh_schedule_id") Long sh_schedule_id);
	 
	  
	  @Query("select s.schedulename from Shiftlinescheduleparent s where s.userid=:userid")
	    List<String> getData(@Param("userid") Long userid);
		
	  
	  @Query("select s from Shiftlinescheduleparent s where s.schedulename =:schedulename AND s.userid=:userid")
	    List<Object> getbasedonUserIdandScheduleName(@Param("schedulename") String schedulename,@Param("userid") Long userid);


	  @Query("select s from Shiftlinescheduleparent s where s.sh_schedule_id =:sh_schedule_id")
	    List<Object> getbyId(@Param("sh_schedule_id") Long sh_schedule_id);
	
	  @Query("select s from Shiftlinescheduleparent s where s.userid =:userid and s.status =:status")
	  	List<Object> getShlineSchByUserIdandStatus(Long userid,boolean status);
  
  }
 