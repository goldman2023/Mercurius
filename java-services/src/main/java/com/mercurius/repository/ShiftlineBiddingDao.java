package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mercurius.models.ShiftlineBidding;

@Repository
public interface ShiftlineBiddingDao extends JpaRepository<ShiftlineBidding,Long>{
	
	@Query("select s from ShiftlineBidding s where s.empidref=:empidref")
    List<Object> getData(@Param("empidref") Long empidref);
	
	@Query("select s from ShiftlineBidding s where s.bidschename=:bidschename")
    List<Object> getByName(@Param("bidschename") String bidschename);
    
    @Query("select s from ShiftlineBidding s where s.bidschename =:bidschename AND s.schedulename =:schedulename")
	List<Object> getbyNames(String bidschename, String schedulename);

    @Transactional
	@Modifying
	@Query("DELETE from ShiftlineBidding s where s.bidschidref=:bidschidref")
	void deleteByBidscheduleId(@Param("bidschidref") Long bidschidref);
    
    @Query("select s from ShiftlineBidding s where s.bidschidref=:bidschidref")
    List<Object> findByBidScheduleId(@Param("bidschidref") Long bidschidref);
    
	@Query("select s from ShiftlineBidding s where (s.bidschidref is null or s.bidschidref = :bidschidref)")
	List<ShiftlineBidding> getrecordsWhereBidScheduleIdIsNull(Long bidschidref);
	
	@Transactional
	@Modifying
	@Query("DELETE from ShiftlineBidding s where (s.bidschidref is null or s.bidschidref = :bidschidref)")
	void deleterecordsWhereBidscheduleIdIsNull(Long bidschidref);
	
	@Transactional
	@Modifying
    @Query("UPDATE ShiftlineBidding s SET s.initials = :initials WHERE s.empidref = :empidref")
    void updateInitials(String initials,Long empidref);
	
	@Query("select s from ShiftlineBidding s where s.bidschidref=:bidschidref and  s.empidref=:empidref and s.roundseq_id=:roundseq_id and s.bidstatus=:bidstatus")
    List<ShiftlineBidding> basedOnShiftStatus(@Param("bidschidref") Long bidschidref,@Param("empidref") Long empidref,@Param("roundseq_id") int roundseq_id,@Param("bidstatus") String bidstatus);
	
	@Query("select s from ShiftlineBidding s where s.bidschidref=:bidschidref and  s.empidref=:empidref and s.roundseq_id=:roundseq_id")
    List<ShiftlineBidding> getshiftdetails(Long bidschidref, Long empidref, int roundseq_id);
	
	@Query("select s from ShiftlineBidding s where s.shiftidref = :shiftidref and s.bidschidref =:bidschidref")
	List<ShiftlineBidding> getBasedOnShiftLineIdRefAndBidScheduleId(Long shiftidref, Long bidschidref);
	
	@Transactional
	@Modifying
    @Query("UPDATE ShiftlineBidding s SET s.windowstatus = :windowstatus WHERE s.shiftidref = :shiftidref and s.bidschidref = :bidschidref")
    void updateWindowStatus(String windowstatus,Long shiftidref, Long bidschidref);
	
	@Query("select s from ShiftlineBidding s where s.shiftidref = :shiftidref and s.windowstatus = :windowstatus")
	List<ShiftlineBidding> getBasedOnShiftLineIdRefAndStatus(Long shiftidref,String windowstatus);
	
	@Query("select s from ShiftlineBidding s where s.shiftidref = :shiftidref and s.windowstatus = :windowstatus and s.bidschidref = :bidschidref and s.shiftname not like %:shiftname%")
	List<ShiftlineBidding> getShifts(Long shiftidref,String windowstatus, String shiftname, Long bidschidref);
	
	@Transactional
	@Modifying
    @Query("UPDATE ShiftlineBidding s SET s.windowstatus = :windowstatus WHERE s.bidid = :bidid")
    void updateWindowStatusBasedonPrimaryId(String windowstatus,Long bidid);
	
	@Query("select s from ShiftlineBidding s where s.bidschidref = :bidschidref and s.shiftidref = :shiftidref and s.windowstatus = :windowstatus and s.shiftname not like %:shiftname1% and s.shiftname not like %:shiftname2%")
	List<ShiftlineBidding> getShiftsForTwoConditions(Long bidschidref, Long shiftidref,String windowstatus, String shiftname1, String shiftname2);
	
	@Query("select s from ShiftlineBidding s where s.shiftidref = :shiftidref and s.windowstatus = :windowstatus and s.shiftname like %:shiftname%")
	List<ShiftlineBidding> getShiftsBasedOnShiftName(Long shiftidref,String windowstatus, String shiftname);
	
	//select * from `ST-AWS-DEV`.shiftline_bid_transaction_table sbtt where (shiftline_name LIKE '%MT%' or shiftline_name LIKE '%TW%' ) and shift_line_schedule_id_ref =67;
	@Query("select s from ShiftlineBidding s where (s.shiftname like %:shiftname1% or s.shiftname like %:shiftname2%) and s.shiftidref = :shiftidref and s.bidschidref = :bidschidref")
	List<ShiftlineBidding> getShiftsBasedOnTwoShiftName(String shiftname1,String shiftname2, Long shiftidref, Long bidschidref);
	

}
