package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.UnknownHostException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.AddEmployee;
import com.mercurius.models.BidScheduleMapShiftlineSchedule;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.DateTimeFormatConverters;
import com.mercurius.models.EmployeeBasicWatchScheduleImposter;
import com.mercurius.models.EmployeeVacationSchedule;
import com.mercurius.models.EmployeeVacationScheduleImposter;
import com.mercurius.models.EmployeeVacationScheduleImposterChild;
import com.mercurius.models.VacationBidding;
import com.mercurius.repository.BidScheduleMapShiftlineScheduleDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.EmployeeVacationScheduleDao;
import com.mercurius.repository.VacationBiddingDao;

@Service
public class EmployeeVacationScheduleServiceImpl implements EmployeeVacationScheduleService{

	@Autowired
	private BidScheduleParamParentDao parentDao;
	
	@Autowired
	private VacationBiddingDao vacationDao;
	
	@Autowired
	private EmployeeVacationScheduleDao vacationPostBidDao;
	
	@Autowired
	private EmployeeVacationScheduleService vacationPostService;
	
	@Autowired
	private BidScheduleMapShiftlineScheduleDao shiftMapDao;
	
	@Autowired
	private AddNewEmployeeService findEmployeeName;
	
	@Override
	public List<Object> postVacationDetails()
			throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException {
		
		List<Long> bidIds = parentDao.getBidids("Shift Posted");
		for(int i=0;i<bidIds.size();i++)
		{
			
			long bidScheduleId = bidIds.get(i);
			Optional<BidScheduleParamParent> bidScheduledata = parentDao.findById(bidScheduleId);
			long managerIdRef = bidScheduledata.get().getBidmanagerid();
			
			List<VacationBidding>  vacationBidData = vacationDao.getbyBidScheduleIdRef(bidScheduleId);
			if(!vacationBidData.isEmpty())
			{
			for(int j=0;j<vacationBidData.size();j++)
				{
					VacationBidding vacationData = vacationBidData.get(j);
					EmployeeVacationSchedule employeePost = new EmployeeVacationSchedule();
					employeePost.setBidschIdRef(vacationData.getBidschidref());
					employeePost.setManagerIdRef(managerIdRef);
					employeePost.setEmpIdRef(vacationData.getEmpidref());
					employeePost.setEmpInitials(vacationData.getInitials());
					employeePost.setVacationStartDate(vacationData.getVacationstartdate());
					employeePost.setVacationEndDate(vacationData.getVacationenddate());
					employeePost.setVacationHours(vacationData.getVcationhours());
					vacationPostService.addoneItem(employeePost);
					//System.out.println(employeePost);
				}
				
			parentDao.updateSummaryemailstatus("Shift and Vacation Posted", bidScheduleId);
			//System.out.println("Bid Id Posted:"+bidScheduleId);
			}
			
		}

		return null;
	}

	@Override
	public EmployeeVacationSchedule addoneItem(EmployeeVacationSchedule vacationBid) {
		vacationPostBidDao.save(vacationBid);
		return vacationBid;
	}

