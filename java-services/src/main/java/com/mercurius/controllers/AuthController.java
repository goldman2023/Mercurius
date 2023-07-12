package com.mercurius.controllers;


import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.AddBidManager;
import com.mercurius.models.AddEmployee;
import com.mercurius.models.AreaReferenceForEmployee;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.FacilityReferenceForEmployee;
import com.mercurius.models.RolePermissionDetails;
import com.mercurius.models.TransactionTable;
import com.mercurius.models.UserToLogin;
import com.mercurius.models.UserWithAllDetails;
import com.mercurius.models.UserWithAllPermissions;
import com.mercurius.payload.request.LoginRequest;
import com.mercurius.payload.request.SignupRequest;
import com.mercurius.payload.response.JwtResponse;
import com.mercurius.payload.response.MessageResponse;
import com.mercurius.repository.AddBidManagerDao;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.AreaRefForEmpDao;
import com.mercurius.repository.BidScheduleMapEmployeeDetailsDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.FacilityRefForEmpDao;
import com.mercurius.repository.RolePermissionDetailsDao;
import com.mercurius.repository.TransactionTableDao;
import com.mercurius.repository.UserRepository;
import com.mercurius.security.jwt.JwtUtils;
import com.mercurius.security.services.BackendServiceForBidManagerService;
import com.mercurius.security.services.BackendServiceForEmployeeService;
import com.mercurius.security.services.UserDetailsImpl;

import net.bytebuddy.utility.RandomString;

@RestController
public class AuthController {
	//all services
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;
	
	@Autowired
	private BackendServiceForEmployeeService internalwork;
	
	@Autowired
	private AddEmployeeDao employee;
	
	@Autowired
	private BackendServiceForBidManagerService manager;
	
	@Autowired
	private AreaRefForEmpDao areaDao;
	
	@Autowired
	private FacilityRefForEmpDao facilityDao;
	
	@Autowired
	private BidScheduleMapEmployeeDetailsDao empMapDao;
	
	@Autowired
	private BidScheduleParamParentDao bidScheduleParentDao;
	
	@Autowired
	private AddEmployeeDao employeeDao;
	
	@Autowired
	private UserRepository userDetailsDao;
	
	@Autowired
	private AddBidManagerDao managerDao;
	
	@Autowired
	private TransactionTableDao ttd;
	
