package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mercurius.models.LeaveRequest;

@Repository
public interface LeaveRequestDao extends JpaRepository<LeaveRequest, Long>{

	@Query("select s from LeaveRequest s where s.empId =:empId")
	List<LeaveRequest> getLeaveRequestByEmpId(Long empId);
	
	@Query("select s from LeaveRequest s where s.bidManagerId =:bidManagerId")
	List<LeaveRequest> getLeaveRequestByBidManagerId(Long bidManagerId);

}
