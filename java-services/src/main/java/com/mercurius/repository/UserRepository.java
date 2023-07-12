package com.mercurius.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mercurius.models.UserToLogin;

@Repository
public interface UserRepository extends JpaRepository<UserToLogin, Long> 
{
	Optional<UserToLogin> findByUsername(String username);

	Boolean existsByUsername(String username);

	Optional<UserToLogin> findByPhone(String phone);

	Boolean existsByPhone(String phone);
	
	@Query("select s from UserToLogin s where s.username =:username")
    List<Object> getIdForEmail(@Param("username") String username);
	

	@Query("select s from UserToLogin s where s.username =:username")
	Optional<UserToLogin> getdetailForEmail(@Param("username") String username);
	
	@Transactional
	@Modifying
    @Query("UPDATE UserToLogin s SET s.firstname = :firstname, s.lastname =:lastname, s.role_id_ref =:role_id_ref WHERE s.username = :username")
    void updateNames(String firstname,String lastname, long role_id_ref, String username);
	
	// @Query("select case when s.username =:username then true else false end from UserToLogin s where s.username =:username")
	  //Boolean existsByEmail(String username);
	 
	  @Query("SELECT s from UserToLogin s where s.id =:id ")       // using @query
	  Optional<UserToLogin> getTheFirstname(Long id);
	  
	  @Query("select s from UserToLogin s where s.username =:username")
	  List<Object> getInfoForEmail(@Param("username") String username);
		
	  @Query("select s from UserToLogin s where s.id =:id")
	  List<Object> getbyManagerId(@Param("id") Long id);
	  
	  @Transactional
		@Modifying
	    @Query("UPDATE UserToLogin s SET s.role_id_ref =:role_id_ref WHERE s.id = :id")
	    void UserToBidManager(long role_id_ref, Long id);
	  
}
