package com.mercurius.controllers;

import java.text.ParseException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjuster;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.AddBidManager;
import com.mercurius.models.AddBidManagerChild;
import com.mercurius.models.AddEmployee;
import com.mercurius.models.AreaReferenceForEmployee;
import com.mercurius.models.EmployeeBasicWatchScheduleImposter;
import com.mercurius.models.EmployeeNotes;
import com.mercurius.models.FacilityReferenceForEmployee;
import com.mercurius.models.PayPeriodMaster;
import com.mercurius.models.PayperiodCheckRequest;
import com.mercurius.models.UserToLogin;
import com.mercurius.payload.response.MessageResponse;
import com.mercurius.repository.AddBidManagerDao;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.AreaRefForEmpDao;
import com.mercurius.repository.BidScheduleMapEmployeeDetailsDao;
import com.mercurius.repository.BidWindowDurationDao;
import com.mercurius.repository.EmployeeNotesDao;
import com.mercurius.repository.FacilityRefForEmpDao;
import com.mercurius.repository.PayPeriodDao;
import com.mercurius.repository.ShiftlineBiddingDao;
import com.mercurius.repository.UserRepository;
import com.mercurius.repository.VacationBiddingDao;
import com.mercurius.security.services.AddNewEmployeeService;
import com.mercurius.security.services.EmployeeBasicWatchScheduleServiceImpl;
import com.mercurius.security.services.EmployeeInfoService;
import com.mercurius.security.services.EmployeeInfoServiceImpl;
import com.mercurius.security.services.EmployeeNotesService;
import com.mercurius.security.services.PayPeriodCheckServiceImpl;

@RestController
public class EmployeeController {
	
/*** Table - employee_details <---> class - AddEmployee ***/
	
	@Autowired
	private UserRepository userlogin;
	
	@Autowired
	private BidWindowDurationDao duration1;
	
	@Autowired
	private VacationBiddingDao vacation1;
	
	@Autowired
	private ShiftlineBiddingDao shift1;
	
	@Autowired
	private UserRepository login;
	
	@Autowired
	private AddNewEmployeeService empservice;
	
	@Autowired
	private EmployeeInfoService empinfoservice;
	
	@Autowired
	private AreaRefForEmpDao areaDao;
	
	@Autowired
	private FacilityRefForEmpDao facilityDao;
	
	@Autowired
	private BidScheduleMapEmployeeDetailsDao empMapDao;
	
	@Autowired
	private AddBidManagerDao bidmanagerDao;

	@Autowired
	private EmployeeNotesDao employeeNotesDao;

	@Autowired
	private EmployeeNotesService employeeNotesService;

	@Autowired
	private PayPeriodDao payPeriodDao;

	@Autowired
	private EmployeeBasicWatchScheduleServiceImpl employeeBasicWatchScheduleServiceImpl;

	@Autowired
	private PayPeriodCheckServiceImpl payPeriodCheckServiceImpl;
	
	@GetMapping("/employeeall")
	public List<AddEmployee> getAllEmployeeInfo()
	{
		return this.empservice.getAllEmployeeInfo();
	}
	
	@GetMapping("/employeedetailbasedonempid/{uid}")
	public AddEmployee getEmpDetailsBasedonUserId(@PathVariable Long uid)
	{
		AddEmployee result = empservice.getbyId(uid);
		return result;
	}
	
