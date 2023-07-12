package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mercurius.models.TransactionTable;

@Repository
public interface TransactionTableDao extends JpaRepository <TransactionTable,Long>{
	
	@Query("select s from TransactionTable s where s.role_id=:role_id")
    List<TransactionTable> getActionsBasedOnRoleId(@Param("role_id") Long role_id);
	
	@Query("select s from TransactionTable s where s.role_id=:role_id and s.permission_id=:permission_id")
    TransactionTable checkifroleidpermissionidcomboexists(Long role_id, Long permission_id);
	
	@Transactional
	@Modifying
	@Query("UPDATE TransactionTable s SET s.status=:status WHERE s.t_id = :t_id")
	void statusupdate(boolean status, long t_id);
	
	@Query("select s from TransactionTable s where s.role_id=:role_id and s.status=:status")
    List<TransactionTable> getActionsBasedOnRoleIdAndStatus(@Param("role_id") Long role_id, boolean status);

}
