package com.mercurius.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mercurius.models.AddBidManager;

@Repository
public interface AddBidManagerDao extends JpaRepository<AddBidManager, Long>{
	
	@Query("select s from AddBidManager s where s.email =:email")
	AddBidManager getInfoForEmail(@Param("email") String email);
	
	@Query("select s from AddBidManager s where s.userIdRef =:userIdRef")
	AddBidManager getByUserIdRef(@Param("userIdRef") Long userIdRef);

}
