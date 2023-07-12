package com.mercurius.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mercurius.models.DemoDetails;

@Repository
public interface DemoDetailsDao extends JpaRepository<DemoDetails,Long> {

}
