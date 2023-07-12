package com.mercurius.repository;

import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.mercurius.models.BidScheduleParamParent;

@Repository
public interface BidScheduleParamParentDao extends JpaRepository <BidScheduleParamParent,Long>{
	
	@Query("select s.bidschename from BidScheduleParamParent s where s.bidmanagerid=:bidmanagerid")
    List<String> getData(@Param("bidmanagerid") Long bidmanagerid);
	
	@Query("select s from BidScheduleParamParent s where s.bidmanagerid =:bidmanagerid")
	List<Object> getBasedOnUserId(@Param("bidmanagerid") Long bidmanagerid);
	
	@Query("select s from BidScheduleParamParent s where (s.status =:status or s.status =:status1 or  s.status =:status2 or s.status =:status3) and s.bidmanagerid =:bidmanagerid")
	List<Object> getScheduledBidSchedulesBasedOnUserId(String status, String status1, String status2, String status3, @Param("bidmanagerid") Long bidmanagerid);
	
	@Query("select s from BidScheduleParamParent s where (s.status =:status1 or s.status =:status2) and s.bidmanagerid =:bidmanagerid")
	List<Object> getAssignedBidSchedulesBasedOnUserId( String status1, String status2, @Param("bidmanagerid") Long bidmanagerid);
	
	@Query("select s from BidScheduleParamParent s where s.bidmanagerid =:bidmanagerid and s.status = :status")
	List<Object> getBidSchedulesByUserIdAndBwsStatus(@Param("bidmanagerid") Long bidmanagerid, @Param("status") String status);
	
	@Query("select s from BidScheduleParamParent s where s.bidmanagerid =:bidmanagerid and s.status like %:status%")
	List<Object> getBidSchedulesByUserIdAndScheduleStatus(@Param("bidmanagerid") Long bidmanagerid, @Param("status") String status);


	@Query("select s from BidScheduleParamParent s where s.bidschid =:bidschid AND s.bidmanagerid =:bidmanagerid")
	List<Object> getbyBidschidandManagerid(Long bidschid, Long bidmanagerid);

	@Query("select s from BidScheduleParamParent s where s.bidschid =:bidschid")
	BidScheduleParamParent getbyNoOfRoundsBasedonBidschId(Long bidschid);
	
	@Query("select s.bidschid from BidScheduleParamParent s where s.bidmanagerid=:bidmanagerid")
    List<Object> getBidscheduleIds(Long bidmanagerid);
	
	@Query("select s from BidScheduleParamParent s where s.summaryemail=:summaryemail")
	List<BidScheduleParamParent> summaryemailinfo(String summaryemail);
	
	@Transactional
	@Modifying
    @Query("UPDATE BidScheduleParamParent s SET s.summaryemail = :summaryemail WHERE s.bidschid = :bidschid")
    void updateSummaryemailstatus(String summaryemail, Long bidschid);
	
	@Query("select s.bidschid from BidScheduleParamParent s where s.summaryemail=:summaryemail")
    List<Long> getBidids(String summaryemail);
	
	@Transactional
	@Modifying
    @Query("UPDATE BidScheduleParamParent s SET s.status = :status WHERE s.bidschid = :bidschid")
    void updateBasicWatchScheduleStatus(String status, Long bidschid);
	
	@Query("select s from BidScheduleParamParent s where s.bidschid =:bidschid and :day between s.bidschstartdate and s.bidschenddate")
	List<BidScheduleParamParent> getBidScheduleWithCurrentDate(Long bidschid,Date day);
	
	@Query("select s from BidScheduleParamParent s where s.bidmanagerid =:bidmanagerid and s.summaryemail = :summaryemail")
	List<BidScheduleParamParent> getBidSchedulesByUserIdAndBidSummaryStatus(@Param("bidmanagerid") Long bidmanagerid, @Param("summaryemail") String summaryemail);

	@Query("select s from BidScheduleParamParent s where s.bidschid =:bidschid")
	BidScheduleParamParent getBidScheduleDeatils(Long bidschid);
}
