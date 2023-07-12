package com.mercurius.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mercurius.models.UserToLogin;
import com.mercurius.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	UserRepository userRepository;

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserToLogin user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

		return UserDetailsImpl.build(user);
	}

	
	@Transactional
	public UserDetails loadUserByPhoneno(String phone)  {
		UserToLogin user = userRepository.findByPhone(phone)
				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with phone no: " + phone));

		return UserDetailsImpl.build(user);
	}

}
