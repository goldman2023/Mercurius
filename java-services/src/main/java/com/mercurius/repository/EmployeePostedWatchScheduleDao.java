package com.mercurius.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mercurius.models.EmployeePostedWatchSchedule;

@Repository
public interface EmployeePostedWatchScheduleDao extends JpaRepository<EmployeePostedWatchSchedule, Long>{

}
