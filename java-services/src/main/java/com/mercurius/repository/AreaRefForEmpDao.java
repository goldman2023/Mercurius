package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.mercurius.models.AreaChild;
import com.mercurius.models.AreaReferenceForEmployee;

public interface AreaRefForEmpDao extends JpaRepository<AreaReferenceForEmployee,Long> {

	@Query("select s.areaname from AreaReferenceForEmployee s where s.facilityidref =:facilityidref ")
    List<String> getAllAreaNames(@Param("facilityidref") Long facilityidref);
	
	@Query("select s.areaid from AreaReferenceForEmployee s where s.areaname =:areaname and s.facilityidref =:facilityidref")
    String getcorrectareaid(@Param("areaname") String areaname,@Param("facilityidref") Long facilityidref);

	@Query("select s from AreaReferenceForEmployee s where s.facilityidref =:facilityidref ")
    List<AreaReferenceForEmployee> getAreaBasedonFacilityId(@Param("facilityidref") Long facilityidref);
	
	@Query("select new com.mercurius.models.AreaChild(s.areaid, s.areaname) from AreaReferenceForEmployee s")
    List<AreaChild> getAreaNames();
	
	@Query("select new com.mercurius.models.AreaChild(s.areaid, s.areaname) from AreaReferenceForEmployee s where s.facilityidref =:facilityidref")
    List<AreaChild> getAreaNamesBasedOnFacilityId(@Param("facilityidref") Long facilityidref);
	
	@Query("select s.areaname from AreaReferenceForEmployee s where s.areaid =:areaid ")
    List<Object> getAreaNameBasedOnAreaId(Long areaid);
}
