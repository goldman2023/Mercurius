package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.mercurius.models.CountryDetails;

@Repository
public interface CountryDetailsDao extends JpaRepository<CountryDetails,Long>{
	
	@Query("select s.cname from CountryDetails s")
    List<Object> getCountryName(String cname);

}
