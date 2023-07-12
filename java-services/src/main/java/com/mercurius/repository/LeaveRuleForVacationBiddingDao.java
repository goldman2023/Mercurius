package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mercurius.models.LeaveRuleForVacationBidding;

@Repository
public interface LeaveRuleForVacationBiddingDao extends JpaRepository <LeaveRuleForVacationBidding,String>{
	
	 @Query("select s from LeaveRuleForVacationBidding s")
	    List<LeaveRuleForVacationBidding> getAll();
	 

}
