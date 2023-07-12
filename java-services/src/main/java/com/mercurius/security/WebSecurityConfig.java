package com.mercurius.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.mercurius.security.jwt.AuthEntryPointJwt;
import com.mercurius.security.jwt.AuthTokenFilter;
import com.mercurius.security.services.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
		// securedEnabled = true,
		// jsr250Enabled = true,
		prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	UserDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	@Override
	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
		authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}

	@Value("${env.cors.origins}")
	private String corsOrigins;

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable()
			.exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
			.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
			.authorizeRequests().antMatchers("/authenticate","/register","/emailexist","/forgot-password","/forgot-password/**",
					"/resetpassword","/authenticatebyphone"
					,"/phoneexist","/checkuserinfo","/verify*","/shiftdefbyuserid/**","/verifydone/**","/verifydoneforregister/**")
			.permitAll()
			.antMatchers("/shiftline","/shiftline/**","/allshiftline",
			"/shiftdefinition","/shiftdefinition/**","/allshiftdefinition","/shiftdefinitionexclude/**",
			"/logindetails","/login/**","/shiftdefinitionbyuserid/**","/hello","/letsverifybyusername/**","/**","/forgotpasswordemailverify/*",
			"/trynew/*","/shiftnamecheckdemo","/shiftlineschedulename","/shiftlinebasedonname","/shiftnamewithid","/query",
			"/employeedetails", "/employee/**", "/employeequalification","/employeerole","/getallrole","/getallqualification","/findidforemail/**",
			"/deletebyschedulename/**","/allschedulenamesforuserid/**","/employeeall","/employeeinitialslist/**","/employeeidlist/**",
			"/employeeinitialexist/**","/bidparams","/bidparamssave","/bidparamsmoresave","/bidparamschedulenameexist/**","/bidparamupdatemore",
			"bidparamupdateone/**","/bidparamschedulenamelist/**","/bidparamdatelist/**","/bitptlleaveget","/bidptlleave","/bidptlleavebasedonbidid/**",
			"/bidptlleavebasedonschedulename/**","bitnptlleaveget","bidnptlleave","/bidnptlleavebasedonbidid","/bidnptlleavebasedonschedulename/**",
			"/bidroundget","/bidroundsave","/bidroundbasedonschedulename/**","/bidparambasedonuserid/**","/bidptlleavebasedonuserid/**",
			"/bidnptlleavebasedonuserid/**","/bidroundebasedonuserid/**","/bidparamupdatbybidid/**","/bidparamupdatebyuserid/**","/bidparamdeletebyuserid/**",
			"/bidparamdeletebybidschedulename/**","/bidparamdeletebybidid/**","/bidptlupdatebyptlid/**","bidptlupdatebyuserid/**","/bidptlupdatebyschedulename/**",
			"/bidnptlupdatebynptlid/**","/bidnptlupdatebyuserid/**","/bidnptlupdatebyschedulename/**","/bidroundbyid/**","/bidroundbyuserid/**","/bidroundbyschedulename/**",
			"/bidleave","/bidleavesave","/bidleavebasedonschedulename/**","/bidleavedeletebyshname/**","/bidrounddeletebyshname/**","/mergeget","/mergeone","/mergemany",
			"/mergedeletebyshname/**","/mergegetbyshname/**","/bidleavebyshname/**","/bidleavebyid/**","/bidleavebyuserid/**","/bidleavedeletebyuserid/**","/bidleavedeletebyleaveid/**",
			"/bidrounddeletebyuserid/**","/bidrounddeletebyroundid/**","/bidparamupdatebyschedulename/**","/bidparamdeletebyschedulename/**","/employeelistbasedonuserid/**",
			"/bidparamscheduleemployeelist/**","/shiftlinepost","/shiftlinebasedonuserid/**","/shiftlineput/**","/shiftlinedelete/**","/shiftlinechildget/**","/shiftlinechildpost",
			"/shiftlinechildput/**","/shiftlinechilddelete/**","/shiftnamecheck","/shiftlinebasedonshid/**","/shiftlinebyschedulenameuserid/**","/employeeinitialcheck/**",
			"/employeedetailsupdate","/employeedetailsupdatebyempid/**","/bidparampost","/bidparamget/**","/bidparamput/**","/bidparamdelete/**","/bidparamemployeeget/**",
			"/bidparamemployeepost","/bidparamemployeeput/**","/bidparamemployeedelete/**","/bidparamshifteget/**","/bidparamshiftpost","/bidparamshiftput/**","/bidparamshiftdelete/**",
			"/bidparamleaveget/**","/bidparamleavepost","/bidparamleaveput/**","/bidparamleavedelete/**","/bidparamroundget/**","/bidparamroundpost","/bidparamroundput/**","bidparamrounddelete/**",
			"/checkingnew","/bidparamemployeepostmore","/bidparamshiftpostmore","/bidparamleavepostmore","/bidparamroundpostmore","/bidschedulenamecheck/**","/bidparambasedonloggeduserid/**",
			"/bidparambasedonempid/**","/bidparamgetallempidbasedonbidschid/**","/employeedetailbasedonempid/**","/bidschedulidandmanageridcombo/**","/bidparamroundgetbybidscheduleid/**","/bidwindowdurationpost",
			"/bidwindowdurationgetbyempid/**","bidwindowdurationgetbydurationid/**","/bidwindowdurationgetbybidschname/**","/bidwindowdurationgetbybidschid/**","/bidwindowdurationupdatebyid/**","/bidwindowdurationupdatebyempid/**",
			"/biddingpost","/biddingpostmore","/biddingbasedonempid/**","biddingbasedonschname/**","/biddingupdatebyempid/**","/biddingbasedonbothnames","/shiftlinechildgetbybidschid/**","/biddingupdatebybidid/**","/bidvacationget/**",
			"/bidvacationpost","/bidvacationgetbybidscheduleid/**","/employeedetailsupdatebymanagerid/**","/employeedetailsdeletebybyempid/**","/bidparamemployeedeletebyempid/**","/bidmanagerpost","/bidmanagergetbymanagerid/**","/bidmanagergetbyemail/**",
			"/bidparamputmore","/bidwindowdurationdelete/**","/biddingdeletion/**","/checkbidmanageroremployee/**","/bidscheduleidrefnull/**","/bidparamroundputmore","/notificationfornewuser/**","/changeemployeetobidmanager/**","/biddingputmore",
			"/biddingbasedonbidscheduleidref/**,"+ "","/employeeemailexist/**","/deletebasedonbidingid/**","/employeedetailsbasedoninitialsandmanagerid/**","/notificationforbidwindowalloctaion/**","/backendserviceoutputview/**","/notificationforbidschedulechanged/**",
			"/notificationforbidscheduleincreased/**","/notificationforbidschedulecomplete/**","/getfacilitynames","/getareanames/**","/getareaid/**","/getfacilityid/**","/getshiftdefbasedonduration/**","/postoneshiftdefshiftdefinitions","/postmoreshiftdefshiftdefinitions",
			"/getallleaverules","/getalltimezones","/checkinbothdefinitionstable/**","/checkbothstatus/**","/biddingbasedonshiftstatus/**","/biddingbasedonvacationstatus/**","/bidvacationpostmore","/notificationforsystemcomplete/**","/notificationforskipvacation/**",
			"/backendserviceoutputviewformanager/**","/notificationfortrialregister/**","/savedemodetails/**","/getcountryname/**","/chronejob","/notificationforbidwindomissed","/identify","/notificationforbidsummary","/notificationforbidschedulechangedemployeedeleted/**",
			"/getallroledetails","/updateroledetails/**","/saveroledetails","/postmethodforrole","/getrolebyid/**","/rolepermissions/**","/activeroles/**","/allactions/**","/addroleswithmodule","/getactionbasedonroleid/**","/getmodulenames","/qualificationdetailssave",
			"qualificationdetailsupdate/**","/getallfacilitytypedetails","/savefacilitytypedetails","/updatefacilitytypedetails/**","/getallfacilitystates","/savefacilitystatedetails","/updatefacilitystatedetails/**","/getallshiftcategorydetails","/saveshiftcategorydetails",
			"/updateshiftcategorydet/ails/**","/getallfacilitytypenames","/getfacilitybasedonname/**","/getareanamesforfacilityid/**","/getsystemdefshiftdefbyid/**","/getallsystemdef","/getareanames","/getallshiftcategorynames","/getshiftduration","/federal_holidays",
			"/basicwatch/**","/bidscheduleidpassed/**","/baiscwatchschedulestatuschange/**","/employee/**","/saveworkforcedetails","/getworkforcebasedonid/**","getworkforcebasedonshiftlinescheduleid/**","/getfacilitynameswithid","/getareanamesbasedonfacilityid/**","/getareanamebasedonareaid/**",
			"/employeelistbasedonmanagerid","/basicwatchcronjob","/bidschedulesbyuseridandbwsstatus","/basicwatch/**","/vacationpostbid","/facilityareadropdown","/getworkforcebasedonshiftlinescheduledayandid/**","/basicwatchvacation/**","/shiftdefbyuseridandstatus/**","/userauthentication",
			"/shiftdefbyaliasname/*","/leaverequest/*","/leaverequestfromempid/*","/leaverequesttobidmanagerid/**","/leaverequestsave","/leaverequestupdate/*","/getuserdetails/*","/getactivepermissionsforroleid/*","/bidmanageridpassed/*","bidmanagerdataupdate/*","/managerdetailsofanemployee/*",
			"/getbidscheduledetailsbasedonempid/*",
			
			//payroll master services
			"/payperiodupdate/*","/payperiodpost","/payperiod/*","/payperiodbyyear/**","/payperiodupdatemore",
			
			//shiftlinescheduleid
			"/shiftlinebasedonuseridandselectionstatus/**",
			
			//employeenotes
			"/employeenotes/**","/employeedetailsdeletebybyempidandsubmiteeddate/**","employeedetailsdeletebybynotesid/**"
			

			).permitAll()

			.anyRequest().authenticated();

		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(corsOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
