package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mercurius.models.VacationBidding;

@Repository
public interface VacationBiddingDao extends JpaRepository<VacationBidding,Long>  {
	
	@Query("select s from VacationBidding s where s.bidschidref =:bidschidref")
    List<Object> getbyBidScheduleId(@Param("bidschidref") Long bidschidref);
	
	@Transactional
	@Modifying
	@Query("DELETE from VacationBidding s where s.bidschidref=:bidschidref")
	void deleteByBidscheduleId(@Param("bidschidref") Long bidschidref);
	
	@Query("select s from VacationBidding s where s.bidschidref=:bidschidref")
    List<Object> findByBidScheduleId(@Param("bidschidref") Long bidschidref);
	
	@Query("select s from VacationBidding s where s.empidref=:empidref")
    List<Object> getbyEmployeeId(@Param("empidref") Long empidref);
	
	@Query("select s from VacationBidding s where (s.bidschidref is null or s.bidschidref = :bidschidref)")
	List<VacationBidding> getrecordsWhereBidScheduleIdIsNull(Long bidschidref);
	
	@Transactional
	@Modifying
	@Query("DELETE from VacationBidding s where (s.bidschidref is null or s.bidschidref = :bidschidref)")
	void deleterecordsWhereBidscheduleIdIsNull(Long bidschidref);
	
	@Transactional
	@Modifying
    @Query("UPDATE VacationBidding s SET s.initials = :initials WHERE s.empidref = :empidref")
    void updateInitials(String initials,Long empidref);
	
	@Query("select s from VacationBidding s where s.bidschidref=:bidschidref and  s.empidref=:empidref and s.roundseq_id=:roundseq_id and s.bidstatus=:bidstatus")
    List<VacationBidding> basedOnVacationStatus(@Param("bidschidref") Long bidschidref,@Param("empidref") Long empidref,@Param("roundseq_id") int roundseq_id,@Param("bidstatus") String bidstatus);
	
	@Query("select s from VacationBidding s where s.bidschidref=:bidschidref and  s.empidref=:empidref and s.roundseq_id=:roundseq_id")
    List<VacationBidding> getvacationdetails(Long bidschidref, Long empidref, int roundseq_id);
	
	@Query("select s from VacationBidding s where s.bidschidref =:bidschidref")
    List<VacationBidding> getbyBidScheduleIdRef(long bidschidref);


}
