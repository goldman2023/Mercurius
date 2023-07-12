package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mercurius.models.RefFaaBusinessRules;

public interface BusinessRuleDao extends JpaRepository <RefFaaBusinessRules,Long> {
    @Query("select s from RefFaaBusinessRules s")
    List<RefFaaBusinessRules> getBusinessRules();

}
