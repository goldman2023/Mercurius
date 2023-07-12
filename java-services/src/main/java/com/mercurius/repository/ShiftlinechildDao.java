
  package com.mercurius.repository;
  
  import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mercurius.models.Shiftlinechild;
  
  @Repository 
  public interface ShiftlinechildDao extends JpaRepository<Shiftlinechild,Long> {

	@Query("select s from Shiftlinechild s where s.shidref=:shidref")
	List<Object> getbyId(@Param("shidref") Long shidref);
	
  
  }
 