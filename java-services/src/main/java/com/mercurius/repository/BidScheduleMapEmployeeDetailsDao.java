package com.mercurius.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mercurius.models.BidScheduleMapEmployeeDetails;

@Repository
public interface BidScheduleMapEmployeeDetailsDao extends JpaRepository<BidScheduleMapEmployeeDetails,Long> {

	@Query("select s from BidScheduleMapEmployeeDetails s where s.empidref =:empidref")
    List<Object> getBasedOnEmpId(@Param("empidref") Long empidref);
	
	@Query("select s from BidScheduleMapEmployeeDetails s where s.bidschref =:bidschref")
    List<Object> getBidSchid(@Param("bidschref") Long bidschref);

	@Transactional
	@Modifying
	@Query("DELETE from BidScheduleMapEmployeeDetails s where s.empidref=:empidref")
	void deleteByEmpId(@Param("empidref") Long empidref);

	@Query("select s from BidScheduleMapEmployeeDetails s where s.empidref =:empidref")
	Optional<BidScheduleMapEmployeeDetails> findByEmpId(@Param("empidref") Long empidref);
	
	@Query("select s from BidScheduleMapEmployeeDetails s where (s.bidschref is null or s.bidschref = :bidschref)")
	List<BidScheduleMapEmployeeDetails> getrecordsWhereBidScheduleIdIsNull(Long bidschref);
	
	@Transactional
	@Modifying
	@Query("DELETE from BidScheduleMapEmployeeDetails s where (s.bidschref is null or s.bidschref = :bidschref)")
	void deleterecordsWhereBidscheduleIdIsNull(Long bidschref);
	
	@Query("select s from BidScheduleMapEmployeeDetails s where s.bidschref = :bidschref and s.empidref =:empidref")
	List<BidScheduleMapEmployeeDetails> getEmployeesforBidscheduleId(Long bidschref,Long empidref);
	
	@Query("select s.empidref from BidScheduleMapEmployeeDetails s where s.bidschref = :bidschref")
	List<Object> getEmployeesforBidscheduleIdAlone(Long bidschref);
	
	@Query("select s.bidschref from BidScheduleMapEmployeeDetails s where s.empidref = :empidref")
	List<Object> getBidScheduleIdList(Long empidref);
	
	@Query("select s from BidScheduleMapEmployeeDetails s where s.empidref =:empidref")
    List<BidScheduleMapEmployeeDetails> getBidSchedulesBasedOnEmpId(@Param("empidref") Long empidref);
	
}
