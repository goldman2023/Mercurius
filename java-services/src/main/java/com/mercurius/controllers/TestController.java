package com.mercurius.controllers;

import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mercurius.models.BidLeaveChild;
import com.mercurius.models.BidRoundChild;
import com.mercurius.models.BidScheduleMapEmployeeDetails;
import com.mercurius.models.BidScheduleMapShiftlineSchedule;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.BidWindowDuration;
import com.mercurius.models.DemoDetails;
import com.mercurius.models.EmployeeQualification;
import com.mercurius.models.EmployeeRole;
import com.mercurius.models.FacilityType;
import com.mercurius.models.FacilityTypeChild;
import com.mercurius.models.LeaveRuleForVacationBidding;
import com.mercurius.models.PermissionChild;
import com.mercurius.models.RoleChild;
import com.mercurius.models.RolePermissionDetails;
import com.mercurius.models.ShiftCategoryChild;
import com.mercurius.models.ShiftCategoryMaster;
import com.mercurius.models.ShiftlineBidding;
import com.mercurius.models.Shiftlinechild;
import com.mercurius.models.Shiftlinescheduleparent;
import com.mercurius.models.TimeZoneForBidSchedule;
import com.mercurius.models.TransactionTable;
import com.mercurius.models.UserToLogin;
import com.mercurius.models.VacationBidding;
import com.mercurius.payload.response.MessageResponse;
import com.mercurius.repository.AddBidManagerDao;
import com.mercurius.repository.BidLeaveChildDao;
import com.mercurius.repository.BidRoundChildDao;
import com.mercurius.repository.BidScheduleMapEmployeeDetailsDao;
import com.mercurius.repository.BidScheduleMapShiftlineScheduleDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.BidWindowDurationDao;
import com.mercurius.repository.CountryDetailsDao;
import com.mercurius.repository.EmpQualificationDao;
import com.mercurius.repository.EmpRoleDao;
import com.mercurius.repository.FacilityTypeDao;
import com.mercurius.repository.LeaveRuleForVacationBiddingDao;
import com.mercurius.repository.RolePermissionDetailsDao;
import com.mercurius.repository.ShiftCategoryMasterDao;
import com.mercurius.repository.ShiftlineBiddingDao;
import com.mercurius.repository.ShiftlinechildDao;
import com.mercurius.repository.ShiftllinescheduleparentDao;
import com.mercurius.repository.TimeZoneForBidScheduleDao;
import com.mercurius.repository.TransactionTableDao;
import com.mercurius.repository.UserRepository;
import com.mercurius.repository.VacationBiddingDao;
import com.mercurius.security.services.AddBidManagerService;
import com.mercurius.security.services.BackendServiceForBidManagerService;
import com.mercurius.security.services.BackendServiceForCroneJobService;
import com.mercurius.security.services.BackendServiceForEmployeeService;
import com.mercurius.security.services.BidLeaveChildService;
import com.mercurius.security.services.BidRoundChildService;
import com.mercurius.security.services.BidScheduleMapEmployeeDetailsService;
import com.mercurius.security.services.BidScheduleMapShiftlineScheduleService;
import com.mercurius.security.services.BidScheduleParamParentService;
import com.mercurius.security.services.BidSummaryEmailService;
import com.mercurius.security.services.BidWindowDurationService;
import com.mercurius.security.services.CronJobForBasicWatchScheduleService;
import com.mercurius.security.services.CronJobForUserDefinedShiftDefService;
import com.mercurius.security.services.DemoDetailsService;
import com.mercurius.security.services.EmpQualificationService;
import com.mercurius.security.services.EmpRoleService;
import com.mercurius.security.services.EmployeeVacationScheduleService;
import com.mercurius.security.services.FacilityTypeService;
import com.mercurius.security.services.IdentifyAWSIPaddressService;
import com.mercurius.security.services.MissedBidWindowEmailService;
import com.mercurius.security.services.NotificationForBidScheduleChangedService;
import com.mercurius.security.services.NotificationForBidScheduleTimeIncreasedService;
import com.mercurius.security.services.NotificationForNewBidWindowService;
import com.mercurius.security.services.NotificationForRegistrationService;
import com.mercurius.security.services.NotificationforBiddingCompleteService;
import com.mercurius.security.services.NotificationforBidscheduleModifiedEmployeeDeletedService;
import com.mercurius.security.services.NotificationforShiftlineBiddingBySystemService;
import com.mercurius.security.services.NotificationforSkippingVacationService;
import com.mercurius.security.services.PasswordService;
import com.mercurius.security.services.PostOneBasicWatchScheduleThroughService;
import com.mercurius.security.services.RolePermissionService;
import com.mercurius.security.services.ShiftCategoryService;
import com.mercurius.security.services.ShiftlineBiddingService;
import com.mercurius.security.services.ShiftlinechildService;
import com.mercurius.security.services.ShiftlinescheduleparentService;
import com.mercurius.security.services.SmtpService;
import com.mercurius.security.services.TransactionTableService;
import com.mercurius.security.services.TrialEmailRegistrationService;
import com.mercurius.security.services.VacationBiddingService;

@RestController
//@RequestMapping("/api/test")
public class TestController {
	
	/*
	 * URL for local Angular code
	 * @CrossOrigin(origins = "http://localhost:8100") */

	//URL for AWS Angular code
	//@CrossOrigin(origins = "http://52.14.8.217/") 
	
	@GetMapping("/all")
	public String allAccess() {
		return "Public Content.";
	}
	@GetMapping("/home")
	public String Home() {
		return "Welcome to Rest API";
	}
	@GetMapping("/checkingnew")
	public String NewEclipse() {
		return "Working fine.";
	}
	//adding a comment
	/*-------------------------------------------------------------------------------------------------------*/
	
	
		/*----------------------------------*/
	
	@Autowired
	private PasswordService passwordService;

	/*@PostMapping("/forgot-password")
	public String forgotPassword(@RequestParam String username,HttpServletRequest request) { 
	instead of param trying to send username in pathvariable*/
	
	@PostMapping("/forgot-password/{username}")
		public String forgotPassword(@PathVariable String username,HttpServletRequest request) {
		System.out.println(username);
		String response = passwordService.forgotPassword(username);

		if (!response.startsWith("Invalid")) {
			//response = "http://localhost:2020/reset-password?token=" + response;
			response = home(request)+"/resetpassword?token=" + response;//reset-password
		}
		return response;
	}

	@PutMapping("/resetpassword")//reset-password
	
	/*public String resetPassword(@RequestParam(name = "token", required = false) String token,
	 * @RequestParam(name ="password",required = true,defaultValue = "unknown") String password) {
	 This above mentioned method is used to try input as JSON but however the password field is not coming out properly */
	
	public String resetPassword(@RequestParam String token,@RequestParam String password)
	{
		return passwordService.resetPassword(token, password);
	}
	

	/*-------------------------------------------------------------------------------------------------------*/
	
	@RequestMapping("/hello")
	public String home(HttpServletRequest request) {
	    String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
            .replacePath(null)
            .build()
            .toUriString();
 
	    System.out.println(baseUrl);
 
		return baseUrl;
	}
	
	@Autowired
	private SmtpService smtpservice;
	
	@RequestMapping(method = RequestMethod.POST, path = "/letsverifybyusername/{username}")
	public UserToLogin verifybyUsername(@PathVariable String username,HttpServletRequest request ) throws UnsupportedEncodingException, MessagingException 
	{
			return this.smtpservice.sendVerificationUsername(username,home(request));
		
	}
	
	
	@RequestMapping(method = RequestMethod.POST, path = "/forgotpasswordemailverify/{username}")
	public UserToLogin forgotPassword1(@PathVariable String username,HttpServletRequest request) throws UnsupportedEncodingException, MessagingException 
	{
		
		return this.passwordService.forgotPasswordpart1(username,home(request));
	}

		/*System.out.println(request+"request");
		String response = passwordService.forgotPassword(username);

		if (!response.startsWith("Invalid")) {
			response = request+"/reset-password?token=" + response;
		}
		return response;*/
	
	@RequestMapping(method = RequestMethod.POST, path = "/trynew/{username}")
	public String processForgotPassword(@PathVariable String username,HttpServletRequest request) throws UnsupportedEncodingException, MessagingException 
	{
		
		return this.passwordService.processForgotPassword1(username,home(request));
	}
	
