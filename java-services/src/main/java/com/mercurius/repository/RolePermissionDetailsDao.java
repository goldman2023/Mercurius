package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.mercurius.models.PermissionChild;
import com.mercurius.models.RolePermissionDetails;

@Repository
public interface RolePermissionDetailsDao extends JpaRepository<RolePermissionDetails, Long>{
	
	@Query("select s from RolePermissionDetails s")
	List<RolePermissionDetails> getmoduleactionnames();
	
	@Query("select new com.mercurius.models.PermissionChild(s.p_id, s.modu_name,s.act_name,s.func_name) from RolePermissionDetails s where s.status=:status")
    List<PermissionChild> getAllActions(String status);
	
	@Query("select DISTINCT s.modu_name from RolePermissionDetails s")
	List<String> getmodulenames();
	

}
