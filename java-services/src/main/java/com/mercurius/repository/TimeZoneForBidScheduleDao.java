package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mercurius.models.TimeZoneForBidSchedule;

@Repository
public interface TimeZoneForBidScheduleDao extends JpaRepository <TimeZoneForBidSchedule, String>{
	
	 @Query("select s from TimeZoneForBidSchedule s")
	    List<TimeZoneForBidSchedule> getAll();
	 
	 @Query("select s.acronym from TimeZoneForBidSchedule s where s.location =:location")
	    String getAcronym(String location);

}
