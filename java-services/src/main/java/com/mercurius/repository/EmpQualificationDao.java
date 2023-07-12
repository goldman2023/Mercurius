package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mercurius.models.EmployeeQualification;

@Repository
public interface EmpQualificationDao extends JpaRepository<EmployeeQualification,Long> {

	@Query("select s.qual_description from EmployeeQualification s")
    List<Object> getQualificationDesciption();
	
}
