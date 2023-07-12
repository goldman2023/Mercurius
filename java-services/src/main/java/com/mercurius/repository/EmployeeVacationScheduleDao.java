package com.mercurius.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mercurius.models.EmployeeVacationSchedule;

@Repository
public interface EmployeeVacationScheduleDao extends JpaRepository<EmployeeVacationSchedule,Long> {
	

	@Query("select s from EmployeeVacationSchedule s where s.bidschIdRef =:bidschIdRef and s.vacationStartDate=:day")
	List<EmployeeVacationSchedule> getBasicWatchScheduleVacationByScheduleIdAndDate(Long bidschIdRef,Date day);
	
	@Query("select s from EmployeeVacationSchedule s where s.bidschIdRef =:bidschIdRef and :day between s.vacationStartDate and s.vacationEndDate")
	List<EmployeeVacationSchedule> getBasicWatchScheduleVacationByScheduleIdAndDateBetween(Long bidschIdRef,Date day);
	
	@Query("select s from EmployeeVacationSchedule s where s.bidschIdRef =:bidschIdRef and s.empIdRef=:empIdRef")
	List<EmployeeVacationSchedule> getVacationDetailsForTheEmpIdPassed(Long bidschIdRef,Long empIdRef);
}
