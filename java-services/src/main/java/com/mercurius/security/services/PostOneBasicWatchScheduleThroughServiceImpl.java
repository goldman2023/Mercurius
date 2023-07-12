package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.BidScheduleMapShiftlineSchedule;
import com.mercurius.models.DateTimeFormatConverters;
import com.mercurius.models.EmployeeBasicWatchSchedule;
import com.mercurius.models.ShiftLineWorkForceDetails;
import com.mercurius.models.ShiftlineBidding;
import com.mercurius.models.Shiftlinechild;
import com.mercurius.models.Shiftlinescheduleparent;
import com.mercurius.repository.BidScheduleMapShiftlineScheduleDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.EmployeeBasicWatchScheduleDao;
import com.mercurius.repository.ShiftLineWorkForceDetailsDao;
import com.mercurius.repository.ShiftlineBiddingDao;
import com.mercurius.repository.ShiftlinechildDao;
import com.mercurius.repository.ShiftllinescheduleparentDao;

@Service
public class PostOneBasicWatchScheduleThroughServiceImpl implements PostOneBasicWatchScheduleThroughService {

	
	@Autowired
	private BidScheduleParamParentDao parentDao;
	
	@Autowired
	private BidScheduleMapShiftlineScheduleDao shiftMapDao;
	
	@Autowired
	private ShiftLineWorkForceDetailsDao workForceDao;
	
	@Autowired
	private ShiftlineBiddingDao shiftlinebidddingDao;
	
	@Autowired
	private ShiftllinescheduleparentDao shiftParentDao;
	
	@Autowired
	private EmployeeBasicWatchScheduleDao watchParentDao;
	
	@Autowired
	private EmployeeBasicWatchScheduleService basicwatchShift;
	
	@Autowired
	private ShiftlinechildDao shiftlineChilddao;
	
