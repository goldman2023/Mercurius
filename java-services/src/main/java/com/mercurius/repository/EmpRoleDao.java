package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mercurius.models.EmployeeRole;
import com.mercurius.models.RoleChild;


public interface EmpRoleDao extends JpaRepository<EmployeeRole,Long> {
	
	@Query("select s.role_name from EmployeeRole s")
    List<Object> getRoleName();
	
	@Query("select s from EmployeeRole s")
    List<EmployeeRole> getAllRoleDetails();
	
	@Query("select new com.mercurius.models.RoleChild(s.id, s.role_name) from EmployeeRole s where s.status=:status")
    List<RoleChild> getActiveRoles(@Param("status") String status);

}
