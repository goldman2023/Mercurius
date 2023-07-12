package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mercurius.models.BidLeaveChild;

@Repository
public interface BidLeaveChildDao extends JpaRepository<BidLeaveChild,Long>{
	
	@Query("select s from BidLeaveChild s where (s.bidschref is null or s.bidschref = :bidschref)")
	List<BidLeaveChild> getrecordsWhereBidScheduleIdIsNull(Long bidschref);
	
	@Transactional
	@Modifying
	@Query("DELETE from BidLeaveChild s where (s.bidschref is null or s.bidschref = :bidschref)")
	void deleterecordsWhereBidscheduleIdIsNull(Long bidschref);

}