	@RequestMapping(method = RequestMethod.POST, path = "/employeedetails") 
	public AddEmployee addoneItem2(@RequestBody AddEmployee emp)
	{
		return this.empservice.addoneItem(emp);
	}
	
	
	@RequestMapping(method = RequestMethod.PUT, value = "/employeedetailsupdate")
	public List<AddEmployee> updateListofEmployeeInitials(@RequestBody List<AddEmployee> empdata) 
	{
		return this.empservice.updateListOfEmployees(empdata);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/employeedetailsupdatebyempid/{eId}")
	public AddEmployee updateEmployeeInitalsById(@RequestBody AddEmployee empdata, @PathVariable("eId") Long empid) 
	{
		
		Long id = empid;
		AddEmployee ae = empdata;
		String initials = ae.getInitials();
		String emailid = ae.getEmail();
		String firstname = ae.getFname();
		String lastname = ae.getLname();
		long roleid = ae.getrole();
		duration1.updateInitials(initials, id);
		vacation1.updateInitials(initials, id);
		shift1.updateInitials(initials, id);
		duration1.updateNames(firstname, lastname, id);
		login.updateNames(firstname, lastname, roleid, emailid);//added roleid here
		return this.empservice.updateByEmpid(empdata,empid);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/employeedetailsupdatebymanagerid/{manId}")
	public AddEmployee updateByManagerId(@RequestBody AddEmployee empdata, @PathVariable("manId") Long manId) 
	{
		return this.empservice.updateByManagerid(empdata,manId);
	}
	
	@Autowired
	private AddEmployeeDao empdao;
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/employeedetailsdeletebybyempid/{eId}",produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> deleteBasedOnEmpId(@PathVariable("eId") Long eId)
	{
		Long s = eId;
		empdao.deleteById(eId);
		Optional<AddEmployee> user1 = empdao.findById(s);
		if(user1.isEmpty())
		{
			return ResponseEntity.ok(new MessageResponse("successfully deleted"));
		}
		else
		{
			return ResponseEntity.ok(new MessageResponse("failed"));
		}
	}
	
	
	List<Object> EmptyList = new ArrayList<Object>(); 
	
	@GetMapping("/employee/{email}")
	public List<Object> getInfoForEmail(@PathVariable String email)
	{
		List<Object> user = empdao.getInfoForEmail(email);
		if(user!=null)
		{
		return user;
		}
		else
		{
		return EmptyList;
		}
	}	
	
	@GetMapping("/employeeinitialslist/{qname}") //get entire employee details based on qualification selected
	public List<Object> getEmpDtailsBasedonQualification(@PathVariable String qname)
	{
		
		List<Object> result = empdao.getNamesBasedOnQualification(qname);
		return result;
	}
	
	@GetMapping("/employeelistbasedonuserid/{uid}") //get entire employee details based on managerid who added them
	public List<Object> getEmpDtailsBasedonUserId(@PathVariable Long uid,@RequestParam short status)
	{

		List<Object> result = empdao.getNamesBasedOnUserId(uid,status);
		return result;
	}
	@GetMapping("/employeelistwithareabasedonuserid/{uid}") //get entire employee details based on managerid who added them
	public List<Object> getEmpDtailsBasedonUserIdwithEagerloading(@PathVariable Long uid)
	{
		List<Object[]> result = empdao.getEmployeesWithAreaAndFacilityNamesByManagerId(uid);
		empinfoservice = new EmployeeInfoServiceImpl();
		return empinfoservice.getEmployeelistWithAreaFacility(result);
	}
	List<Long> temp2=new ArrayList<Long>();
	@GetMapping("/employeeidlist/{qname}")
	public List<Long> getIdBasedOnQualification(@PathVariable String qname)
	{
		temp2.addAll(empdao.getUserIdsBasedOnQualification(qname));
		LinkedHashSet<Long> hashSet1 = new LinkedHashSet<>(temp2);
		List<Long> listids = new ArrayList<>(hashSet1);
		return listids;
	}
	
	
	@RequestMapping(value = "/employeeinitialexist/{initial}", method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
	public String findInitialsDuplicated(@PathVariable String initial)
	{
		if(empdao.existsByInitials(initial)==true)
		{
			return "Initials Exist";
		}
		else
		{
			return "New Initials";
		}
	}
	
	List<String> temp3=new ArrayList<String>();
	
	@RequestMapping(value = "/employeeinitialcheck", method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
	public  ResponseEntity<?> findInitialsDuplication(@RequestParam Long managerid,@RequestParam String initials)
	{
		int count1 = 0;
		int count2 = 0;
		temp3.addAll(empdao.getInitialsList(managerid));
		System.out.println(temp3);
		
		for(int i=0;i<temp3.size();i++)
		{
			if(temp3.get(i).equalsIgnoreCase(initials))
			{
				count1++;
			}
			else
			{
				count2++;
			}
		}
		temp3.clear();
		
		if(count1!=0)
		{
			return ResponseEntity.ok(new MessageResponse( "Initials Exist"));
		}
		else
		{
			return ResponseEntity.ok(new MessageResponse( "New Initials"));
		}
		
	}
	
	
	@RequestMapping(method = RequestMethod.GET, value = "/employeeemailexist/{email}",produces = MediaType.APPLICATION_JSON_VALUE)
	   public ResponseEntity<?> emailexist(@PathVariable("email") String email) 
	 {
		String eid = email;
		Optional<AddEmployee> data = empdao.getDetailForEmail(eid);
		if(data.isEmpty())
		{
			return ResponseEntity.ok(new MessageResponse("email does not exist"));
		}
		else
		{
			return ResponseEntity.ok(new MessageResponse("email exists!"));
		}					
							
	  }
	
	@RequestMapping(value = "/employeedetailsbasedoninitialsandmanagerid", method = RequestMethod.GET)
	public  List<Object> EmployeedetailbyInitials(@RequestParam Long managerid,@RequestParam String initials)
	{
		List<Object> result = empdao.getEmployeedetailsbyInitials(managerid,initials);
		return result;
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/employeestatuschange/{empId}")
	public void updateemployeestatus(@RequestParam short status,@PathVariable("empId") long empId) throws NumberFormatException, ParseException {
		 empdao.EmployeeStatusChange(status, empId);
		 return;
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/changeemployeetobidmanager/{email}",produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> changeemptobidmanager(@PathVariable("email") String email)
	{
		String s = email;
		Optional<UserToLogin> u5 = userlogin.getdetailForEmail(s);
		if(!u5.isPresent())
		{
			
			return ResponseEntity.ok(new MessageResponse("Not registered!"));
			
		}
		else
		{
			
			Optional<UserToLogin> u1 = userlogin.getdetailForEmail(s);
			Optional<AddEmployee> u3 = empdao.getDetailForEmail(s);
			UserToLogin u2 = u1.get();
			Long primaryid = u2.getId();
			AddEmployee u4 = u3.get();
			Long empid = u4.getEmpid();
			long roleid = 1;
			userlogin.UserToBidManager(roleid, primaryid);
			empdao.EmployeeToBidManager(roleid, empid);
			return ResponseEntity.ok(new MessageResponse("Added as bidmanager!"));//in both userlogin and employeedetails table
		}
	}
	
	@GetMapping("/employeelistbasedonmanagerid/{mid}") //get entire employee details based on managerid who added them
	public List<Object> getEmpDtailsBasedonmanagerId(@PathVariable Long mid)
	{
		
		List<Object> result = empdao.getEmpNamesBasedOnUserId(mid);
		return result;
	}
	
	@GetMapping("/facilityareadropdown") 
	public List<Object> getdata()
	{
		
		List<Object> areaIds = empdao.distinctAreaIds();
		List<Object> dList = new ArrayList<>();
				for(int i=0;i<areaIds.size();i++)
				{		
					long aId = (long) areaIds.get(i);
					//System.out.println("Id:"+aId);
					if(aId>0)
					{
						Optional<AreaReferenceForEmployee> areaRefData = areaDao.findById(aId);
						String areaName = areaRefData.get().getAreaname();
						//System.out.println("areaname:"+areaName);
						long facilityIdRef = areaRefData.get().getFacilityidref();
						Optional<FacilityReferenceForEmployee> facilityData = facilityDao.findById(facilityIdRef);
						String facilityAbbr = facilityData.get().getFacilityabbr();
						//System.out.println("facilityAbbr:"+facilityAbbr);
						String dropList = facilityAbbr+" - "+areaName;
						dList.add(dropList);
						System.out.println(dropList);
					}
					
				}
		return dList;
	}
	
	@GetMapping("/employeelistbasedonbidscheduleid/{bid}") 
	public List<AddEmployee> getEmployeeDetaiilsByBidSchId(@PathVariable Long bid)
	{
		
		List<Object> empids = empMapDao.getEmployeesforBidscheduleIdAlone(bid);
		List<AddEmployee> empList = new ArrayList<AddEmployee>();
		System.out.println(empids.size());
		for(int i=0;i<empids.size();i++)
		{
			long empid = (long) empids.get(i);
			Optional<AddEmployee> empData = empdao.getDetailForEmpId(empid);
			empList.add(empData.get());
		}
		
		return empList;
	}
	
	@GetMapping("/managerdetailsofanemployee/{empid}") //get entire employee details based on managerid who added them
	public AddBidManagerChild getBidManagerDetails(@PathVariable Long empid)
	{
		AddBidManagerChild managerDetails = new AddBidManagerChild();
		Optional<AddEmployee> result = empdao.findById(empid);
		Optional<AddBidManager> managerData = bidmanagerDao.findById(result.get().getManagerid());
		managerDetails.setBidManagerId(managerData.get().getBidManagerId());
		managerDetails.setFname(managerData.get().getFname());
		managerDetails.setLname(managerData.get().getLname());
		return managerDetails;
	}
	
	@PostMapping("/employeenotes")
	public ResponseEntity<String> saveEmployeeNotes(@RequestBody EmployeeNotes employeeNotes) {

		EmployeeNotes en = employeeNotes;
		if(en.getId() != null){
			boolean isUpdated = employeeNotesService.updateEmployeeById(en.getId(), en);

			if (isUpdated) {
				return ResponseEntity.ok("Employee updated successfully");
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
			}
		} else {
			employeeNotesDao.save(employeeNotes);
		}

		return ResponseEntity.status(HttpStatus.CREATED).body("Employee notes saved successfully");
	}

	@GetMapping("/employeenotes/{empid}/{manageid}")
	public List<EmployeeNotes> getEmployeeNotesByEmpidandManageId(@PathVariable Long empid, @PathVariable Long manageid)
	{
		List<EmployeeNotes> result = employeeNotesDao.getEmployeeNotesByEmpIdAndManageId(empid, manageid);
		return result;
	}
	
	@PostMapping(value="/check_payperiod")
	public List<String> checkPayPeriodAndShiftLine(@RequestBody PayperiodCheckRequest empdata) {
		//  empdata.get('date')
		PayperiodCheckRequest pc = empdata;
		Long bidscheduleid = pc.getBidscheduleid();
		Long empid = pc.getEmpid();
		String date = pc.getDate();
		List<String> shift_line = pc.getShift_line();
		Long shift_length = pc.getShift_length();
		// LocalDate start_date_of_week = LocalDate.parse(date).with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
		// LocalDate end_date_of_week = LocalDate.parse(date).with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY));
		
		int time = pc.getTime();

		List<Object> convertedList = new ArrayList<>();
        
        for (String s : shift_line) {
            try {
                // Try to parse the string to an integer and divide by 100
                int parsed = Integer.parseInt(s) / 100;
                convertedList.add(parsed);
            } catch (NumberFormatException e) {
                // If it's not a number, add it as is
                convertedList.add(s);
            }
        }
		PayPeriodMaster result = payPeriodDao.findPayPeriodInfoByDate(date);
		List<EmployeeBasicWatchScheduleImposter> empinfo = employeeBasicWatchScheduleServiceImpl.getBasicWatchShiftBasedOnDateRangeAndBidScheduleIdAndEmpid(bidscheduleid,
		empid, result.getStart_date(), result.getEnd_date());
		// System.out.println("empinfo1="+start_date_of_week);
		
		for (EmployeeBasicWatchScheduleImposter employee : empinfo) {
			if (date.equals(employee.getDate())) {
				employee.setTime(time);
			}
		}
		// System.out.println("empinfo2="+end_date_of_week);
				
		// payPeriodCheckServiceImpl.checkPayPeriod(empinfo);
		return payPeriodCheckServiceImpl.checkPayPeriod(convertedList,shift_length,empinfo);
	}
	
	@GetMapping("/employeenotes")
	public List<EmployeeNotes> getEmployeeNotesByEmpidandSubmittedForDate(@RequestParam Long empid, @RequestParam(value="submittedfordate") @DateTimeFormat(pattern="yyyy-MM-dd") Date submittedfordate)
	{
		List<EmployeeNotes> result = employeeNotesDao.getEmployeeNotesByEmpIdAndSubmittedForDate(empid, submittedfordate);
		return result;
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/employeedetailsdeletebybyempidandsubmiteeddate",produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> deleteBasedOnEmpIdandSubmittedForDate(@RequestParam("empid") Long empid, @RequestParam(value="submittedfordate") @DateTimeFormat(pattern="yyyy-MM-dd") Date submittedfordate)
	{
		List<EmployeeNotes> result = employeeNotesDao.getEmployeeNotesByEmpIdAndSubmittedForDate(empid, submittedfordate);
		for(int i=0;i<result.size();i++)
		{		
			Long noteId = result.get(i).getId();
			employeeNotesDao.deleteById(noteId);
		}
		return ResponseEntity.status(HttpStatus.CREATED).body("Employee notes deleted successfully");
		
	}
	
	@RequestMapping(method = RequestMethod.DELETE, value = "/employeedetailsdeletebybynotesid/{notesid}",produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> deleteBasedOnNotesId(@PathVariable("notesid") Long notesid)
	{
		employeeNotesService.deleteByNotesId(notesid);
		return ResponseEntity.status(HttpStatus.CREATED).body("Employee note got deleted successfully");
		
	}
	
	@GetMapping("/employeenotes/{empid}")
	public List<EmployeeNotes> getEmployeeNotesByEmpid(@PathVariable Long empid)
	{
		List<EmployeeNotes> result = employeeNotesDao.getEmployeeNotesByEmpId(empid);
		return result;
	}
	
}
