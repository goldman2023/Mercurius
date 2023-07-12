package com.mercurius.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mercurius.models.FederalHolidays;

@Repository
public interface FederalHolidaysDao extends JpaRepository<FederalHolidays, Long>{

}
