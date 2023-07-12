package com.mercurius.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mercurius.models.Hostname;

@Repository
public interface HostnameDao extends JpaRepository<Hostname,Long> {

}