	@PostMapping("/verifydone/{code}") // verify done for reset password link
	public boolean verifyUserToResetPassword(@PathVariable String code, HttpServletRequest request) {
	   System.out.println(code);
	   if(passwordService.verify(code)==false){
	      System.out.println("false");
	      return false;
	   }else{
	      System.out.println("true");
	      return true;
	   }
	}
	
	@PostMapping("/verifydoneforregister/{code}") // verify done for register
	public boolean verifyUserForNewUser(@PathVariable String code, HttpServletRequest request) {
	   System.out.println(code);
	   if(smtpservice.verify(code)==false){
	      System.out.println("false");
	      return false;
	   }else{
	      System.out.println("true");
	      return true;
	   }
	}
	
	/*-------------------------------------------------------------------------------------------------------*/
	
	
	/*-------------------------------------------------------------------------------------------------------*/
	
	/*** Table - ref_faa_qualification <--->  class - EmployeeQualification ***/
	
	@Autowired
	private EmpQualificationService empqualification;
	
	@Autowired
	private EmpQualificationDao qualificationdao;
	
	@GetMapping("/employeequalification")
	public List<EmployeeQualification> getInfo() throws ParseException
	{
		
			List<EmployeeQualification> a1 = empqualification.getAll();
			int n = a1.size();
		
		for(int i=0;i<n;i++)
		{
			
			EmployeeQualification eq = a1.get(i);
			long id = eq.getId();
			
			LocalDate dateObj = LocalDate.now();
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	        String cdate = dateObj.format(formatter);
	        System.out.println(cdate);
	        
	        String d2 = a1.get(i).getEff_start_date();
	        SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
		    Date date2=formatter2.parse(d2);
		    
		    String d3 = a1.get(i).getEff_end_date();
			SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
			Date date3=formatter3.parse(d3); 
			
			Date date4 = formatter3.parse(cdate);
			String s1 = null;
	        
	        if((date2.equals(date4)||date2.before(date4))&&(date3.equals(date4)||date3.after(date4)))
			{
				 s1 = eq.setStatus("Active"); 
				//return ResponseEntity.ok(new MessageResponse("Active Role added"));
				 empqualification.updateByQualficationid(eq, id);
				 
			}
	        else
	        {
	        	s1 = eq.setStatus("Inactive"); 
	        	empqualification.updateByQualficationid(eq, id);
	        }
		}
		
		return this.empqualification.getAll();
	}

	
	@GetMapping("/getallqualification")
	public List<Object> getQualificationDescriptionn()
	{
		List<Object> qualifications = qualificationdao.getQualificationDesciption();
	    return qualifications;
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/qualificationdetailssave")
	public EmployeeQualification saveDetails(@RequestBody EmployeeQualification qdata) throws ParseException 
	{
		return this.empqualification.addoneItem(qdata);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/qualificationdetailsupdate/{qId}")
	public EmployeeQualification updateDetails(@RequestBody EmployeeQualification qdata, @PathVariable("qId") Long qId) throws ParseException 
	{
		return this.empqualification.updateByQualficationid(qdata, qId);
	}
	
	
	
	/*-------------------------------------------------------------------------------------------------------*/
	
	/*** Table - ref_faa_role <---> class - EmployeeRole ***/
	
	@Autowired
	private EmpRoleService emprole;
	
	@GetMapping("/employeerole")
	public List<EmployeeRole> getInfo1()
	{
		return this.emprole.getAll();
	}
	
	@Autowired
	private EmpRoleDao roledao;
	
	@GetMapping("/getallrole")
	public List<Object> getRoleName()
	{
		List<Object> roles = roledao.getRoleName();
	    return roles;
	}
	
	
	@GetMapping("/getallroledetails")
	public List<EmployeeRole> getRoleDetails() throws ParseException
	{
		
		List<EmployeeRole> e1 = emprole.getAll();
		int n = e1.size();
		
		for(int i=0;i<n;i++)
		{
			EmployeeRole d1 = e1.get(i);
			long id = d1.getId();
			EmployeeRole s2 = null;
			String s1 = null;
			
			LocalDate dateObj = LocalDate.now();
	        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	        String cdate = dateObj.format(formatter);
	        System.out.println(cdate);
			  
		  	String d2 = d1.getStart_date();
		    SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
		    Date date2=formatter2.parse(d2); 
			//System.out.println("startdate:"+date2);
		    
			String d3 = d1.getEnd_date();
			SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
			Date date3=formatter3.parse(d3); 
			//System.out.println("enddate:"+date3);
			
			Date date4 = formatter3.parse(cdate);
			
			//Date currentDate = new Date();
			//System.out.println("todaydate:"+currentDate);
			if((date2.equals(date4)||date2.before(date4))&&(date3.equals(date4)||date3.after(date4)))
			{
				 s1 = d1.setStatus("Active");
				 s2 = emprole.updateByRoleid(d1,id);
				//return ResponseEntity.ok(new MessageResponse("Active Role added"));
			}
			else
			{
				 s1 = d1.setStatus("Inactive");
				 s2 = emprole.updateByRoleid(d1,id);
				//return ResponseEntity.ok(new MessageResponse("Inactive Role added"));
			}					
		}
		
		return emprole.getAll();
	}
	
	  @PostMapping("/saveroledetails") 
	  public EmployeeRole savedata(@RequestBody EmployeeRole data) throws ParseException
	  { 
		  
		  EmployeeRole e1 = emprole.addoneItem(data);
		  return e1; 
	  
	  }
		 /* EmployeeRole d1 = data;
		  EmployeeRole s2 = null;
		  System.out.println(data);
		  	String d2 = d1.getStart_date();
		    SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
		    Date date2=formatter2.parse(d2); 
			//System.out.println("startdate:"+date2);
			String d3 = d1.getEnd_date();
			SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
			Date date3=formatter3.parse(d3); 
			//System.out.println("enddate:"+date3);
			Date currentDate = new Date();
			//System.out.println("todaydate:"+currentDate);
			if((date2.equals(currentDate)||date2.before(currentDate))&&(date3.equals(currentDate)||date3.after(currentDate)))
			{
				String s1 = d1.setStatus("Active");
				 s2 = emprole.addoneItem(d1);
				//return ResponseEntity.ok(new MessageResponse("Active Role added"));
			}
			else
			{
				String s1 = d1.setStatus("Inactive");
				 s2 = emprole.addoneItem(d1);
				//return ResponseEntity.ok(new MessageResponse("Inactive Role added"));
			}	*/				
			
		  
		  
	  
	  @RequestMapping(method = RequestMethod.PUT, value = "/updateroledetails/{rId}")
	public EmployeeRole updateItem2(@RequestBody EmployeeRole rdata, @PathVariable("rId") Long rId) throws ParseException 
	  {
		  EmployeeRole e1 = emprole.updateByRoleid(rdata, rId);
		  return e1;
		
	  }
		  
		 /* EmployeeRole d1 = rdata;
		  EmployeeRole s2 = null;
		  
		  	String d2 = d1.getStart_date();
		    SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
		    Date date2=formatter2.parse(d2); 
			//System.out.println("startdate:"+date2);
			String d3 = d1.getEnd_date();
			SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
			Date date3=formatter3.parse(d3); 
			//System.out.println("enddate:"+date3);
			Date currentDate = new Date();
			//System.out.println("todaydate:"+currentDate);
			if((date2.equals(currentDate)||date2.before(currentDate))&&(date3.equals(currentDate)||date3.after(currentDate)))
			{
				String s1 = d1.setStatus("Active");
				 s2 = emprole.updateByRoleid(d1,rId);
				//return ResponseEntity.ok(new MessageResponse("Active Role added"));
			}
			else
			{
				String s1 = d1.setStatus("Inactive");
				 s2 = emprole.updateByRoleid(d1,rId);
				//return ResponseEntity.ok(new MessageResponse("Inactive Role added"));
			}	*/
		  
				
	
	  
	 /* @RequestMapping(method = RequestMethod.POST, value = "/postmethodforrole",produces = MediaType.APPLICATION_JSON_VALUE)
	   public ResponseEntity<?> savedata1(@RequestBody EmployeeRole data) throws ParseException 
	 {
		  EmployeeRole d1 = data;
		String d2 = d1.getStart_date();
	    SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
	    Date date2=formatter2.parse(d2); 
		System.out.println("startdate:"+date2);
		String d3 = d1.getEnd_date();
		SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
		Date date3=formatter3.parse(d3); 
		System.out.println("enddate:"+date3);
		Date currentDate = new Date();
		System.out.println("todaydate:"+currentDate);
		if((date2.equals(currentDate)||date2.before(currentDate))&&(date3.equals(currentDate)||date3.after(currentDate)))
		{
			String s1 = d1.setStatus("Active");
			EmployeeRole s2 = emprole.addoneItem(data);
			return ResponseEntity.ok(new MessageResponse("Active Role added"));
		}
		else
		{
			String s1 = d1.setStatus("Inactive");
			EmployeeRole s2 = emprole.addoneItem(data);
			return ResponseEntity.ok(new MessageResponse("Inactive Role added"));
		}					
							
	  }*/
	  
	  @GetMapping("/getrolebyid/{eid}")
		public EmployeeRole getOneRole(@PathVariable Long eid) throws ParseException
		{
		    Optional<EmployeeRole> data = roledao.findById(eid); 
		    EmployeeRole d1 = data.get();
			  EmployeeRole s2 = null;
			  
			  	String d2 = d1.getStart_date();
			    SimpleDateFormat formatter2=new SimpleDateFormat("yyyy-MM-dd");  
			    Date date2=formatter2.parse(d2); 
				//System.out.println("startdate:"+date2);
				String d3 = d1.getEnd_date();
				SimpleDateFormat formatter3=new SimpleDateFormat("yyyy-MM-dd");  
				Date date3=formatter3.parse(d3); 
				//System.out.println("enddate:"+date3);
				Date currentDate = new Date();
				//System.out.println("todaydate:"+currentDate);
				if((date2.equals(currentDate)||date2.before(currentDate))&&(date3.equals(currentDate)||date3.after(currentDate)))
				{
					String s1 = d1.setStatus("Active");
					 s2 = emprole.updateByRoleid(d1,eid);
					//return ResponseEntity.ok(new MessageResponse("Active Role added"));
				}
				else
				{
					String s1 = d1.setStatus("Inactive");
					 s2 = emprole.updateByRoleid(d1,eid);
					//return ResponseEntity.ok(new MessageResponse("Inactive Role added"));
				}	
			  
			return s2;
		}
	  
//	  @GetMapping("/employeelistbasedonuserid/{uid}") //get entire employee details based on managerid who added them
//		public List<Object> getEmpDtailsBasedonUserId(@PathVariable Long uid)
//		{
//			
//			List<Object> result = empdao.getNamesBasedOnUserId(uid);
//			return result;
//		}
		
	  
	  @GetMapping("/activeroles/{status}")
		public List<RoleChild> getActiveRoles1(@PathVariable String status)
		{
		  
		  List<RoleChild> rd = roledao.getActiveRoles(status);
		 //System.out.println("first value:"+rd.get(0)); 
		 // String[] dest = new String[rd.size()];
		  //System.out.println(rd);
		  return rd;
		}
	  
	  
	
	/*-------------------------------------------------------------------------------------------------------*/
	
	/*** Table - userlogin <---> class - UserToLogin ***/
	
	@Autowired
	private UserRepository userlogin;
	
	List<Object> EmptyList1 = new ArrayList<Object>(); 
	
	@GetMapping("/findidforemail/{username}")
	public List<Object> getUserEmail(@PathVariable String username)
	{
		List<Object> user = userlogin.getIdForEmail(username);
		if(user!=null)
		{
		return user;
		}
		else
		{
		return EmptyList1;
		}
	}	
	
		  
/*-------------------------------------------------------------------------------------------------------*/

	
	
	/*** Table - shift_line_schedule  <--->  class - Shiftlinescheduleparent ***/
	
	  
	  @Autowired 
	  private ShiftlinescheduleparentService shService;
	  
	  @PostMapping("/shiftlinepost") 
	  public Shiftlinescheduleparent savedata(@RequestBody Shiftlinescheduleparent parent)
	  { 
		  Shiftlinescheduleparent s1 = shService.addoneItem(parent);
		  return s1; 
	  }
	  
	  
	  @RequestMapping(method = RequestMethod.PUT, value = "/shiftlineput/{sId}")
		public Shiftlinescheduleparent updateItem1(@RequestBody Shiftlinescheduleparent sd, @PathVariable("sId") Long sId) {
			return this.shService.updateItem(sd,sId);
		}
		
	
	  @Autowired
	  private ShiftllinescheduleparentDao parent;
	  
	  @GetMapping("/shiftlinechildgetbybidschid/{bschId}")
		public List<Object> getbyBidschId(@PathVariable Long bschId)
		{
			return this.parent.getbyId(bschId);
		}
		
		@RequestMapping(method = RequestMethod.DELETE, value = "/shiftlinedelete/{sId}",produces = MediaType.APPLICATION_JSON_VALUE)
		   public ResponseEntity<?> deleteItem1(@PathVariable("sId") Long sId) 
		 {
			Long id = sId;
			shService.deleteItem(sId);
			Optional<Shiftlinescheduleparent> param = parent.findById(id);
			if(param.isEmpty())
			{
				return ResponseEntity.ok(new MessageResponse("successfully deleted"));
			}
			else
			{
				return ResponseEntity.ok(new MessageResponse("failed"));
			}					
								
		  }
	 
	  
	  @GetMapping("/shiftlinebasedonuserid/{uId}")
		public List<Object> Shiftlinebyuserid(@PathVariable Long uId)
		{
			return parent.getShlineSchByUserId(uId);
		}
	  
	  @GetMapping("/shiftlinebasedonuseridandselectionstatus")
	  public List<Object> Shiftlinebyuseridandselectionsttaus(@RequestParam Long uId,@RequestParam boolean status)
		{
			return parent.getShlineSchByUserIdandStatus(uId,status);
		}
	  
	  @GetMapping("/shiftlinebasedonshid/{shId}")
		public List<Object> ShiftlinebyShiftLineScheduleid(@PathVariable Long shId)
		{
			return parent.getShlineSchByScheduleId(shId);
		}
	  
	   @RequestMapping(method = RequestMethod.GET, value = "/shiftlinebyschedulenameuserid")
		public List<Object>  getByUserIdandScheduleName( @RequestParam String schedulename, @RequestParam Long userid)
		{
		return parent.getbasedonUserIdandScheduleName(schedulename, userid);
		}
	  
	
	  @RequestMapping(method = RequestMethod.GET, value = "/shiftnamecheck",produces = MediaType.APPLICATION_JSON_VALUE)
		public ResponseEntity<?>  checkShlineName( @RequestParam String schedulename, @RequestParam Long userid)//
		{
		 String sname = schedulename;
		 Boolean m = parent.getData(userid).contains(sname);
		 if(!m.booleanValue())
		 {
			  
					return ResponseEntity.ok(new MessageResponse("unique name"));
				}
				else
				{
					return ResponseEntity.ok(new MessageResponse("name exists"));
				} 
		}
	 
	 
	  @Autowired 
	  private ShiftlinechildService shChildService;
	  
	  	@GetMapping("/shiftlinechildget/{sId}")
		public Shiftlinechild getbyId1(@PathVariable Long sId)
		{
			return this.shChildService.getbyId(sId);
		}
		
		@RequestMapping(method = RequestMethod.POST, path = "/shiftlinechildpost") 
		public Shiftlinechild addoneItem1(@RequestBody Shiftlinechild sd)
		{
			return this.shChildService.addoneItem(sd);
		}
		
		@RequestMapping(method = RequestMethod.PUT, value = "/shiftlinechildput/{sId}")
		public Shiftlinechild updateItem1(@RequestBody Shiftlinechild sd, @PathVariable("sId") Long sId) {
			return this.shChildService.updateItem(sd,sId);
		}
		
		@Autowired
		private ShiftlinechildDao shchildDao;
		
		@RequestMapping(method = RequestMethod.DELETE, value = "/shiftlinechilddelete/{sId}",produces = MediaType.APPLICATION_JSON_VALUE)
		   public ResponseEntity<?> deleteItem2(@PathVariable("sId") Long sId) 
		 {
			Long id = sId;
			shChildService.deleteItem(sId);
			Optional<Shiftlinechild> param = shchildDao.findById(id);
			if(param.isEmpty())
			{
				return ResponseEntity.ok(new MessageResponse("successfully deleted"));
			}
			else
			{
				return ResponseEntity.ok(new MessageResponse("failed"));
			}					
								
		  }
		
	  
/*-------------------------------------------------------------------------------------------------------*/
		
				/*** Table - bidschedule_employeedetails_map  <--->  class - BidScheduleMapEmployeeDetails ***/
			
			@Autowired 
			  private BidScheduleMapEmployeeDetailsService bidempService;
			  
			  @Autowired
			  private BidScheduleMapEmployeeDetailsDao bidempDao;
			  
			  @GetMapping("/bidparamemployeeget/{pId}")
				public BidScheduleMapEmployeeDetails getbyId3(@PathVariable long pId)
				{
					return this.bidempService.getbyId(pId);
				}
			  
			  @GetMapping("/bidparambasedonempid/{empid}")
			  public List<Object> DisplayBasedonEmpId(@PathVariable Long empid)
				{
					List<Object> result = bidempDao.getBasedOnEmpId(empid);
					return result;
				}
			  
			  @GetMapping("/bidparamgetallempidbasedonbidschid/{bidschid}")
			  public List<Object> DisplayBasedonEmpId2(@PathVariable Long bidschid)
				{
					List<Object> result = bidempDao.getBidSchid(bidschid);
					return result;
				}
			  
			  @PostMapping("/bidparamemployeepost") 
			  public BidScheduleMapEmployeeDetails savedata2(@RequestBody BidScheduleMapEmployeeDetails data)
			  { 
				  BidScheduleMapEmployeeDetails s1 = bidempService.addoneItem(data);
				  return s1; 
			  }
			  
			  @PostMapping("/bidparamemployeepostmore") 
			  public List<BidScheduleMapEmployeeDetails> savedata2(@RequestBody List<BidScheduleMapEmployeeDetails> data)
			  { 
				  List<BidScheduleMapEmployeeDetails> s1 = bidempService.addmoreItem(data);
				  return s1; 
			  }
			  
			  @RequestMapping(method = RequestMethod.PUT, value = "/bidparamemployeeput/{pId}")
				public BidScheduleMapEmployeeDetails updateItem3(@RequestBody BidScheduleMapEmployeeDetails pd, @PathVariable("pId") Long pId) 
			  {
					return this.bidempService.updateItem(pd,pId);
			  }
				
				@RequestMapping(method = RequestMethod.DELETE, value = "/bidparamemployeedelete/{pId}",produces = MediaType.APPLICATION_JSON_VALUE)
				public ResponseEntity<?> deleteItem4(@PathVariable("pId") Long pId) 
			  {
					Long id = pId;
					bidempService.deleteItem(pId);
					Optional<BidScheduleMapEmployeeDetails> param =bidempDao.findById(id);
					if(param.isEmpty())
					{
						return ResponseEntity.ok(new MessageResponse("successfully deleted"));
					}
					else
					{
						return ResponseEntity.ok(new MessageResponse("failed"));
					}
					
		      }
				
				@RequestMapping(method = RequestMethod.DELETE, value = "/bidparamemployeedeletebyempid/{empId}",produces = MediaType.APPLICATION_JSON_VALUE)
				public ResponseEntity<?> deleteItem9(@PathVariable("empId") Long empId) 
			  {
					Long id = empId;
					bidempDao.deleteByEmpId(empId);
					Optional<BidScheduleMapEmployeeDetails> param =bidempDao.findByEmpId(id);
					if(param.isEmpty())
					{
						return ResponseEntity.ok(new MessageResponse("successfully deleted"));
					}
					else
					{
						return ResponseEntity.ok(new MessageResponse("failed"));
					}
					
		      }

/*-------------------------------------------------------------------------------------------------------*/
				
	/*** Table - bidschedule_shiftlineschedule_map  <--->  class - BidScheduleMapShiftlineSchedule ***/
					
	@Autowired 
	private BidScheduleMapShiftlineScheduleService bidshiftService;
					  
	@Autowired
	private BidScheduleMapShiftlineScheduleDao bidshiftDao;
					  
	@GetMapping("/bidparamshiftget/{sId}")
	 public BidScheduleMapShiftlineSchedule getbyId4(@PathVariable long sId)
	  {
		return this.bidshiftService.getbyId(sId);
	  }
					  
	@PostMapping("/bidparamshiftpost") 
	  public BidScheduleMapShiftlineSchedule savedata4(@RequestBody BidScheduleMapShiftlineSchedule data)
	  { 
		BidScheduleMapShiftlineSchedule s1 = bidshiftService.addoneItem(data);
		  return s1; 
	  }		
	
	@PostMapping("/bidparamshiftpostmore") 
	  public List<BidScheduleMapShiftlineSchedule> savedata5(@RequestBody List<BidScheduleMapShiftlineSchedule> data)
	  { 
		List<BidScheduleMapShiftlineSchedule> s1 = bidshiftService.addmoreItem(data);
		  return s1; 
	  }	
					  
	@RequestMapping(method = RequestMethod.PUT, value = "/bidparamshiftput/{sId}")
	   public BidScheduleMapShiftlineSchedule updateItem4(@RequestBody BidScheduleMapShiftlineSchedule data, @PathVariable("sId") Long sId) 
     {		
		return this.bidshiftService.updateItem(data,sId);
     }				  
						
	@RequestMapping(method = RequestMethod.DELETE, value = "/bidparamshiftdelete/{sId}",produces = MediaType.APPLICATION_JSON_VALUE)
	   public ResponseEntity<?> deleteItem5(@PathVariable("sId") Long sId) 
	 {
		Long id = sId;
		bidshiftService.deleteItem(sId);
		Optional<BidScheduleMapShiftlineSchedule> param =bidshiftDao.findById(id);
		if(param.isEmpty())
		{
			return ResponseEntity.ok(new MessageResponse("successfully deleted"));
		}
		else
		{
			return ResponseEntity.ok(new MessageResponse("failed"));
		}					
							
	  }
	
/*-------------------------------------------------------------------------------------------------------*/
	
	/*** Table - Bid_Leave  <--->  class - BidLeaveChild ***/
					
	@Autowired 
	private BidLeaveChildService bidleaveService;
					  
	@Autowired
	private BidLeaveChildDao bidleaveDao;
					  
	@GetMapping("/bidparamleaveget/{lId}")
	 public BidLeaveChild getbyId5(@PathVariable long lId)
	  {
		return this.bidleaveService.getbyId(lId);
	  }
					  
	@PostMapping("/bidparamleavepost") 
	  public BidLeaveChild savedata5(@RequestBody BidLeaveChild data)
	  { 
		BidLeaveChild s1 = bidleaveService.addoneItem(data);
		  return s1; 
	  }	
	
	  
	@PostMapping("/bidparamleavepostmore") 
	public List<BidLeaveChild> savedata6(@RequestBody List<BidLeaveChild> data)
	{ 
		List<BidLeaveChild> s1 = bidleaveService.addmoreItem(data);
		return s1; 
	}
					  
	@RequestMapping(method = RequestMethod.PUT, value = "/bidparamleaveput/{lId}")
	   public BidLeaveChild updateItem5(@RequestBody BidLeaveChild data, @PathVariable("lId") Long lId) 
     {		
		return this.bidleaveService.updateItem(data,lId);
     }				  
						
	@RequestMapping(method = RequestMethod.DELETE, value = "/bidparamleavedelete/{lId}",produces = MediaType.APPLICATION_JSON_VALUE)
	   public ResponseEntity<?> deleteItem6(@PathVariable("lId") Long lId) 
	 {
		Long id = lId;
		bidleaveService.deleteItem(lId);
		Optional<BidLeaveChild> param = bidleaveDao.findById(id);
		if(param.isEmpty())
		{
			return ResponseEntity.ok(new MessageResponse("successfully deleted"));
		}
		else
		{
			return ResponseEntity.ok(new MessageResponse("failed"));
		}					
							
	  }

/*-------------------------------------------------------------------------------------------------------*/
	
	/*** Table - Bid_Round  <--->  class - BidRoundChild ***/
					
	@Autowired 
	private BidRoundChildService bidroundService;
					  
	@Autowired 
	private BidRoundChildDao bidroundDao;
					  
	@GetMapping("/bidparamroundget/{lId}")
	 public BidRoundChild getbyId6(@PathVariable long lId)
	  {
		return this.bidroundService.getbyId(lId);
	  }
	
	@GetMapping("/bidparamroundgetbybidscheduleid/{bshId}")
	 public List<Object> getbidround(@PathVariable long bshId)
	  {
		List<Object> result = bidroundDao.getBidRoundbyBidScheduleId(bshId);
		return result;
	  }
					  
	@PostMapping("/bidparamroundpost") 
	  public BidRoundChild savedata6(@RequestBody BidRoundChild data)
	  { 
		BidRoundChild s1 = bidroundService.addoneItem(data);
		  return s1; 
	  }		
	
	@PostMapping("/bidparamroundpostmore") 
	  public List<BidRoundChild> savedata7(@RequestBody List<BidRoundChild> data)
	  { 
		List<BidRoundChild> s1 = bidroundService.addmoreItem(data);
		  return s1; 
	  }	
					  
	@RequestMapping(method = RequestMethod.PUT, value = "/bidparamroundput/{lId}")
	   public BidRoundChild updateItem6(@RequestBody BidRoundChild data, @PathVariable("lId") Long lId) 
     {		
		return this.bidroundService.updateItem(data,lId);
     }				  
						
	@RequestMapping(method = RequestMethod.DELETE, value = "/bidparamrounddelete/{lId}",produces = MediaType.APPLICATION_JSON_VALUE)
	   public ResponseEntity<?> deleteItem7(@PathVariable("lId") Long lId) 
	 {
		Long id = lId;
		bidroundService.deleteItem(lId);
		Optional<BidRoundChild> param = bidroundDao.findById(id);
		if(param.isEmpty())
		{
			return ResponseEntity.ok(new MessageResponse("successfully deleted"));
		}
		else
		{
			return ResponseEntity.ok(new MessageResponse("failed"));
		}					
							
	  }
	
	@RequestMapping(method = RequestMethod.PUT, value = "/bidparamroundputmore")
	public List<BidRoundChild> updateListofBidRounds(@RequestBody List<BidRoundChild> bdata) 
	{
		return this.bidroundService.updatemoreItem(bdata);
	}
	
	 
	@RequestMapping(method = RequestMethod.DELETE, value = "/bidscheduleidrefnull/{bidschId}",produces = MediaType.APPLICATION_JSON_VALUE)
	   public ResponseEntity<?> deleteItem11(@PathVariable("bidschId") Long bidschId) 
	{
		// delete records from multiple tables having bidscheduleidref=null
		Long a = null;
		if(bidschId.equals(0)) 
		{
			 a = null;
//			 bidroundDao.deleterecordsWhereBidscheduleIdIsNull(a);
//			 bidleaveDao.deleterecordsWhereBidscheduleIdIsNull(a);
//			 bidempDao.deleterecordsWhereBidscheduleIdIsNull(a);
//			 bidshiftDao.deleterecordsWhereBidscheduleIdIsNull(a);
//			 vacationDao.deleterecordsWhereBidscheduleIdIsNull(a);
//			 biddingDao.deleterecordsWhereBidscheduleIdIsNull(a);
//			 duration.deleterecordsWhereBidscheduleIdIsNull(a);
		}
		
		bidroundDao.deleterecordsWhereBidscheduleIdIsNull(a);
		 bidleaveDao.deleterecordsWhereBidscheduleIdIsNull(a);
		 bidempDao.deleterecordsWhereBidscheduleIdIsNull(a);
		 bidshiftDao.deleterecordsWhereBidscheduleIdIsNull(a);
		 vacationDao.deleterecordsWhereBidscheduleIdIsNull(a);
		 biddingDao.deleterecordsWhereBidscheduleIdIsNull(a);
		 duration.deleterecordsWhereBidscheduleIdIsNull(a);
		
		
		if(bidroundDao.getrecordsWhereBidScheduleIdIsNull(a)!=null && bidleaveDao.getrecordsWhereBidScheduleIdIsNull(a)!=null
		&& bidempDao.getrecordsWhereBidScheduleIdIsNull(a)!=null && bidshiftDao.getrecordsWhereBidScheduleIdIsNull(a)!=null
		&& vacationDao.getrecordsWhereBidScheduleIdIsNull(a)!=null && biddingDao.getrecordsWhereBidScheduleIdIsNull(a)!=null
		&& duration.getrecordsWhereBidScheduleIdIsNull(a)!=null)
		{
			return ResponseEntity.ok(new MessageResponse("successfully deleted"));
		}
		else
		{
			return ResponseEntity.ok(new MessageResponse("failed"));
		}
	}
	

/*-------------------------------------------------------------------------------------------------------*/
	
	/*** Table - window_transaction_table  <--->  class - BidWindowDuration ***/
					
	
	@Autowired 
	private BidWindowDurationService durationservice;
	
	@Autowired
	private BidWindowDurationDao duration;
	
	@RequestMapping(method = RequestMethod.POST, path = "/bidwindowdurationpost")
	  public List<BidWindowDuration> savedata8(@RequestBody List<BidWindowDuration> data)
	  { 
		  return this.durationservice.addmoreItem(data); 
	  }	
	
	@GetMapping("/bidwindowdurationgetbyempid/{empId}")
	 public List<Object> getbyEmpId(@PathVariable long empId)
	  {
		return this.duration.getData(empId);
	  }
	
	
	@GetMapping("/bidwindowdurationgetbydurationid/{duiId}")
	 public BidWindowDuration getbyDurationId(@PathVariable long duiId)
	  {
		return this.durationservice.getbyId(duiId);
	  }
	
	@GetMapping("/bidwindowdurationgetbybidschname/{bschname}")
	 public List<Object> getbyBidSchnanme(@PathVariable String bschname)
	  {
		return this.duration.getByName(bschname);
	  }
	
	@GetMapping("/bidwindowdurationgetbybidschid/{bschId}")
	 public List<Object> getbyBidschId(@PathVariable long bschId)
	  {
		return this.duration.getByBidId(bschId);
	  }

	@RequestMapping(method = RequestMethod.PUT, value = "/bidwindowdurationupdatebyid/{did}")
	public BidWindowDuration updateByDurationid(@RequestBody BidWindowDuration dudata, @PathVariable("did") Long did) 
	{
		return this.durationservice.updatePrimarylId(dudata,did);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/bidwindowdurationupdatebyempid/{empid}")
	public BidWindowDuration updateByEmpId(@RequestBody BidWindowDuration dudata, @PathVariable("empid") Long empid) 
	{
		return this.durationservice.updateByEmployeeId(dudata,empid);
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/bidwindowdurationdelete/{duId}",produces = MediaType.APPLICATION_JSON_VALUE)
	   public ResponseEntity<?> deleteItem8(@PathVariable("duId") Long duId) 
	 {
		Long id = duId;
		durationservice.deleteItem(duId);
		Optional<BidWindowDuration> param = duration.findById(id);
		if(param.isEmpty())
		{
			return ResponseEntity.ok(new MessageResponse("successfully deleted"));
		}
		else
		{
			return ResponseEntity.ok(new MessageResponse("failed"));
		}					
							
	  }
	
	@RequestMapping(method = RequestMethod.GET, value = "/checkbothstatus")
	public boolean basedonBothStatus( @RequestParam("bidschidref") Long bidschidref,@RequestParam("empidref") Long empidref,
			@RequestParam("roundseq_id") int roundseq_id,@RequestParam("shiftlinebidstatus") String shiftlinebidstatus,@RequestParam("vacationbidstatus") String vacationbidstatus) 
	{
		
		//Long bidschidref,Long empidref,int roundseq_id,String shiftlinebidstatus,String vacationbidstatus);
		String a1 = "Completed";
		String a2 = "System Completed";
		List<BidWindowDuration> bd = duration.getEmployeeIsAllocatedorNot(bidschidref, empidref, roundseq_id, shiftlinebidstatus, vacationbidstatus);
		List<ShiftlineBidding> sb1 = biddingDao.basedOnShiftStatus(bidschidref,empidref,roundseq_id,a1);
		List<ShiftlineBidding> sb2 = biddingDao.basedOnShiftStatus(bidschidref,empidref,roundseq_id,a2);
		
		 String a3 = "Completed";
		 String a4 = "Manager Completed";
		 List<VacationBidding> vb1 = vacationDao.basedOnVacationStatus(bidschidref,empidref,roundseq_id,a3);
		 List<VacationBidding> vb2 = vacationDao.basedOnVacationStatus(bidschidref,empidref,roundseq_id,a4);
		
		if((!bd.isEmpty())&&sb1.isEmpty()&&sb2.isEmpty()&&vb1.isEmpty()&&vb2.isEmpty()) {//return something , empty, empty, empty, empty then o/p return true 
			return true;
		}
		else
		{
			return false; //if both status are eligible then return true else false
		}
	}
	
/*-------------------------------------------------------------------------------------------------------*/
	
	/*** Table - shiftline_bid_transaction_table  <--->  class - ShiftlineBidding ***/
					
	
	@Autowired 
	private ShiftlineBiddingService biddingservice;
	
	@Autowired
	private ShiftlineBiddingDao biddingDao;
	
	@RequestMapping(method = RequestMethod.POST, path = "/biddingpost")
	  public ShiftlineBidding savedata9(@RequestBody ShiftlineBidding data)
	  { 
		  return this.biddingservice.addoneItem(data); 
	  }	
	
	@RequestMapping(method = RequestMethod.POST, path = "/biddingpostmore")
	  public List<ShiftlineBidding> savedata10(@RequestBody List<ShiftlineBidding> data)
	  { 
		  return this.biddingservice.addmoreItem(data); 
	  }	
	
	@GetMapping("/biddingbasedonempid/{empId}")
	 public List<Object> getbyEmpId1(@PathVariable long empId)
	  {
		return this.biddingDao.getData(empId);
	  }
	
	@GetMapping("/biddingbasedonschname/{bschname}")
	 public List<Object> getbyBidSchnanme1(@PathVariable String bschname)
	  {
		return this.biddingDao.getByName(bschname);
	  }
	
	@RequestMapping(method = RequestMethod.PUT, value = "/biddingupdatebyempid/{empid}")
	public ShiftlineBidding updateByEmpId(@RequestBody ShiftlineBidding data, @PathVariable("empid") Long empid) 
	{
		return this.biddingservice.updateByEmployeeId(data,empid);
	}
	
	@GetMapping("/biddingbasedonbothnames")
	public List<Object> bidschnameandschtname(@RequestParam String bidschedulename, @RequestParam String schedulename)
	{	
		return biddingDao.getbyNames(bidschedulename, schedulename);
		
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/biddingupdatebybidid/{bidid}")
	public ShiftlineBidding updateByPrimaryId(@RequestBody ShiftlineBidding data, @PathVariable("bidid") Long bidid) 
	{
		return this.biddingservice.updateByEmployeeId(data,bidid);
	}
	
	 @RequestMapping(method = RequestMethod.PUT, value = "/biddingputmore")
	 public List<ShiftlineBidding> updateItem5(@RequestBody List<ShiftlineBidding> bdata) 
	 {
			return this.biddingservice.updateItemMore(bdata);
	 }
	 
	 @GetMapping("/biddingbasedonbidscheduleidref/{bidschId}")
	 public List<Object> getbyBidSchId(@PathVariable long bidschId)
	  {
		return this.biddingDao.findByBidScheduleId(bidschId);
	  }
	 
	 @RequestMapping(method = RequestMethod.DELETE, value = "/deletebasedonbidingid/{BidId}",produces = MediaType.APPLICATION_JSON_VALUE)
		public ResponseEntity<?> deleteBasedOnBiddingId(@PathVariable("BidId") Long BidId)
		{
			Long s = BidId;
			biddingDao.deleteById(s);
			Optional<ShiftlineBidding> user1 = biddingDao.findById(s);
			if(user1.isEmpty())
			{
				return ResponseEntity.ok(new MessageResponse("successfully deleted"));
			}
			else
			{
				return ResponseEntity.ok(new MessageResponse("failed"));
			}
		}
	 
	 @GetMapping("/biddingbasedonshiftstatus")
	 public boolean getBasedonShiftStatus(@RequestParam long bidschId,@RequestParam long empid,@RequestParam int roundid,@RequestParam String windowstatus)
	  {
		 String a1 = "Completed";
		 String a2 = "System Completed";
		 List<ShiftlineBidding> sb1 = biddingDao.basedOnShiftStatus(bidschId,empid,roundid,a1);
		 List<ShiftlineBidding> sb2 = biddingDao.basedOnShiftStatus(bidschId,empid,roundid,a2);
		 if(sb1.isEmpty()&&sb2.isEmpty())
		 {
			 return true;//it should not return any record. 
			 //i.e if status passed is "completed" or "system completed" and no record returned, is will return true 
		 }
		 else
		 {
			 return false;
		 }
	  }
/*-------------------------------------------------------------------------------------------------------*/
	
	/*** Table - vacation_bid_transaction_table  <--->  class - VacationBidding ***/
					
	@Autowired 
	private BidScheduleParamParentService bidparamService;
	  
	@Autowired
	private BidScheduleParamParentDao bidparamDao;
	 
	@Autowired 
	private VacationBiddingService vacationservice;
	
	@Autowired
	private VacationBiddingDao vacationDao;
	
	@RequestMapping(method = RequestMethod.POST, path = "/bidvacationpost")
	  public VacationBidding savedata10(@RequestBody VacationBidding data)
	  { 
		  return this.vacationservice.addoneItem(data); 
	  }
	
	@RequestMapping(method = RequestMethod.POST, path = "/bidvacationpostmore")
	  public List<VacationBidding> savemultipledata(@RequestBody List<VacationBidding> data)
	  { 
		  return this.vacationservice.addmoreItem(data); 
	  }
	
	@RequestMapping(method = RequestMethod.GET, path = "/bidvacationget/{vId}")
	  public VacationBidding getbyId(@PathVariable Long vId)
	  { 
		  return this.vacationservice.getbyId(vId); 
	  }	
	
	@RequestMapping(method = RequestMethod.GET, path = "/bidvacationgetbybidscheduleid/{vId}")
	  public List<Object> getByBidScheduleid(@PathVariable Long vId)
	  { 
		  return this.vacationDao.getbyBidScheduleId(vId); 
	  }	
	
	
	@RequestMapping(method = RequestMethod.GET, path = "/bidvacationgetbyemployeeid/{eId}")
	  public List<Object> getByEmployeeid(@PathVariable Long eId)
	  { 
		  return this.vacationDao.getbyEmployeeId(eId); 
	  }	

	@RequestMapping(method = RequestMethod.DELETE, value = "/biddingdeletion/{bidschId}",produces = MediaType.APPLICATION_JSON_VALUE)
	   public ResponseEntity<?> deleteItem10(@PathVariable("bidschId") Long bidschId) 
	 {
		//Here we delete all the records from all Bidding tables and Manage Bid Paramater Tables based on Bid_schedule_id//
		Long id = bidschId;
		duration.deleteByBidscheduleId(bidschId);
		biddingDao.deleteByBidscheduleId(bidschId);
		vacationDao.deleteByBidscheduleId(bidschId);
		bidparamService.deleteItem(bidschId);
		List<Object> param1 = duration.findByBidScheduleId(id);
		List<Object> param2 = biddingDao.findByBidScheduleId(id);
		List<Object> param3 = vacationDao.findByBidScheduleId(id);
		Optional<BidScheduleParamParent> param4 =bidparamDao.findById(id);
		
		if(param1.isEmpty()&&param2.isEmpty()&&param3.isEmpty()&&param4.isEmpty())
		{
			return ResponseEntity.ok(new MessageResponse("successfully deleted"));
		}
		else
		{
			return ResponseEntity.ok(new MessageResponse("failed"));
		}					
							
	  }
	
	
	@GetMapping("/biddingbasedonvacationstatus")
	 public boolean getBasedonVacationStatus(@RequestParam long bidschId,@RequestParam long empid,@RequestParam int roundid,@RequestParam String windowstatus)
	  {
		 String a1 = "Completed";
		 String a2 = "Manager Completed";
		 List<VacationBidding> sb1 = vacationDao.basedOnVacationStatus(bidschId,empid,roundid,a1);
		 List<VacationBidding> sb2 = vacationDao.basedOnVacationStatus(bidschId,empid,roundid,a2);
		 if(sb1.isEmpty()&&sb2.isEmpty())
		 {
			 return true;//it should not return any record. 
			 //i.e if status passed is "completed" or "manager completed" and no record returned, is will return true 
		 }
		 else
		 {
			 return false;
		 }
	  }
	

/*-------------------------------------------------------------------------------------------------------*/
	
	/*** Table - bid_manager_detail  <--->  class - AddBidManager ***/
	
	@Autowired 
	private AddBidManagerService managerservice;
	
	@Autowired
	private AddBidManagerDao managerDao;
	
	/*@RequestMapping(method = RequestMethod.POST, path = "/bidmanagerpost")
	  public AddBidManager savedata11(@RequestBody AddBidManager data)
	  { 
		  return this.managerservice.addoneItem(data); 
	  }*/
	
	@RequestMapping(method = RequestMethod.GET, path = "/bidmanagergetbymanagerid/{mId}")
	  public List<Object> getByManagerId(@PathVariable Long mId)
	  { 
		  return this.userlogin.getbyManagerId(mId); 
	  }	
	
	@RequestMapping(method = RequestMethod.GET, path = "/bidmanagergetbyemail/{email}")
	  public List<Object> getByManagerEmail(@PathVariable String email)
	  { 
		  return this.userlogin.getInfoForEmail(email); 
	  }	
	
	
	/*@RequestMapping(method = RequestMethod.GET, path = "/checkbidmanageroremployee/{email}")
	  public List<Object> getManagerorEmployee(@PathVariable String email)
	  { 
		if(userlogin.existsByUsername(email)==true)
		{
		  return this.userlogin.getInfoForEmail(email); 
		}else
		{
			 return this.empdao.getInfoForEmail(email); 
		}
	  }	*/
	
		/*-------------------------*/

	@Autowired
	private NotificationForRegistrationService notify;
	
	@RequestMapping(method = RequestMethod.POST, path = "/notificationfornewuser/{BidmanagerId}")
	  public List<Object> savedata11(@PathVariable Long BidmanagerId,HttpServletRequest request ) throws UnsupportedEncodingException, MessagingException 
		{
		  return this.notify.sendVerificationUsername(BidmanagerId, home(request)); 
	  }
	
	//********************
	@Autowired
	private BackendServiceForEmployeeService backend;
	
	//This service is used in authentication service and works internally from there. 
	@RequestMapping(method = RequestMethod.GET, path = "/backendserviceoutputview/{emailid}")
	  public List<Object> backendwork(@PathVariable String emailid) throws ParseException
	  { 
			return this.backend.sendBiddingInformation(emailid);
	  }
	//*********************
	
	@Autowired
	private NotificationForNewBidWindowService bidservice;
	
	@RequestMapping(method = RequestMethod.GET, path = "/notificationforbidwindowalloctaion/{bidscheduleId}")
	  public List<Object> notificationpart3(@PathVariable Long bidscheduleId,HttpServletRequest request ) throws UnsupportedEncodingException, MessagingException 
		{
			return this.bidservice.sendNewBidWindowInformation(bidscheduleId,home(request));
	  }
	
	
	@Autowired
	private NotificationForBidScheduleChangedService modifiedservice;
	
	@RequestMapping(method = RequestMethod.GET, path = "/notificationforbidschedulechanged/{bidscheduleId}")
	  public List<Object> notificationpart4(@PathVariable Long bidscheduleId,HttpServletRequest request ) throws UnsupportedEncodingException, MessagingException 
		{
			return this.modifiedservice.BidscheduleModified(bidscheduleId,home(request));
	  }
	
	@Autowired
	private NotificationforBidscheduleModifiedEmployeeDeletedService deletedemployee;
	
	@RequestMapping(method = RequestMethod.GET, path = "/notificationforbidschedulechangedemployeedeleted/{bidscheduleId}/{empid}")
	  public List<Object> notificationpart6(@PathVariable Long bidscheduleId,@PathVariable Long empid, HttpServletRequest request ) throws UnsupportedEncodingException, MessagingException 
		{
			return this.deletedemployee.BidscheduleModifiedEmpDeleted(bidscheduleId,empid,home(request));
	  }
	
	@Autowired
	private NotificationForBidScheduleTimeIncreasedService increaseService;
	
	@RequestMapping(method = RequestMethod.GET, path = "/notificationforbidscheduleincreased")
	public List<Object> notificationpart5(Long BidscheduleId, Long Empid, int Roundid,HttpServletRequest request, long prevempdurationid) throws UnsupportedEncodingException, MessagingException, ParseException
	{
		return increaseService.BidWindowTimeIcreasedForEmployee(BidscheduleId, Empid, Roundid,home(request), prevempdurationid);
	}
	
	@Autowired
	private NotificationforBiddingCompleteService completeService;
	
	@RequestMapping(method = RequestMethod.GET, path = "/notificationforbidschedulecomplete")
	public List<Object> notificationpart6(Long BidscheduleId, Long Empid, int Roundid,int vacationcount,HttpServletRequest request, int vaactionexhausted) throws UnsupportedEncodingException, MessagingException, ParseException
	{
		return completeService.BiddingComplete(BidscheduleId, Empid, Roundid, vacationcount,home(request), vaactionexhausted);
	}
	
	@Autowired
	private NotificationforShiftlineBiddingBySystemService systemshiftallocated;
	
	@RequestMapping(method = RequestMethod.GET, path = "/notificationforsystemcomplete")
	public List<Object> notificationpart7(Long BidscheduleId, Long Empid, int Roundid,HttpServletRequest request) throws UnsupportedEncodingException, MessagingException, ParseException
	{
		return systemshiftallocated.ShiftlineBiddingCompleteBySystem(BidscheduleId, Empid, Roundid,home(request));
	}
	
	@Autowired
	private NotificationforSkippingVacationService skipvacation;
	
	@RequestMapping(method = RequestMethod.GET, path = "/notificationforskipvacation")
	public List<Object> notificationpart8(Long BidscheduleId, Long Empid, int Roundid,int Vacationcount,HttpServletRequest request) throws UnsupportedEncodingException, MessagingException, ParseException
	{
		return skipvacation.SkipVacation(BidscheduleId, Empid, Roundid,Vacationcount,home(request));
	}
	
	@Autowired
	private BackendServiceForBidManagerService backendforManager;
	
	//This service is used in authentication service and works internally from there. 
	@RequestMapping(method = RequestMethod.GET, path = "/backendserviceoutputviewformanager/{emailid}")
	  public List<Object> backendwork2(@PathVariable String emailid) throws ParseException
	  { 
			return this.backendforManager.UpdateShiftlineStatus(emailid);
	  }
	
	@Autowired
	private TrialEmailRegistrationService trial;
	
	@RequestMapping(method = RequestMethod.POST, path = "/notificationfortrialregister")
	  public List<Object> trialtriggeremail(String fname,String lname,String email,HttpServletRequest request ) throws UnsupportedEncodingException, MessagingException 
		{
		  return this.trial.sendTrialEmail( fname, lname,email, home(request)); 
	  }
			
	//class - LeaveRuleForVacationBidding
	
	@Autowired
	private LeaveRuleForVacationBiddingDao leaverule;
	
	@GetMapping("/getallleaverules")
	public List<LeaveRuleForVacationBidding> getAllLeaveRules()
	{
		return this.leaverule.getAll();
	}
	
	/*---------------*/
	
	//class - TimeZoneForBidSchedule
	
	@Autowired
	private TimeZoneForBidScheduleDao timezone;
	
	@GetMapping("/getalltimezones")
	public List<TimeZoneForBidSchedule> getAllTimeZones()
	{
		return this.timezone.getAll();
	}
	
	/*-------------------*/
	
	//class - DemoDetails
	
	@Autowired
	private DemoDetailsService dds;
	
	@RequestMapping(method = RequestMethod.POST, path = "/savedemodetails")
	public DemoDetails savedetails(@RequestBody DemoDetails dd,HttpServletRequest request) throws UnsupportedEncodingException, MessagingException
	{
		return this.dds.addoneItem(dd,home(request));
	}
	
	/*-------------------*/
	
	//class - CountryDetails
	@Autowired
	private CountryDetailsDao cd;
	
	@RequestMapping(method = RequestMethod.GET, path = "/getcountryname")
	public List<Object> getCountryName()
	{
		List<Object> c = cd.getCountryName(null);
		return c;
	}
	
/*-------------------*/
	
	//class - Crone Job Backend Service
	@Autowired
	private BackendServiceForCroneJobService cj;
	
	@RequestMapping(method = RequestMethod.GET, path = "/chronejob")
	public List<Object> dojob() throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException
	{
		cj.updateWindowTransactionTable();
		return null;
	}
	
/*----Bidwindow missed -----*/
	
	@Autowired
	private MissedBidWindowEmailService missed;
	
	@RequestMapping(method = RequestMethod.GET, path = "/notificationforbidwindomissed")
	  public List<Object> windowmissinginccronjob(@RequestParam Long bidscheduleId,@RequestParam Long Empid,@RequestParam int Roundno,HttpServletRequest request ) throws UnsupportedEncodingException, MessagingException, ParseException, UnknownHostException 
		{
//		TestController t = new TestController();
//		String url = t.Home();
//		System.out.println("inside url:"+url);
			return this.missed.BiddingMissed(bidscheduleId, Empid, Roundno, home(request));
			//endNewBidWindowInformation(bidscheduleId,home(request));
	  }
	
/*--get IP Address Based on the AWS System Region --*/
	
	@Autowired
	private IdentifyAWSIPaddressService id;
	
	@RequestMapping(method = RequestMethod.GET, path = "/identify")
	  public String getIP() 
	{
		return this.id.Identify();
	}
	
	/*Bid Summary email*/
	
	@Autowired
	private BidSummaryEmailService summary;
	
	@RequestMapping(method = RequestMethod.GET, path = "/notificationforbidsummary")
	  public List<Object> BidSummary(@RequestParam Long bidscheduleId,@RequestParam Long Empid,HttpServletRequest request ) throws UnsupportedEncodingException, MessagingException, ParseException, UnknownHostException 
		{
//		TestController t = new TestController();
//		String url = t.Home();
//		System.out.println("inside url:"+url);
			return this.summary.BiddingSummary(bidscheduleId, Empid, home(request));
			//endNewBidWindowInformation(bidscheduleId,home(request));
	  }
	
	
	/*---------------------------------------------------------------------------------------------------*/

	/*** Table - role_permissions  <---> class - RolePermissionDetails ***/

	@Autowired
	private RolePermissionDetailsDao rp;
	
	@Autowired
	private RolePermissionService rpservice;
	@RequestMapping(method = RequestMethod.GET, path = "/allactions")
	public List<PermissionChild> getActions() throws ParseException
	{
	  List<RolePermissionDetails> prd = rp.findAll();
	  for(int i=0;i<prd.size();i++)
	  {
		  RolePermissionDetails pc = prd.get(i);
		  long pid = pc.getP_id();
		  rpservice.updateByPermissionId(pc, pid);
	  }
	  
	  List<PermissionChild> at = rp.getAllActions("Active");
	  return at;
	}
	
	
	@RequestMapping(method = RequestMethod.GET, path = "/getmodulenames")
	public List<String> modulenames()
	{
		return this.rp.getmodulenames();
	}
	
	
	/*---------------------------------------------------------------------------------------------------*/

	
	/*** Table - ref_facility_type  <---> class - FacilityType ***/
	
	@Autowired
	private FacilityTypeService fts;
	
	@Autowired
	private FacilityTypeDao ftdao;
	
	@GetMapping("/getallfacilitytypedetails")
	public List<FacilityType> getFacilityTypeDetails() throws ParseException
	{
		
		List<FacilityType> e1 = fts.getAll();
		return e1;
	}
	
	  @PostMapping("/savefacilitytypedetails") 
	  public FacilityType savedata(@RequestBody FacilityType data) throws ParseException
	  { 
		  
		  FacilityType e1 = fts.addoneItem(data);
		  return e1; 
	  
	  }
		

	  @RequestMapping(method = RequestMethod.PUT, value = "/updatefacilitytypedetails/{ftId}")
	  public FacilityType updateItem3(@RequestBody FacilityType fdata, @PathVariable("ftId") Long ftId) throws ParseException 
	  {
		  System.out.println("coming in");
		  FacilityType e1 = fts.updateByFacilityid(fdata, ftId);
		  return e1;
	  }
	  
	  @GetMapping("/getallfacilitytypenames")
		public List<FacilityTypeChild> getFacilityTypeNames() throws ParseException
		{
			
			List<FacilityTypeChild> e1 = ftdao.getFacilityTypeNames();
			return e1;
		}
	  
/*---------------------------------------------------------------------------------------------------*/

/*** Table - shift_category_master  <---> class - ShiftCategoryMaster ***/
		
		
	  @Autowired
	  private ShiftCategoryService shservice;
	  
	  @Autowired
	  private ShiftCategoryMasterDao shdao;
		
	  @GetMapping("/getallshiftcategorydetails")
	  public List<ShiftCategoryMaster> getShiftCategoryDetails() throws ParseException
	  {
			
			List<ShiftCategoryMaster> e1 = shservice.getAll();
			return e1;
	  }
		
	  @PostMapping("/saveshiftcategorydetails") 
	  public ShiftCategoryMaster savedata(@RequestBody ShiftCategoryMaster data) throws ParseException
	  { 
			  
		  ShiftCategoryMaster e1 = shservice.addoneItem(data);
		  return e1; 
	  }
			
	  @RequestMapping(method = RequestMethod.PUT, value = "/updateshiftcategorydetails/{shcId}")
	  public ShiftCategoryMaster updateItem3(@RequestBody ShiftCategoryMaster shdata, @PathVariable("shcId") Long shcId) throws ParseException 
	  {
			//System.out.println("coming in");
		  ShiftCategoryMaster e1 = shservice.updateByShiftcategory(shdata, shcId);
		  return e1;
			
	  }
	  
	  @GetMapping("/getallshiftcategorynames")
	  public List<ShiftCategoryChild> getShiftCategoryNames() throws ParseException
	  {
		  return shdao.getShiftCategoryNames();
	  }
	  

		@Autowired
		private BidScheduleParamParentDao parentDao;
		
		@Autowired
		//private CronJobForBasicWatchScheduleService basicWatchPost;
		private PostOneBasicWatchScheduleThroughService basicWatchPost;
		
		@Autowired
		private EmployeeVacationScheduleService vacationPost;
	  
	  
	  @PostMapping("/cronjobtopostbasicwatchschedule/{bid}") 
	  public void cronjob(@PathVariable long bid) throws ParseException, UnsupportedEncodingException, UnknownHostException, MessagingException
	  { 
			  
	      long bidscheduleid = bid;
	      
	    	  Optional<BidScheduleParamParent>  pData = parentDao.findById(bidscheduleid);
	    	  BidScheduleParamParent parentData = pData.get();
	    	  long bschid = parentData.getBidschid();
	    	  
	    	  System.out.println("Basic Watch Schedule Post Service is executed for One Bidschedule");
	    	  
	    	  if(parentData.getSummaryemail().equals("Completed"))
	    	  {
	    	  
	    	  if(parentData.getStatus().equals("Bidding Completed"))
	    	  {
	    		  //parentDao.updateBasicWatchScheduleStatus("Bidding Completed", bschid);
	    		  basicWatchPost.postDataForOneBasicWatchScheduleInTable(bid);
	    		  parentDao.updateBasicWatchScheduleStatus("Shift Only Posted", bschid);
	    		  vacationPost.postVacationDetails();
	    		  parentDao.updateBasicWatchScheduleStatus("Shift and Vacation Posted", bschid);
	    	  }
	    	  if(parentData.getStatus().equals("Shifts Assigned"))
	    	  {
	    		  basicWatchPost.postDataForOneBasicWatchScheduleInTable(bid);
	    		  parentDao.updateBasicWatchScheduleStatus("Shift Assigned and Posted", bschid);
	    	  }
	    	  if(parentData.getStatus().equals("Shift Assigned and Vacation Scheduled"))
	    	  {
	    		  basicWatchPost.postDataForOneBasicWatchScheduleInTable(bid);
	    		  parentDao.updateBasicWatchScheduleStatus("Shift Alone Posted", bschid);
	    		  vacationPost.postVacationDetails();
	    		  parentDao.updateBasicWatchScheduleStatus("Shift and Vacation Posted", bschid);
	    	  }
	    	  
	    	  }
	    	  
	      }
	    	  

}		