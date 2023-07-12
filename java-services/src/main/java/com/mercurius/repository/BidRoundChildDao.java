package com.mercurius.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mercurius.models.BidRoundChild;

@Repository
public interface BidRoundChildDao extends JpaRepository<BidRoundChild,Long> {

	
	@Query("select s from BidRoundChild s where s.bidschref =:bidschref")
    List<Object> getBidRoundbyBidScheduleId(@Param("bidschref") Long bidschref);
	
	@Query("select s from BidRoundChild s where (s.bidschref is null or s.bidschref = :bidschref)")
	List<BidRoundChild> getrecordsWhereBidScheduleIdIsNull(Long bidschref);
	
	@Transactional
	@Modifying
	@Query("DELETE from BidRoundChild s where (s.bidschref is null or s.bidschref = :bidschref)")
	void deleterecordsWhereBidscheduleIdIsNull(Long bidschref);
	
	@Query("select s from BidRoundChild s where s.bidschref =:bidschref and s.roundseq_id =:roundseq_id")
	BidRoundChild getTimeBasedonBidIdandRoundseq(Long bidschref, int roundseq_id);

}
