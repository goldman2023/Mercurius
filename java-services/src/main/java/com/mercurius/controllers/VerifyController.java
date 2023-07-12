package com.mercurius.controllers;


import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.mercurius.models.UserToLogin;
import com.mercurius.repository.EmailVerify;
import com.mercurius.repository.PasswordRepositery;
import com.mercurius.security.services.PasswordService;
import com.mercurius.security.services.SmtpService;

@Controller
public class VerifyController {

	@Autowired
	private SmtpService service;
	
	@GetMapping("/verify")
	public String verifyUser(@Param("code") String code) {
		if (service.verify(code)) {
			return "verify_success";
		} else {
			return "verify_fail";
		}
	}
	
	@Autowired
	private PasswordService service2;
	
	@Autowired
	private EmailVerify emailverify;
	
	@GetMapping("/verifydone")
	public String verifyUser1(@Param("code") String code) {
		
		Optional<UserToLogin> userOptional = Optional
				.ofNullable(emailverify.findByVerificationCode(code));
		UserToLogin user = userOptional.get();
		String uname = user.getUsername(); // return user.getUsername();
		
		if (service2.verify(code)) {
			return "forgotpwd_success";
		} else {
			return "forgotpwd_fail";
		}
	}
	
	@Autowired
	private PasswordRepositery passwordDao;
	
	@GetMapping("/reset-password")
	public String showResetPasswordForm(@Param(value = "token") String token, Model model) {
		
		Optional<UserToLogin> userOptional = Optional
				.ofNullable(passwordDao.findByToken(token));
		
		if (!userOptional.isPresent()) {
			return "reset_fail";
		}

	    else
	    {
	    model.addAttribute("token", token);
	    return "reset_password_form";
	    }
	}
	
	public class Utility {
	    public String getSiteURL(HttpServletRequest request) {
	        String siteURL = request.getRequestURL().toString();
	        return siteURL.replace(request.getServletPath(), "");
	    }
	}
	
	@PostMapping("/reset_password")
	public String processResetPassword(HttpServletRequest request, Model model) {
		String token = request.getParameter("token");
	    String password = request.getParameter("password");
	    
	    Optional<UserToLogin> userOptional = Optional
				.ofNullable(passwordDao.findByToken(token));
	    if (!userOptional.isPresent()) 
	    {
	        return "reset_fail";
	    }
	     else {           
	    	//userOptional.updatePassword(customer, password);
	    	service2.resetPassword(token,password);
	         
	        model.addAttribute("message", "You have successfully changed your password.");
	        return "reset_success";
	    }
	     
	    
	   
	}
	
	
}
