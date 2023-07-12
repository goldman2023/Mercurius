package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mercurius.models.BidScheduleMapShiftlineSchedule;

@Repository
public interface BidScheduleMapShiftlineScheduleDao extends JpaRepository<BidScheduleMapShiftlineSchedule,Long> {
	
	@Query("select s from BidScheduleMapShiftlineSchedule s where (s.bidschref is null or s.bidschref = :bidschref)")
	List<BidScheduleMapShiftlineSchedule> getrecordsWhereBidScheduleIdIsNull(Long bidschref);
	
	@Transactional
	@Modifying
	@Query("DELETE from BidScheduleMapShiftlineSchedule s where (s.bidschref is null or s.bidschref = :bidschref)")
	void deleterecordsWhereBidscheduleIdIsNull(Long bidschref);
	
	@Query("select s.shiftdefref from BidScheduleMapShiftlineSchedule s where s.bidschref = :bidschref")
	List<Long> getShiftLineScheduleIdRefs(Long bidschref);
	
	@Query("select s from BidScheduleMapShiftlineSchedule s where s.shiftdefref = :shiftdefref and s.bidschref = :bidschref")
	BidScheduleMapShiftlineSchedule getShiftLineScheduledates(Long shiftdefref, Long bidschref);

}