	@Override
	public EmployeeVacationScheduleImposter getBasicWatchVacationBasedOnDateAndBidScheduleId(Long bidscheduleid, Date day) throws ParseException 
		{
		
		Long bidScheduleId = bidscheduleid;
		DateTimeFormatConverters convert = new DateTimeFormatConverters();
		List<EmployeeVacationSchedule> dailyData = vacationPostBidDao.getBasicWatchScheduleVacationByScheduleIdAndDateBetween(bidScheduleId, day);
		EmployeeVacationScheduleImposter parentVacationData = new EmployeeVacationScheduleImposter();
		List<EmployeeVacationScheduleImposter> pData = new ArrayList<EmployeeVacationScheduleImposter>();
		List<EmployeeVacationScheduleImposterChild> childVacationData = new ArrayList<EmployeeVacationScheduleImposterChild>();
		for(int i=0;i<dailyData.size();i++)
		{
			EmployeeVacationSchedule vacationScheduleData = dailyData.get(i);
			String dailyDateConverted = convert.Conversion(day, 2);
			parentVacationData.setDailyDate(dailyDateConverted);
			parentVacationData.setBidscheduleIdRef(vacationScheduleData.getBidschIdRef());
			parentVacationData.setManagerIdRef(vacationScheduleData.getManagerIdRef());
			
			EmployeeVacationScheduleImposterChild cData = new EmployeeVacationScheduleImposterChild();
			cData.setEmpIdRef(vacationScheduleData.getEmpIdRef());
			AddEmployee employeeData = findEmployeeName.getbyId(vacationScheduleData.getEmpIdRef());
			cData.setEmpFirstName(employeeData.getFname());
			cData.setEmpLastName(employeeData.getLname());
			cData.setEmpInitials(vacationScheduleData.getEmpInitials());
			String vStartDate = convert.Conversion(vacationScheduleData.getVacationStartDate(), 2);
			String vEndDate = convert.Conversion(vacationScheduleData.getVacationEndDate(),2);
			cData.setVacationStartDate(vStartDate);
			cData.setVacationEndDate(vEndDate);
			cData.setVacationHours(vacationScheduleData.getVacationHours());
			childVacationData.add(cData);
			
			parentVacationData.setEmpinfo(childVacationData);;
			pData.add(parentVacationData);
		}
		return parentVacationData;
	}

	@Override
	public List<EmployeeVacationScheduleImposter> getBasicWatchVacationBasedOnDateRangeAndBidScheduleId(
			Long bidscheduleid, String from, String to) throws ParseException 
	{	
		Long bidScheduleId = bidscheduleid;
		DateTimeFormatConverters convert = new DateTimeFormatConverters();
		Date shiftStartdDate=new SimpleDateFormat("yyyy-MM-dd").parse(from);  
		Date shiftEndDate=new SimpleDateFormat("yyyy-MM-dd").parse(to);  
		List<EmployeeVacationScheduleImposter> pData = new ArrayList<EmployeeVacationScheduleImposter>();
		
		Calendar start = Calendar.getInstance();
		start.setTime(shiftStartdDate);
		Calendar end = Calendar.getInstance();
		end.setTime(shiftEndDate);
		for (Date date = start.getTime(); !start.after(end); start.add(Calendar.DATE, 1), date = start.getTime()) 
		{
			List<EmployeeVacationSchedule> dailyData = vacationPostBidDao.getBasicWatchScheduleVacationByScheduleIdAndDateBetween(bidScheduleId, date);
			EmployeeVacationScheduleImposter parentVacationData = new EmployeeVacationScheduleImposter();
			List<EmployeeVacationScheduleImposterChild> childVacationData = new ArrayList<EmployeeVacationScheduleImposterChild>();
		
			
			for(int i=0;i<dailyData.size();i++)
			{
				
				EmployeeVacationSchedule vacationScheduleData = dailyData.get(i);
				String dailyDateConverted = convert.Conversion(date, 2);
				parentVacationData.setDailyDate(dailyDateConverted);
				parentVacationData.setBidscheduleIdRef(vacationScheduleData.getBidschIdRef());
				parentVacationData.setManagerIdRef(vacationScheduleData.getManagerIdRef());
				
				EmployeeVacationScheduleImposterChild cData = new EmployeeVacationScheduleImposterChild();
				cData.setEmpIdRef(vacationScheduleData.getEmpIdRef());
				AddEmployee employeeData = findEmployeeName.getbyId(vacationScheduleData.getEmpIdRef());
				cData.setEmpFirstName(employeeData.getFname());
				cData.setEmpLastName(employeeData.getLname());
				cData.setEmpInitials(vacationScheduleData.getEmpInitials());
				String vStartDate = convert.Conversion(vacationScheduleData.getVacationStartDate(), 2);
				String vEndDate = convert.Conversion(vacationScheduleData.getVacationEndDate(),2);
				cData.setVacationStartDate(vStartDate);
				cData.setVacationEndDate(vEndDate);
				cData.setVacationHours(vacationScheduleData.getVacationHours());
				childVacationData.add(cData);
				
				parentVacationData.setEmpinfo(childVacationData);;
			}
			pData.add(parentVacationData);
		}
		return pData;
		}
		
	}


