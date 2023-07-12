package com.mercurius.security.services;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mercurius.models.UserToLogin;

public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L;

	private Long id;

	private String username;

	@JsonIgnore
	private String password;
	
	private String phone;
	
	private String verificationCode;
	
	private boolean enabled;
	
	private String firstname;
	
	private String lastname;
	
	private long role_id_ref;
	
	private String start_date;
	
	private String end_date;
	
	private long trial_period;
	
	private Collection<? extends GrantedAuthority> authorities;


	public UserDetailsImpl(Long id, String username, String password, String phone, String verificationCode,
			boolean enabled, String firstname, String lastname, long role_id_ref, String start_date, String end_date,
			long trial_period) {
		super();
		this.id = id;
		this.username = username;
		this.password = password;
		this.phone = phone;
		this.verificationCode = verificationCode;
		this.enabled = enabled;
		this.firstname = firstname;
		this.lastname = lastname;
		this.role_id_ref = role_id_ref;
		this.start_date = start_date;
		this.end_date = end_date;
		this.trial_period = trial_period;
		//this.authorities = authorities;
	}

	public static UserDetailsImpl build(UserToLogin user) {
		/*List<GrantedAuthority> authorities = user.getRoles().stream()
				.map(role -> new SimpleGrantedAuthority(role.getName().name()))
				.collect(Collectors.toList());*/

		return new UserDetailsImpl(
				user.getId(), 
				user.getUsername(),
				user.getPassword(),
				user.getPhone(),
				user.getVerificationCode(),
				user.isEnabled(),
				user.getFirstname(),
				user.getLastname(),
				user.getRole_id_ref(),
				user.getStart_date(),
				user.getEnd_date(),
				user.getTrial_period()
				//,authorities
				);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	public Long getId() {
		return id;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return username;
	}
	
	public String getPhone() {
		return phone;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public String getVerificationCode() {
		return verificationCode;
	}

	public String getFirstname() {
		return firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public long getRole_id_ref() {
		return role_id_ref;
	}

	public String getStart_date() {
		return start_date;
	}

	public String getEnd_date() {
		return end_date;
	}

	public long getTrial_period() {
		return trial_period;
	}
	
	public boolean getEnabled() {
		return enabled;
	}

		/*@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		UserDetailsImpl user = (UserDetailsImpl) o;
		return Objects.equals(id, user.id);
	}*/
	

}
