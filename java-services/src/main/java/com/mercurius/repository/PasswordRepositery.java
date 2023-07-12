package com.mercurius.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mercurius.models.UserToLogin;


public interface PasswordRepositery extends JpaRepository<UserToLogin, Long> {
	
	UserToLogin findByToken(String token);

	UserToLogin findByUsername(String username);

}
