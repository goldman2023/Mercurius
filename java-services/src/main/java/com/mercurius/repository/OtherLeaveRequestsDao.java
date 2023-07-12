package com.mercurius.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mercurius.models.OtherLeaveRequests;

@Repository
public interface OtherLeaveRequestsDao extends JpaRepository <OtherLeaveRequests,Long> {

}
