package com.mercurius.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mercurius.models.PayPeriodMaster;

@Repository
public interface PayPeriodDao extends JpaRepository<PayPeriodMaster,Long> {
	
    @Query("select p from PayPeriodMaster p where DATE(:date) between DATE(p.start_date) and DATE(p.end_date)")
    PayPeriodMaster findPayPeriodInfoByDate( String date);
    
    @Query("select p from PayPeriodMaster p where p.year =:year")
    List<PayPeriodMaster> getPayPeriodDetailsBasedOnYear(long year);
    
    @Query("select p from PayPeriodMaster p where p.start_date =:start_date and p.end_date=:end_date and p.name=:name and p.year=:year")
    Optional<PayPeriodMaster> getPayPeriodDetailsBasedOnAllDetails(String start_date, String end_date, String name, long year);
    
}
