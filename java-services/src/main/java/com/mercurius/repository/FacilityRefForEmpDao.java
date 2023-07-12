package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mercurius.models.FacilityReferenceForEmployee;
import com.mercurius.models.FacilityReferenceForEmployeeChild1;

@Repository
public interface FacilityRefForEmpDao extends JpaRepository<FacilityReferenceForEmployee,Long> {
	
	@Query("select s.facilityabbr from FacilityReferenceForEmployee s")
    List<String> getAllFacilityAbbrevations();
	
	@Query("select s.facilityid from FacilityReferenceForEmployee s where s.facilityabbr =:facilityabbr")
    String getcorrectfacilityid(@Param("facilityabbr") String facilityabbr);
	
	@Query("select s from FacilityReferenceForEmployee s where s.facilitytypenameref =:facilitytypenameref")
    List<FacilityReferenceForEmployee> getfacilityBasedOnFacilityNames(@Param("facilitytypenameref") String facilitytypenameref);
	
	@Query("select new com.mercurius.models.FacilityReferenceForEmployeeChild1(s.facilityid, s.facilityname, s.facilityabbr) from FacilityReferenceForEmployee s")
    List<FacilityReferenceForEmployeeChild1> getFacilityNamesWithId();

}
