package com.mercurius.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mercurius.models.AddEmployee;

@Repository
public interface AddEmployeeDao extends JpaRepository<AddEmployee, Long>{

	Optional<AddEmployee> findByEmail(String email);
	
	Boolean existsByInitials(String initials);
	
	@Query("select s from AddEmployee s where s.email =:email")
    List<Object> getInfoForEmail(@Param("email") String email);
	
	@Query("select s from AddEmployee s where s.email =:email")
    AddEmployee getInfoForEmailAlone(@Param("email") String email);
	
	@Query("select s from AddEmployee s where s.qualification =:qualification")
    List<Object> getNamesBasedOnQualification(@Param("qualification") String qualification);
	
	@Query("select s.managerid from AddEmployee s where s.qualification =:qualification")
    List<Long> getUserIdsBasedOnQualification(@Param("qualification") String qualification);
	
	@Query("select s from AddEmployee s where s.managerid =:managerid and s.status =:status")
    List<Object> getNamesBasedOnUserId(@Param("managerid") Long managerid, short status);

	@Query("select e, a.areaname, f.facilityabbr from AddEmployee e " +
		       "left join AreaReferenceForEmployee a on e.areaid = a.id " +
		       "left join FacilityReferenceForEmployee f on a.facilityidref = f.id " +
		       "where e.managerid = :managerid")
	List<Object[]> getEmployeesWithAreaAndFacilityNamesByManagerId(@Param("managerid") Long managerid);


	@Query("select s.initials from AddEmployee s where s.managerid =:managerid")
    List<String> getInitialsList(@Param("managerid") Long managerid);
	
	@Query("select s from AddEmployee s where s.email =:email")
    Optional<AddEmployee> getDetailForEmail(@Param("email") String email);

	@Query("select s from AddEmployee s where s.managerid =:managerid and s.initials =:initials")
	List<Object> getEmployeedetailsbyInitials(Long managerid, String initials);
	
	@Query("select s from AddEmployee s where s.empid =:empid")
    Optional<AddEmployee> getDetailForEmpId(@Param("empid") Long empid);
	
	@Transactional
	@Modifying
	@Query("UPDATE AddEmployee s SET s.role =:role WHERE s.empid = :empid")
	void EmployeeToBidManager(long role, long empid);
	
	@Transactional
	@Modifying
	@Query("UPDATE AddEmployee s SET s.status =:status WHERE s.empid = :empid")
	void EmployeeStatusChange(short status, @Param("empid") long empid);
	
	@Query("select s from AddEmployee s where s.managerid =:managerid")
    List<Object> getEmpNamesBasedOnUserId(@Param("managerid") Long managerid);
    
    @Query("select distinct s.areaid from AddEmployee s")
    List<Object> distinctAreaIds();
    
    @Query("select s from AddEmployee s where s.userIdRef =:userIdRef")
    AddEmployee getDetailForUserIdRef(long userIdRef);
	
    /*@Query("select a.empidref, s.fname, s.lname from AddEmployee s" +
		       "left join BidScheduleMapEmployeeDetails a on s.empid = a.empidref" +
		       "where a.bidschref = :bidschref")
	List<Object> getEmployees(@Param("bidschref") Long bidschref);*/
}
