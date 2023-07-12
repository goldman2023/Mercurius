package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mercurius.models.FacilityType;
import com.mercurius.models.FacilityTypeChild;

@Repository
public interface FacilityTypeDao extends JpaRepository<FacilityType,Long> {
	
	@Query("select new com.mercurius.models.FacilityTypeChild(s.facilitytype_id, s.facilitytype_name) from FacilityType s")
    List<FacilityTypeChild> getFacilityTypeNames();

}
