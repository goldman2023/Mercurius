package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mercurius.models.EmployeeBasicWatchSchedule;

@Repository
public interface EmployeeBasicWatchScheduleDao extends JpaRepository<EmployeeBasicWatchSchedule, Long>{
	
	@Query("select s from EmployeeBasicWatchSchedule s where s.bidscheduleid =:bidscheduleid")
	List<Object> checkIfBidscheduleIdIsPosted(Long bidscheduleid);
	
	@Query("select s from EmployeeBasicWatchSchedule s where s.bidscheduleid = :bidscheduleid and s.date between :from and :to")
	List<Object> getBasicWatchScheduleByScheduleIdAndDateRange(Long bidscheduleid, String from, String to);

	@Query("select s from EmployeeBasicWatchSchedule s where s.bidscheduleid = :bidscheduleid and s.empid = :empid and s.date between :from and :to")
	List<Object> getBasicWatchScheduleByScheduleIdAndDateRangeAndEmpId(Long bidscheduleid,Long empid, String from, String to);
	
	@Query("select s from EmployeeBasicWatchSchedule s where s.bidscheduleid = :bidscheduleid and s.date = :shiftdate")
	List<Object> getBasicWatchScheduleByScheduleIdAndDate(Long bidscheduleid, String shiftdate);
	
	@Query("select s from EmployeeBasicWatchSchedule s where s.bidscheduleid =:bidscheduleid and s.empid=:empid")
	List<EmployeeBasicWatchSchedule> getShiftDetailsForTheEmpIdPassed(Long bidscheduleid,Long empid);
	
	@Query("select s from EmployeeBasicWatchSchedule s where s.bidscheduleid =:bidscheduleid and s.empid=:empid and s.date between :from and :to")
	List<EmployeeBasicWatchSchedule> getShiftDetailsForTheBidScheduleIdEmpIdDatePassed(Long bidscheduleid,Long empid,String from, String to);
}
