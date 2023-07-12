package com.mercurius.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.mercurius.models.BidWindowDuration;

@Repository
public interface BidWindowDurationDao extends JpaRepository <BidWindowDuration,Long>{
	
	@Query("select s from BidWindowDuration s where s.empidref=:empidref")
    List<Object> getData(@Param("empidref") Long empidref);
	
	@Query("select s from BidWindowDuration s where s.bidschename=:bidschename")
    List<Object> getByName(@Param("bidschename") String bidschename);
	
	@Query("select s from BidWindowDuration s where s.bidschidref=:bidschidref")
    List<Object> getByBidId(@Param("bidschidref") Long bidschidref);

	@Transactional
	@Modifying
	@Query("DELETE from BidWindowDuration s where s.bidschidref=:bidschidref")
	void deleteByBidscheduleId(@Param("bidschidref") Long bidschidref);

	@Query("select s from BidWindowDuration s where s.bidschidref=:bidschidref")
    List<Object> findByBidScheduleId(@Param("bidschidref") Long bidschidref);
	//Optional<BidWindowDuration> findByBidScheduleId(Long id);
	
	@Query("select s from BidWindowDuration s where (s.bidschidref is null or s.bidschidref = :bidschidref)")
	List<BidWindowDuration> getrecordsWhereBidScheduleIdIsNull(Long bidschidref);
	
	@Transactional
	@Modifying
	@Query("DELETE from BidWindowDuration s where (s.bidschidref is null or s.bidschidref = :bidschidref)")
	void deleterecordsWhereBidscheduleIdIsNull(Long bidschidref);
	
	@Query("select s.empidref from BidWindowDuration s where s.bidschidref=:bidschidref")
    List<Long> getEmpIds(@Param("bidschidref") Long bidschidref);
	
	@Query("select s from BidWindowDuration s where s.bidschidref=:bidschidref and s.empidref=:empidref")
	List<Object> findByBidschIdandEmpId(Long bidschidref,Long empidref);
	
	@Query("select s from BidWindowDuration s where s.bidschidref=:bidschidref and s.empidref=:empidref and s.roundseq_id=:roundseq_id")
	Optional<BidWindowDuration> findByBidschIdandEmpIdandReoundId(Long bidschidref,Long empidref,int roundseq_id);
	
	
	@Query("select s from BidWindowDuration s where s.duid=:duid")
	Optional<BidWindowDuration> getDataofDurationId(Long duid);
	
	@Transactional
	@Modifying
    @Query("UPDATE BidWindowDuration s SET s.initials = :initials WHERE s.empidref = :empidref")
    void updateInitials(String initials,Long empidref);
	
	@Transactional
	@Modifying
    @Query("UPDATE BidWindowDuration s SET s.fname = :fname, s.lname = :lname WHERE s.empidref = :empidref")
    void updateNames(String fname,String lname, Long empidref);
	
	@Query("select s from BidWindowDuration s where s.empidref=:empidref and s.shiftlinebidstatus=:shiftlinebidstatus and s.bidschidref=:bidschidref")
	List<BidWindowDuration> getEmplyeedetailsBasedonshiftlineStatus(Long empidref,String shiftlinebidstatus,Long bidschidref);
	
	@Query("select s from BidWindowDuration s where s.bidschidref=:bidschidref and s.shiftlinebidstatus=:shiftlinebidstatus")
	List<BidWindowDuration> getEmplyeedetailsBasedonShiftlineStatus(Long bidschidref,String shiftlinebidstatus);
	
	@Transactional
	@Modifying
    @Query("UPDATE BidWindowDuration s SET s.empbid_start_time = :empbid_start_time, s.empbid_today_time =:empbid_today_time WHERE s.duid = :duid")
    void updatebiddingStartTime(String empbid_start_time,String empbid_today_time,Long duid);
	
	@Transactional
	@Modifying
    @Query("UPDATE BidWindowDuration s SET s.empbid_today_time =:empbid_today_time WHERE s.duid = :duid")
    void updatebiddingEndTime(String empbid_today_time,Long duid);
	
	@Transactional
	@Modifying
    @Query("UPDATE BidWindowDuration s SET s.vacationbidstatus = :vacationbidstatus, s.shiftlinebidstatus =:shiftlinebidstatus, s.empbid_today_time =:empbid_today_time WHERE s.duid = :duid")
    void updatebiddingStatus(String vacationbidstatus,String  shiftlinebidstatus, String empbid_today_time, Long duid);
	
	@Transactional
	@Modifying
    @Query("UPDATE BidWindowDuration s SET s.empbid_today_time = :empbid_today_time WHERE s.duid = :duid")
    void updatebiddingTodayTime(String empbid_today_time,Long duid);
	
	@Query("select s from BidWindowDuration s where s.bidschidref=:bidschidref and s.empidref=:empidref and s.roundseq_id =:roundseq_id and s.shiftlinebidstatus=:shiftlinebidstatus and s.vacationbidstatus=:vacationbidstatus")
	List<BidWindowDuration> getEmployeeIsAllocatedorNot(Long bidschidref,Long empidref,int roundseq_id,String shiftlinebidstatus,String vacationbidstatus);
	
	@Transactional
	@Modifying
    @Query("UPDATE BidWindowDuration s SET s.shiftlinebidstatus=:shiftlinebidstatus, s.vacationbidstatus = :vacationbidstatus WHERE s.duid = :duid")
    void updateShiftAndVacationStatus(String shiftlinebidstatus,String vacationbidstatus,Long duid);
	
	@Query("select s.duid from BidWindowDuration s where s.bidschidref=:bidschidref")
    List<Object> getPrimaryIds(Long bidschidref);
	
	@Query("select s.bidschidref from BidWindowDuration s where s.shiftlinebidstatus=:shiftlinebidstatus or s.vacationbidstatus=:vacationbidstatus")
    List<Object> getBidscheduleids(String shiftlinebidstatus, String vacationbidstatus );
	
	@Query("select s from BidWindowDuration s where s.bidschidref=:bidschidref and (s.shiftlinebidstatus=:shiftlinebidstatus or s.vacationbidstatus=:vacationbidstatus)")
	List<BidWindowDuration> getdetails(Long bidschidref,String shiftlinebidstatus,String vacationbidstatus);
	
	@Transactional
	@Modifying
    @Query("UPDATE BidWindowDuration s SET s.vacationbidstatus = :vacationbidstatus, s.shiftlinebidstatus =:shiftlinebidstatus WHERE s.duid = :duid")
    void updateIncompleteStatus(String vacationbidstatus,String  shiftlinebidstatus, Long duid);
	
	
	@Query("select s from BidWindowDuration s where s.bidschidref=:bidschidref and s.empidref=:empidref")
	Optional<BidWindowDuration> findByBidschIdEmpId(Long bidschidref,Long empidref);
	
	
	@Query("select s.empidref from BidWindowDuration s where s.bidschidref=:bidschidref")
	List<Object>getallEmpids(Long bidschidref);
	
	
	@Query("select s from BidWindowDuration s where s.shiftlinebidstatus=:shiftlinebidstatus and s.vacationbidstatus=:vacationbidstatus and s.bidschidref=:bidschidref")
	List<BidWindowDuration> getEligibleStatus(String shiftlinebidstatus, String vacationbidstatus,Long bidschidref);
	
	@Query("select s from BidWindowDuration s where s.bidschidref=:bidschidref")
	Optional<BidWindowDuration> findBidScheduleId(Long bidschidref);
	
}
