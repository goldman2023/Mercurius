package com.mercurius.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mercurius.models.UserToLogin;


@Repository
public interface EmailVerify extends JpaRepository<UserToLogin, Long> {
	
	Optional<UserToLogin> findByUsername(String username);

	UserToLogin findByVerificationCode(String verificationCode);

}