	@Autowired
	private EmployeePostedWatchScheduleService postedService;
	
	
	@Override
	public List<Object> postDataForOneBasicWatchScheduleInTable(long bidId)
			throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException {
	
			//List<Long> bidids = parentDao.getBidids("Completed"); comment for now
			//System.out.println("bidschedule size:"+bidids.size());
			
			//for(int i=0;i<bidids.size();i++)comment for now
			//for(int i=0;i<1;i++)
			//{
					//long bidScheduleId = bidids.get(i);comment for now
					long bidScheduleId = bidId;
					//System.out.println("BID SCHEDULE ID selected:"+bidScheduleId);
					List<Long> shiftLineScheduleIds = shiftMapDao.getShiftLineScheduleIdRefs(bidScheduleId);
					
				if(shiftLineScheduleIds.size()!=0)
				{
					
					for(int j=0;j<shiftLineScheduleIds.size();j++)
					{
						long shiftScheduleId = shiftLineScheduleIds.get(j);
						//System.out.println("SHIFT LINE SCHEDULE ID executed:"+shiftScheduleId);
						BidScheduleMapShiftlineSchedule shiftMapData = shiftMapDao.getShiftLineScheduledates(shiftScheduleId,bidScheduleId);
						Date shiftStartdDate = shiftMapData.getShiftdefstartdate();
						Date shiftEndDate = shiftMapData.getShiftdefenddate();
						DateTimeFormatConverters convert = new DateTimeFormatConverters();
						//System.out.println(shiftStartdDate+",,"+shiftEndDate);
						
						Optional<Shiftlinescheduleparent> shiftParentData = shiftParentDao.findById(shiftScheduleId);
						int areaIdRef = shiftParentData.get().getAreaid();
						long manId = shiftParentData.get().getUserid();
						//System.out.println("AREA ID:"+areaIdRef);
						
						//shiftlinebidddingDao.updateWindowStatus("Selected", shiftScheduleId,bidScheduleId);
						List<ShiftlineBidding> shiftBiddingDataBefore = shiftlinebidddingDao.getBasedOnShiftLineIdRefAndBidScheduleId(shiftScheduleId,bidScheduleId);
						int selectedEmpCount = shiftBiddingDataBefore.size();
						//System.out.println("No of employees selected:"+selectedEmpCount);
						
						Calendar start = Calendar.getInstance();
						start.setTime(shiftStartdDate);
						//System.out.println("shiftStartdDate:"+shiftStartdDate);
						Calendar end = Calendar.getInstance();
						end.setTime(shiftEndDate);
						//System.out.println("shiftEndDate:"+shiftEndDate);
						for (Date date = start.getTime(); !start.after(end); start.add(Calendar.DATE, 1), date = start.getTime()) 
						{
						    //System.out.println(date);
							int yearref = date.getYear()+1900;
							String startDate = convert.Conversion(date, 2);
							String dateAbbrevation = convert.Conversion(date, 3);
							//System.out.println(startDate+","+dateAbbrevation);
							
							List<ShiftLineWorkForceDetails> workForceData = workForceDao.getbyShiftBasedOnDay(dateAbbrevation, shiftScheduleId);
							//System.out.println("workForceData Time size:"+workForceData.size());
						if(workForceData.isEmpty())
						{
							break;
						}
						
						else
						{	
							
							shiftlinebidddingDao.updateWindowStatus("Selected", shiftScheduleId, bidScheduleId);
							
							switch (dateAbbrevation)
							{
								case "Mon":
									System.out.println("Monday");
									List<ShiftlineBidding> mData = shiftlinebidddingDao.getShiftsBasedOnTwoShiftName("SM", "MT", shiftScheduleId, bidScheduleId);
									for(int z=0;z<mData.size();z++)
									{
										//System.out.println("empid:"+mData.get(z).getEmpidref());
										EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
										ShiftlineBidding monEmpData = mData.get(z);
										long shiftIdAllocated = monEmpData.getBidid();
										
										watchData.setBidscheduleid(monEmpData.getBidschidref());
										watchData.setManagerid(manId);
										watchData.setEmpid(monEmpData.getEmpidref());
										watchData.setEmpinitials(monEmpData.getInitials());
										watchData.setAreaid(areaIdRef);
										watchData.setYear(yearref);
										watchData.setDate(startDate);
										watchData.setTime(0);
										watchData.setRdoDayOff("X");
										long shiftidref = monEmpData.getShiftlineidref();
										Optional<Shiftlinechild> schild = shiftlineChilddao.findById(shiftidref);
										watchData.setDuration(schild.get().getShiftdurationc());
										basicwatchShift.addoneItem(watchData);
										shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
										
										/*EmployeePostedWatchSchedule postData = new EmployeePostedWatchSchedule();
										postData.setBidscheduleid(monEmpData.getBidschidref());
										postData.setManagerid(manId);
										postData.setEmpid(monEmpData.getEmpidref());
										postData.setEmpinitials(monEmpData.getInitials());
										postData.setAreaid(areaIdRef);
										postData.setYear(yearref);
										postData.setDate(startDate);
										postData.setTime(0);
										postData.setRdoDayOff("X");
										long shiftidrefdup = monEmpData.getShiftlineidref();
										Optional<Shiftlinechild> schilddup = shiftlineChilddao.findById(shiftidrefdup);
										watchData.setDuration(schilddup.get().getShiftdurationc());
										//System.out.println("postdata:"+postData);
										postedService.addoneItem(postData);*/
										
									}
									
									for(int k=0;k<workForceData.size();k++)
									{
										long empCountOnMonday = workForceData.get(k).getCountOfEmp();
										int durationRef = workForceData.get(k).getShiftDuration();
										long managerIdRef = workForceData.get(k).getManagerIdRef();
										int shiftTimeRef = workForceData.get(k).getShiftTime();
												
										if(empCountOnMonday>0)
										{
											List<ShiftlineBidding> mondayData = shiftlinebidddingDao.getShifts(shiftScheduleId,"Selected", "M", bidScheduleId);
											
											for(int l=0;l<empCountOnMonday;l++)
											{
													
													EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
													ShiftlineBidding monEmpData = mondayData.get(l);
													long shiftIdAllocated = monEmpData.getBidid();
													
													watchData.setBidscheduleid(monEmpData.getBidschidref());
													watchData.setManagerid(managerIdRef);
													watchData.setEmpid(monEmpData.getEmpidref());
													watchData.setEmpinitials(monEmpData.getInitials());
													watchData.setAreaid(areaIdRef);
													watchData.setYear(yearref);
													watchData.setDate(startDate);
													watchData.setTime(shiftTimeRef);
													watchData.setDuration(durationRef);
													basicwatchShift.addoneItem(watchData);																	
													shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
													
											}
										}
									}
									break;
									
								case "Tue":
									System.out.println("Tuesday");
									List<ShiftlineBidding> tueData = shiftlinebidddingDao.getShiftsBasedOnTwoShiftName("MT", "TW", shiftScheduleId, bidScheduleId);
									for(int z=0;z<tueData.size();z++)
									{
										
										EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
										ShiftlineBidding tueEmpData = tueData.get(z);
										long shiftIdAllocated = tueEmpData.getBidid();
										
										watchData.setBidscheduleid(tueEmpData.getBidschidref());
										watchData.setManagerid(manId);
										watchData.setEmpid(tueEmpData.getEmpidref());
										watchData.setEmpinitials(tueEmpData.getInitials());
										watchData.setAreaid(areaIdRef);
										watchData.setYear(yearref);
										watchData.setDate(startDate);
										watchData.setTime(0);
										watchData.setRdoDayOff("X");
										long shiftidref = tueEmpData.getShiftlineidref();
										Optional<Shiftlinechild> schild = shiftlineChilddao.findById(shiftidref);
										watchData.setDuration(schild.get().getShiftdurationc());
										basicwatchShift.addoneItem(watchData);											
										shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
									}
									
									for(int k=0;k<workForceData.size();k++)
									{
										long empCountOnTuesday = workForceData.get(k).getCountOfEmp();
										int durationRef = workForceData.get(k).getShiftDuration();
										long managerIdRef = workForceData.get(k).getManagerIdRef();
										int shiftTimeRef = workForceData.get(k).getShiftTime();
												
										if(empCountOnTuesday>0)
										{
											List<ShiftlineBidding> tuesdayData = shiftlinebidddingDao.getShiftsForTwoConditions(bidScheduleId,shiftScheduleId,"Selected", "MT","TW");
										
											for(int l=0;l<empCountOnTuesday;l++)
											{
													
													EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
													ShiftlineBidding tueEmpData = tuesdayData.get(l);
													long shiftIdAllocated = tueEmpData.getBidid();
													
													watchData.setBidscheduleid(tueEmpData.getBidschidref());
													watchData.setManagerid(managerIdRef);
													watchData.setEmpid(tueEmpData.getEmpidref());
													watchData.setEmpinitials(tueEmpData.getInitials());
													watchData.setAreaid(areaIdRef);
													watchData.setYear(yearref);
													watchData.setDate(startDate);
													watchData.setTime(shiftTimeRef);
													watchData.setDuration(durationRef);
													basicwatchShift.addoneItem(watchData);
													shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
													
											}
										}
									}
									break;
								
								case "Wed":
									System.out.println("wednesday");
									List<ShiftlineBidding> wedData = shiftlinebidddingDao.getShiftsBasedOnTwoShiftName("TW", "WT", shiftScheduleId, bidScheduleId);
									for(int z=0;z<wedData.size();z++)
									{
										
										EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
										ShiftlineBidding wedEmpData = wedData.get(z);
										long shiftIdAllocated = wedEmpData.getBidid();
										
										watchData.setBidscheduleid(wedEmpData.getBidschidref());
										watchData.setManagerid(manId);
										watchData.setEmpid(wedEmpData.getEmpidref());
										watchData.setEmpinitials(wedEmpData.getInitials());
										watchData.setAreaid(areaIdRef);
										watchData.setYear(yearref);
										watchData.setDate(startDate);
										watchData.setTime(0);
										watchData.setRdoDayOff("X");
										long shiftidref = wedEmpData.getShiftlineidref();
										Optional<Shiftlinechild> schild = shiftlineChilddao.findById(shiftidref);
										watchData.setDuration(schild.get().getShiftdurationc());
										basicwatchShift.addoneItem(watchData);			
										shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
									
									}
									
									for(int k=0;k<workForceData.size();k++)
									{
										long empCountOnWednesday = workForceData.get(k).getCountOfEmp();
										int durationRef = workForceData.get(k).getShiftDuration();
										long managerIdRef = workForceData.get(k).getManagerIdRef();
										int shiftTimeRef = workForceData.get(k).getShiftTime();
												
										if(empCountOnWednesday>0)
										{	
											List<ShiftlineBidding> wednesdayData = shiftlinebidddingDao.getShifts(shiftScheduleId,"Selected", "W", bidScheduleId);

											for(int l=0;l<empCountOnWednesday;l++)
											{
													//System.out.println("ASSIGNMENT Time: "+workForceData.get(k).getShiftTime()+","+"no of emp: "+workForceData.get(k).getCountOfEmp());
													
													EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
													ShiftlineBidding wedEmpData = wednesdayData.get(l);
													long shiftIdAllocated = wedEmpData.getBidid();
													
													watchData.setBidscheduleid(wedEmpData.getBidschidref());
													watchData.setManagerid(managerIdRef);
													watchData.setEmpid(wedEmpData.getEmpidref());
													watchData.setEmpinitials(wedEmpData.getInitials());
													watchData.setAreaid(areaIdRef);
													watchData.setYear(yearref);
													watchData.setDate(startDate);
													watchData.setTime(shiftTimeRef);
													watchData.setDuration(durationRef);
													//System.out.println("data stored in db");
													basicwatchShift.addoneItem(watchData);
													
													shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
													
											}
										}
									}					
									break;
									
								case "Thu":
									System.out.println("Thursday");
									//System.out.println("thursday coming pepoles");
									List<ShiftlineBidding> thursData = shiftlinebidddingDao.getShiftsBasedOnTwoShiftName("WT", "TF", shiftScheduleId, bidScheduleId);
									for(int z=0;z<thursData.size();z++)
									{
										//System.out.println(thursData.get(z).getInitials());
										EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
										ShiftlineBidding thursEmpData = thursData.get(z);
										long shiftIdAllocated = thursEmpData.getBidid();
										
										watchData.setBidscheduleid(thursEmpData.getBidschidref());
										watchData.setManagerid(manId);
										watchData.setEmpid(thursEmpData.getEmpidref());
										watchData.setEmpinitials(thursEmpData.getInitials());
										watchData.setAreaid(areaIdRef);
										watchData.setYear(yearref);
										watchData.setDate(startDate);
										watchData.setTime(0);
										watchData.setRdoDayOff("X");
										long shiftidref = thursEmpData.getShiftlineidref();
										Optional<Shiftlinechild> schild = shiftlineChilddao.findById(shiftidref);
										watchData.setDuration(schild.get().getShiftdurationc());
										//System.out.println(watchData);
										//System.out.println("data stored in db");
										basicwatchShift.addoneItem(watchData);
										
										shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
									
									}
									
									for(int k=0;k<workForceData.size();k++)
									{
										long empCountOnThursday = workForceData.get(k).getCountOfEmp();
										int durationRef = workForceData.get(k).getShiftDuration();
										long managerIdRef = workForceData.get(k).getManagerIdRef();
										int shiftTimeRef = workForceData.get(k).getShiftTime();
												
										if(empCountOnThursday>0)
										{
											
											List<ShiftlineBidding> thursdayData = shiftlinebidddingDao.getShiftsForTwoConditions(bidScheduleId, shiftScheduleId,"Selected", "WT","TF");
											//System.out.println("no of employees without Thursday:"+thursdayData.size());
											
											for(int l=0;l<empCountOnThursday;l++)
											{
													//System.out.println("ASSIGNMENT Time: "+workForceData.get(k).getShiftTime()+","+"no of emp: "+workForceData.get(k).getCountOfEmp());
													
													EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
													ShiftlineBidding thuEmpData = thursdayData.get(l);
													long shiftIdAllocated = thuEmpData.getBidid();
													
													watchData.setBidscheduleid(thuEmpData.getBidschidref());
													watchData.setManagerid(managerIdRef);
													watchData.setEmpid(thuEmpData.getEmpidref());
													watchData.setEmpinitials(thuEmpData.getInitials());
													watchData.setAreaid(areaIdRef);
													watchData.setYear(yearref);
													watchData.setDate(startDate);
													watchData.setTime(shiftTimeRef);
													watchData.setDuration(durationRef);
													//System.out.println("data stored in db");
													basicwatchShift.addoneItem(watchData);
													
													shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
													
											}
										}
									}
									break;
									
								case "Fri":
									System.out.println("Friday");
									//System.out.println("friday coming pepoles");
									List<ShiftlineBidding> friData = shiftlinebidddingDao.getShiftsBasedOnTwoShiftName("TF", "FS", shiftScheduleId, bidScheduleId);
									for(int z=0;z<friData.size();z++)
									{
										//System.out.println(friData.get(z).getInitials());
										EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
										ShiftlineBidding friEmpData = friData.get(z);
										long shiftIdAllocated = friEmpData.getBidid();
										
										watchData.setBidscheduleid(friEmpData.getBidschidref());
										watchData.setManagerid(manId);
										watchData.setEmpid(friEmpData.getEmpidref());
										watchData.setEmpinitials(friEmpData.getInitials());
										watchData.setAreaid(areaIdRef);
										watchData.setYear(yearref);
										watchData.setDate(startDate);
										watchData.setTime(0);
										watchData.setRdoDayOff("X");
										long shiftidref = friEmpData.getShiftlineidref();
										Optional<Shiftlinechild> schild = shiftlineChilddao.findById(shiftidref);
										watchData.setDuration(schild.get().getShiftdurationc());
										//System.out.println(watchData);
										//System.out.println("data stored in db");
										basicwatchShift.addoneItem(watchData);
										
										shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
									
									}
									
									for(int k=0;k<workForceData.size();k++)
									{
										long empCountOnFriday = workForceData.get(k).getCountOfEmp();
										int durationRef = workForceData.get(k).getShiftDuration();
										long managerIdRef = workForceData.get(k).getManagerIdRef();
										int shiftTimeRef = workForceData.get(k).getShiftTime();
												
										if(empCountOnFriday>0)
										{
											
											List<ShiftlineBidding> fridayData = shiftlinebidddingDao.getShifts(shiftScheduleId,"Selected", "F", bidScheduleId);
											//System.out.println("no of employees without Friday:"+fridayData.size());
											
											for(int l=0;l<empCountOnFriday;l++)
											{
													//System.out.println("ASSIGNMENT Time: "+workForceData.get(k).getShiftTime()+","+"no of emp: "+workForceData.get(k).getCountOfEmp());
													
													EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
													ShiftlineBidding friEmpData = fridayData.get(l);
													long shiftIdAllocated = friEmpData.getBidid();
													
													watchData.setBidscheduleid(friEmpData.getBidschidref());
													watchData.setManagerid(managerIdRef);
													watchData.setEmpid(friEmpData.getEmpidref());
													watchData.setEmpinitials(friEmpData.getInitials());
													watchData.setAreaid(areaIdRef);
													watchData.setYear(yearref);
													watchData.setDate(startDate);
													watchData.setTime(shiftTimeRef);
													watchData.setDuration(durationRef);
													//System.out.println("data stored in db");
													basicwatchShift.addoneItem(watchData);
													
													shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
													
											}
										}
									}
								
									break;
									
								case "Sat":
									System.out.println("Saturday");
									System.out.println("saturday coming pepoles");
									List<ShiftlineBidding> satData = shiftlinebidddingDao.getShiftsBasedOnTwoShiftName("FS", "SS", shiftScheduleId, bidScheduleId);
									for(int z=0;z<satData.size();z++)
									{
										System.out.println(satData.get(z).getInitials());
										EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
										ShiftlineBidding satEmpData = satData.get(z);
										long shiftIdAllocated = satEmpData.getBidid();
										
										watchData.setBidscheduleid(satEmpData.getBidschidref());
										watchData.setManagerid(manId);
										watchData.setEmpid(satEmpData.getEmpidref());
										watchData.setEmpinitials(satEmpData.getInitials());
										watchData.setAreaid(areaIdRef);
										watchData.setYear(yearref);
										watchData.setDate(startDate);
										watchData.setTime(0);
										watchData.setRdoDayOff("X");
										long shiftidref = satEmpData.getShiftlineidref();
										Optional<Shiftlinechild> schild = shiftlineChilddao.findById(shiftidref);
										watchData.setDuration(schild.get().getShiftdurationc());
										//System.out.println(watchData);
										//System.out.println("data stored in db");
										basicwatchShift.addoneItem(watchData);
										
										shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
										System.out.println("completed saturday");
									}
									
									for(int k=0;k<workForceData.size();k++)
									{
										System.out.println("saturday workforce");
										long empCountOnSaturday = workForceData.get(k).getCountOfEmp();
										int durationRef = workForceData.get(k).getShiftDuration();
										long managerIdRef = workForceData.get(k).getManagerIdRef();
										int shiftTimeRef = workForceData.get(k).getShiftTime();
												
										if(empCountOnSaturday>0)
										{
											
											List<ShiftlineBidding> saturdayData = shiftlinebidddingDao.getShiftsForTwoConditions(bidScheduleId,shiftScheduleId,"Selected", "FS","SS");
											//System.out.println("no of employees without Saturday:"+saturdayData.size());
											
											for(int l=0;l<empCountOnSaturday;l++)
											{
													System.out.println("ASSIGNMENT Time: "+workForceData.get(k).getShiftTime()+","+"no of emp: "+workForceData.get(k).getCountOfEmp());
													
													EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
													ShiftlineBidding satEmpData = saturdayData.get(l);
													long shiftIdAllocated = satEmpData.getBidid();
													
													watchData.setBidscheduleid(satEmpData.getBidschidref());
													watchData.setManagerid(managerIdRef);
													watchData.setEmpid(satEmpData.getEmpidref());
													watchData.setEmpinitials(satEmpData.getInitials());
													watchData.setAreaid(areaIdRef);
													watchData.setYear(yearref);
													watchData.setDate(startDate);
													watchData.setTime(shiftTimeRef);
													watchData.setDuration(durationRef);
													//System.out.println("data stored in db");
													basicwatchShift.addoneItem(watchData);
													shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
											}
										}
									}
									break;
									
								case "Sun":
									System.out.println("Sunday");
									//System.out.println("sunday coming pepoles");
									List<ShiftlineBidding> sunData = shiftlinebidddingDao.getShiftsBasedOnTwoShiftName("SS", "SM", shiftScheduleId, bidScheduleId);
									for(int z=0;z<sunData.size();z++)
									{
										//System.out.println(sunData.get(z).getInitials());
										EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
										ShiftlineBidding sunEmpData = sunData.get(z);
										long shiftIdAllocated = sunEmpData.getBidid();
										
										watchData.setBidscheduleid(sunEmpData.getBidschidref());
										watchData.setManagerid(manId);
										watchData.setEmpid(sunEmpData.getEmpidref());
										watchData.setEmpinitials(sunEmpData.getInitials());
										watchData.setAreaid(areaIdRef);
										watchData.setYear(yearref);
										watchData.setDate(startDate);
										watchData.setTime(0);
										watchData.setRdoDayOff("X");
										long shiftidref = sunEmpData.getShiftlineidref();
										Optional<Shiftlinechild> schild = shiftlineChilddao.findById(shiftidref);
										watchData.setDuration(schild.get().getShiftdurationc());
										//System.out.println(watchData);
										//System.out.println("data stored in db");
										basicwatchShift.addoneItem(watchData);
										
										shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
									
									}
									
									for(int k=0;k<workForceData.size();k++)
									{
										long empCountOnSunday = workForceData.get(k).getCountOfEmp();
										//System.out.println("empCountOnSunday:"+empCountOnSunday);
										int durationRef = workForceData.get(k).getShiftDuration();
										long managerIdRef = workForceData.get(k).getManagerIdRef();
										int shiftTimeRef = workForceData.get(k).getShiftTime();
												
										if(empCountOnSunday>0)
										{
											
											List<ShiftlineBidding> sundayData = shiftlinebidddingDao.getShiftsForTwoConditions(bidScheduleId,shiftScheduleId,"Selected", "SS","SM");
											//System.out.println("no of employees without Sunday:"+sundayData.size());
											
											for(int l=0;l<empCountOnSunday;l++)
											{
													//System.out.println("ASSIGNMENT Time: "+workForceData.get(k).getShiftTime()+","+"no of emp: "+workForceData.get(k).getCountOfEmp());
													
													EmployeeBasicWatchSchedule watchData = new EmployeeBasicWatchSchedule();
													ShiftlineBidding sunEmpData = sundayData.get(l);
													long shiftIdAllocated = sunEmpData.getBidid();
													
													watchData.setBidscheduleid(sunEmpData.getBidschidref());
													watchData.setManagerid(managerIdRef);
													watchData.setEmpid(sunEmpData.getEmpidref());
													watchData.setEmpinitials(sunEmpData.getInitials());
													watchData.setAreaid(areaIdRef);
													watchData.setYear(yearref);
													watchData.setDate(startDate);
													watchData.setTime(shiftTimeRef);
													watchData.setDuration(durationRef);
													//System.out.println("data stored in db");
													//watchParentDao.save(watchData);
													basicwatchShift.addoneItem(watchData);
														
													shiftlinebidddingDao.updateWindowStatusBasedonPrimaryId("Assigned", shiftIdAllocated);
											}
										}
									}
									break;
							   }

							}
						}
						
						/*for(int a=0;a<unAssignedEmpData.size();a++)
						{
							System.out.println("UnAssigned employees total size:"+unAssignedEmpData.size());
							System.out.println(unAssignedEmpData.get(a).getInitials());
						}*/
						
					}
				}
				
			//}
			
			//update
			//for(int s=0;s<bidids.size();s++)comment for now
			for(int s=0;s<1;s++)
			{	
						long Bid = bidScheduleId;
						if(!watchParentDao.checkIfBidscheduleIdIsPosted(Bid).isEmpty())
						{
							List<Long> shiftLineScheduleIdAfter = shiftMapDao.getShiftLineScheduleIdRefs(Bid);
							for(int t=0;t<shiftLineScheduleIdAfter.size();t++)
							{
								long shiftlineScheduleId = shiftLineScheduleIdAfter.get(t);
								shiftlinebidddingDao.updateWindowStatus("Posted", shiftlineScheduleId,Bid);
							}
							parentDao.updateBasicWatchScheduleStatus("Posted", Bid);
							parentDao.updateSummaryemailstatus("Shift Posted", Bid);
							//System.out.println("Bid Id Posted:"+Bid);
						}				
			}
			
			return null;
		
	   }
		

}