	@Autowired
	private RolePermissionDetailsDao permissionDao;

	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) throws ParseException {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		
		/*List<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toList());*/
		
		String user = loginRequest.getUsername();
		Optional<UserToLogin> user1 = userRepository.findByUsername(user);
		UserToLogin user2 = user1.get();
		boolean b1 = user2.isFpverify();
		
		if(b1==true) 
			//true means 1 , here if Fpverify = 1 when user logs in is turned to 0. 
			//This condition happens when user clicks the verify link in forgot
			//password but does not reset password
		{
			user2.setFpverify(false);
		}
		user2.setVerificationCode(null);
		userRepository.save(user2);
		//String emailid = user2.getUsername();
	    //AddEmployee empData = employee.getInfoForEmailAlone(user); 
	    
 	 		return ResponseEntity.ok(new JwtResponse(jwt, 
												 userDetails.getId(), 
												 userDetails.getUsername(),
												 userDetails.getPhone(),
												 userDetails.getVerificationCode(),
												 userDetails.getFirstname(),
												 userDetails.getLastname(),
												 userDetails.getRole_id_ref(),
												 userDetails.getStart_date(),
												 userDetails.getEnd_date(),
												 userDetails.getTrial_period(),
												 userDetails.getEnabled()
												 ));
 	 		
 	 		
	}

	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) throws ParseException {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) 
		{
			return ResponseEntity.ok(new MessageResponse("Error: Email is already in use!"));
		}
		
		String s1 = signUpRequest.getPhone();
		
		if(s1!=null&&s1!="")
		{
		if (userRepository.existsByPhone(signUpRequest.getPhone())) 
		{
			return ResponseEntity.ok(new MessageResponse("Error: Phone no is already in use!"));
		}
		}

		// Create new user's account
		UserToLogin user = new UserToLogin(signUpRequest.getUsername(), 
							 encoder.encode(signUpRequest.getPassword()), signUpRequest.getPhone(), signUpRequest.getVerificationCode(), 
							 signUpRequest.isEnabled(), signUpRequest.isFpverify(),signUpRequest.getFirstname(),signUpRequest.getLastname(),
							 signUpRequest.getRole_id_ref(),signUpRequest.getStart_date(),signUpRequest.getEnd_date(),signUpRequest.getTrial_period());
		
		String v1 = user.getVerificationCode();
		
		if(v1==null)
		{
		String randomCode = RandomString.make(64);
		user.setVerificationCode(randomCode);
		user.setEnabled(false);
		user.setFpverify(false);
		}
		
		String enddate = user.getEnd_date();
		int trialperiod = (int) user.getTrial_period();
		if((enddate==null)&&(trialperiod>0))
		{
		System.out.println("came inside");
		 String startdate = user.getStart_date();
		 trialperiod = (int) user.getTrial_period();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(sdf.parse(startdate));
		calendar.add(Calendar.DATE, trialperiod-1);  // number of days to add to your existing date
		 enddate = sdf.format(calendar.getTime());  // date is now the new date
		//System.out.println(startdate+","+endadte);
		user.setEnd_date(enddate);
		}
		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
	}
	
	@RequestMapping(value = "/emailexist", method = RequestMethod.POST)
	public ResponseEntity<?> registerUser3(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) 
		{
			return ResponseEntity.ok(new MessageResponse("Email Exists!"));
		}
		return ResponseEntity.ok(new MessageResponse("It's a new Email!"));
	}
	
	@RequestMapping(value = "/checkuserinfo", method = RequestMethod.POST)
	public UserToLogin registerUser1(@Valid @RequestBody SignupRequest signUpRequest) {
		
		String n1 = signUpRequest.getUsername();
		Optional<UserToLogin> userOpt = userRepository.findByUsername(n1);
		UserToLogin ud = userOpt.get();
		
		if (userRepository.existsByUsername(signUpRequest.getUsername())) 
		{
			//return ResponseEntity.ok(new MessageResponse("Email Exists!"));
			return ud;
		}
		else
		{
			return null;
		}
		
		//return ud;
	}
	
	@RequestMapping(value = "/phoneexist", method = RequestMethod.POST)
	public ResponseEntity<?> registerUser2(@Valid @RequestBody SignupRequest signUpRequest) {
		
		String s1 = signUpRequest.getPhone();
		
		if(s1!=null&&s1!="")
		{
		if (userRepository.existsByPhone(signUpRequest.getPhone())) 
		{
			return ResponseEntity.ok(new MessageResponse("Phone number Exists!"));
		}
		}
		
		return ResponseEntity.ok(new MessageResponse("Phone no is null or empty"));
	}
	
		@RequestMapping(method = RequestMethod.GET, path = "/getuserdetails")
	  public UserWithAllDetails getDetails(@RequestParam Long userId,@RequestParam Long roleId)
	  { 
		String areaname = null;
		String facilityname = null;
		Long areaid = 0L;
		Long facilityid = 0L;
		long bidScheduleId = 0L;
	    String bidScheduleName = null;
	    Map<Long, String> bmap = new HashMap<Long, String>();
		List<UserWithAllPermissions> permData = new ArrayList<UserWithAllPermissions>();
		UserWithAllDetails uData = new UserWithAllDetails();
		
		if(roleId==1)
		{
			//check in bidmanager table
			AddBidManager mData = managerDao.getByUserIdRef(userId);
			
			areaid = mData.getAreaid();
			System.out.println(areaid);
			Optional<AreaReferenceForEmployee> areaData = areaDao.findById(areaid);
			areaname = areaData.get().getAreaname();
			
			facilityid = mData.getFacailityIdRef();
			Optional<FacilityReferenceForEmployee> facilityData = facilityDao.findById(facilityid);
			facilityname = facilityData.get().getFacilityabbr();
			
			//get all permissions for this role
			List<TransactionTable> transactionData=	ttd.getActionsBasedOnRoleIdAndStatus(roleId, true);
			for(int i=0;i<transactionData.size();i++)
			{
				long permissionID = transactionData.get(i).getPermission_id();
				Optional<RolePermissionDetails> rprootData = permissionDao.findById(permissionID);
				String modulename = rprootData.get().getModu_name();
				String funcname = rprootData.get().getFunc_name();
				String actionname = rprootData.get().getAct_name();
				UserWithAllPermissions assignData = new UserWithAllPermissions();
				assignData.setModuleName(modulename);
				assignData.setFunctionName(funcname);
				assignData.setActionName(actionname);
				permData.add(assignData);
			}
			
			//get bidschedule with "posted" status for this managerid
			//have to take bidschedule ids where this manager id is an employee//PENDING TO DO
			List<BidScheduleParamParent> bpData = bidScheduleParentDao.getBidSchedulesByUserIdAndBidSummaryStatus(mData.getBidManagerId(),"Shift and Vacation Posted");
			for(int i=0;i<bpData.size();i++)
			{
				if( !(bpData.get(i).getSummaryemail()==null) && ( (bpData.get(i).getSummaryemail().equals("Shift and Vacation Posted")) || (bpData.get(i).getSummaryemail().equals("Shift Posted")) ) )
					{
						bidScheduleId = bpData.get(i).getBidschid();
						bidScheduleName = bpData.get(i).getBidschename();
						bmap.put(bidScheduleId, bidScheduleName);
					}
			}
			
			uData.setUserIdRef(userId);
			uData.setBidmanagerid(mData.getBidManagerId());
			uData.setAreaid(areaid);
			uData.setAreaname(areaname);
			uData.setFacilityid(facilityid);
			uData.setFacilityname(facilityname);
			uData.setPermissionDetails(permData);
			uData.setBidscheduleDetails(bmap);
		}
		
		if(roleId==2)
		{
			//check in employee detail table
			AddEmployee eData  = employeeDao.getDetailForUserIdRef(userId);
			
			areaid = eData.getAreaid();
			Optional<AreaReferenceForEmployee> areaData = areaDao.findById(areaid);
			areaname = areaData.get().getAreaname();
			
			facilityid = eData.getFacailityIdRef();
			Optional<FacilityReferenceForEmployee> facilityData = facilityDao.findById(facilityid);
			facilityname = facilityData.get().getFacilityabbr();
			
			//get all permissions for this role
			List<TransactionTable> transactionData=	ttd.getActionsBasedOnRoleIdAndStatus(roleId, true);
			for(int i=0;i<transactionData.size();i++)
			{
				long permissionID = transactionData.get(i).getPermission_id();
				Optional<RolePermissionDetails> rprootData = permissionDao.findById(permissionID);
				String modulename = rprootData.get().getModu_name();
				String funcname = rprootData.get().getFunc_name();
				String actionname = rprootData.get().getAct_name();
				UserWithAllPermissions assignData = new UserWithAllPermissions();
				assignData.setModuleName(modulename);
				assignData.setFunctionName(funcname);
				assignData.setActionName(actionname);
				permData.add(assignData);
			}
			
			List<Object> bidIds = empMapDao.getBidScheduleIdList(eData.getEmpid());
			
			
	 		for(int j=0;j<bidIds.size();j++)
	 		{
	 			long bId = (long) bidIds.get(j);
	 			//List<BidScheduleParamParent> bpData = bidScheduleParentDao.getBidScheduleWithCurrentDate(bId, today);
	 			Optional<BidScheduleParamParent> bpData = bidScheduleParentDao.findById(bId);
	 			if( !(bpData.get().getSummaryemail()==null) && ( (bpData.get().getSummaryemail().equals("Shift and Vacation Posted")) || (bpData.get().getSummaryemail().equals("Shift Posted")) ) )
	 			{
	 				bidScheduleId = bpData.get().getBidschid();
	 				bidScheduleName = bpData.get().getBidschename();
	 				bmap.put(bidScheduleId, bidScheduleName);
	 			}
	 		}
	 		
	 		uData.setUserIdRef(userId);
			uData.setEmpid((eData.getEmpid()));
			uData.setAreaid(areaid);
			uData.setAreaname(areaname);
			uData.setFacilityid(facilityid);
			uData.setFacilityname(facilityname);
			uData.setPermissionDetails(permData);
			uData.setBidscheduleDetails(bmap);
	 		
		}
		
		if(roleId==3)
		{
			
			//check guest in userdetails Table
			Optional<UserToLogin> userData = userDetailsDao.findById(userId);
			/*areaid = userData.get().getAreaId();
			if(areaid!=0)
			{
			Optional<AreaReferenceForEmployee> areaData = areaDao.findById(areaid);
			areaname = areaData.get().getAreaname();
			System.out.println(areaid+","+areaname);
			}
			
			facilityid = userData.get().getFacilityid();
			if(facilityid!=0)
			{
			Optional<FacilityReferenceForEmployee> facilityData = facilityDao.findById(facilityid);
			facilityname = facilityData.get().getFacilityabbr();
			System.out.println(facilityid+","+facilityname);
			}*/
			
			//get all permissions for this role
			List<TransactionTable> transactionData=	ttd.getActionsBasedOnRoleIdAndStatus(roleId, true);
			for(int i=0;i<transactionData.size();i++)
			{
				long permissionID = transactionData.get(i).getPermission_id();
				Optional<RolePermissionDetails> rprootData = permissionDao.findById(permissionID);
				String modulename = rprootData.get().getModu_name();
				String funcname = rprootData.get().getFunc_name();
				String actionname = rprootData.get().getAct_name();
				UserWithAllPermissions assignData = new UserWithAllPermissions();
				assignData.setModuleName(modulename);
				assignData.setFunctionName(funcname);
				assignData.setActionName(actionname);
				permData.add(assignData);
			}
			
	 		uData.setUserIdRef(userData.get().getId());
			uData.setAreaid(areaid);
			uData.setAreaname(areaname);
			uData.setFacilityid(facilityid);
			uData.setFacilityname(facilityname);
			uData.setPermissionDetails(permData);
			uData.setBidscheduleDetails(bmap);
		}
		return uData;
	  }

	
}
