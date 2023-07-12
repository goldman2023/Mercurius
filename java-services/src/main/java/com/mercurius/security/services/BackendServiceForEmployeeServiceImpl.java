package com.mercurius.security.services;

import java.sql.Time;
import java.text.DateFormat;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.AddEmployee;
import com.mercurius.models.BidRoundChild;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.BidWindowDuration;
import com.mercurius.models.GetTimeBasedonTimeZone;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.BidRoundChildDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.BidWindowDurationDao;

@Service
public class BackendServiceForEmployeeServiceImpl implements BackendServiceForEmployeeService{
	
	@Autowired
	private AddEmployeeDao employee;
	
	@Autowired
	private BidWindowDurationDao window;
	
	@Autowired
	BidRoundChildDao round;
	
	@Autowired
	BidScheduleParamParentDao schedule;

	@Override
	public List<Object> sendBiddingInformation(String emailid) throws ParseException {
		
		long employeeid = 0;
		String mailid = emailid;//"straightlines.dev+jonathonsilva@gmail.com";
		System.out.println("the employee email id is:"+mailid);
		String status = "Incomplete";
		
		 Optional<AddEmployee> emprecords= employee.getDetailForEmail(mailid);
		 AddEmployee record = emprecords.get();
		 employeeid = record.getEmpid();
		 long managerid = record.getManagerid();
		 System.out.println("the employeeid is:"+employeeid+" the manager id:"+managerid);
		 
		 List<BidWindowDuration> temp1 = new ArrayList<BidWindowDuration>();
		 
		 
		 List<Object> d1 = schedule.getBidscheduleIds(managerid);
		 //System.out.println(d1);
		 for(int i=0;i<d1.size();i++)
		 {
			 BidScheduleParamParent bp = schedule.getbyNoOfRoundsBasedonBidschId((Long) d1.get(i));
			 long bidid = bp.getBidschid();
			 String tz = bp.getTimezone();
			 //System.out.println("The BidscheduleId is:"+bidid);
			 //System.out.println("The Timezone is:"+tz);
			 
			 
			 GetTimeBasedonTimeZone gt = new GetTimeBasedonTimeZone();
			 String today = gt.getTime(tz);
			 //System.out.println("Today date and time based on timezone:"+today);
			 
			 //long millis=System.currentTimeMillis();   
			// java.sql.Date date = new java.sql.Date(millis); 
			 //Date date = Calendar.getInstance().getTime();  
			 SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			 Date td = dateFormat.parse(today);
             String strDate = dateFormat.format(td);  
             //System.out.println("Converted String: " + strDate); 
             
			 Format formatter = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
			 String curdateformat1 = formatter.format(td);//current date as String
			 Date currentdate = new SimpleDateFormat("yyyy-MM-dd").parse(curdateformat1);
			 System.out.println("the current date is:"+currentdate); 
			 String curdateformat2 = new SimpleDateFormat("yyyy-MM-dd").format(currentdate);//current date in diff form of String
			 //System.out.println("currentdate converted to string:"+sdformat);
			 //int roundno=1;
			 Date currenttime = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss").parse(strDate);
			 String curtimeformat2 = new SimpleDateFormat("HH:mm:ss").format(currenttime);
			 Date ct = new SimpleDateFormat("HH:mm:ss").parse(curtimeformat2);
			 System.out.println("The current time is:"+ct);
			 
			 if(employeeid!=0)
			 {
				    //List<BidWindowDuration> windowrecord = window.getEmplyeedetailsBasedonVacationStatus(employeeid, "ee");
				    temp1.addAll(window.getEmplyeedetailsBasedonshiftlineStatus(employeeid, "Eligible",bidid));
				    //System.out.println("temp1 size:"+temp1.size()+" for bidscheduleid:"+bidid);
				    for(int j=0;j<temp1.size();j++)
				    {
				    	BidWindowDuration bd = temp1.get(j);
						String s1 = bd.getEmpbid_start_time();//column - actual_emp_bid_starttime
				    	String s2 = bd.getEmpbid_end_time();// column - actual_emp_bid_endtime
				    	Date startdate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(s1);//actual startdate parsed
				    	Date startdateformat1 = new SimpleDateFormat("yyyy-MM-dd").parse(s1);
				      	Date enddate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(s2);//actual enddate parsed
				    	Date enddateformat1 = new SimpleDateFormat("yyyy-MM-dd").parse(s2);
				    	//System.out.println("serpating date:"+so);
				    	//System.out.println(startdate+""+enddate);
				    	
				    	// Date currenttime = new SimpleDateFormat("YYYY-MM-dd hh:mm:ss").parse(strDate);
						 String originalendtime = new SimpleDateFormat("HH:mm:ss").format(enddate);
						// System.out.println("The origianl end time is:"+originalendtime);
						 Date ot = new SimpleDateFormat("HH:mm:ss").parse(originalendtime);
						 //System.out.println("The original end time is:"+ot);
				    	
				    	long bidschididref = bd.getBidschidref();
				    	int bidroundid = bd.getRoundseq_id();
				    	long primaryid = bd.getDuid();
				    	BidRoundChild brc = round.getTimeBasedonBidIdandRoundseq(bidschididref, bidroundid);
				    	Time t1 = brc.getRoundstarttime();
				    	String starttime = new SimpleDateFormat("HH:mm:ss").format(t1);
				    	Time t2 = brc.getRoundendttime();
				    	String endtime = new SimpleDateFormat("HH:mm:ss").format(t2);
				    	//System.out.println("converted time to string:"+timeformat1+" "+timeformat2);
				    	//System.out.println("coming here");
				    	
				    	if ((currentdate.compareTo(startdateformat1)==0)&&(currentdate.before(enddateformat1)))
				    	{
				    		System.out.println("CASE 1: first day of bidding");//current day is actualempbidstartday
				    		//String a2 =  curdateformat2+" "+starttime;
				    		String a3 =  curdateformat2+" "+endtime;
				    		//System.out.println("how a2 and a3 prints:"+a2+ " "+a3);
				    		window.updatebiddingEndTime(a3, primaryid);
				    	}
				    	
				    	else if (currentdate.compareTo(enddateformat1)==0)
				    		//currentdate=enddate 
				    		//System.out.println("whats inside:"+startdateformat1);
				    	{
				    		if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)==0) && (ct.after(ot)))
				    		//currentdate==startdate && current time is past the actual bidding endtime
				    		{
				    			System.out.println("Case 2 : Last date of bidding after bidding time finished:");
				    			//System.out.println("executing");
				    			//System.out.println("primaryid:"+primaryid);
					    		window.updatebiddingStatus(status, status, null, primaryid);//vacation status,shift status,dur id
				    		}
				    		else if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)==0)&&(ct.before(ot)))
				    		//currentdate==startdate && current time is before the actual bidding endtime
				    		{
				    			System.out.println("Case 3 : Last date of bidding before bidding time started::");
				    			System.out.println("Do nothing");
				    		}
				    		else if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)!=0))
				    		{
				    			System.out.println("Case 4 : Last date of bidding:");
				    			String a1 = curdateformat2+" "+starttime;
					    		System.out.println("how a1 prints:"+a1);
					    		Optional<BidWindowDuration> bwd1 = window.findById(primaryid);
					    		BidWindowDuration sample = bwd1.get();
					    		sample.setEmpbid_start_time(a1);
					    		sample.setEmpbid_today_time(null);
					      		window.save(sample);
					    		//window.updatebiddingStartTime(a1, null, primaryid);
					    		Optional<BidWindowDuration> bwd = window.findById(primaryid);
					    		if(bwd.isPresent())
					    		{
					    			
					    			String p1 = bwd.get().getEmpbid_start_time();//column - actual_emp_bid_starttime
							    	String p2 = bwd.get().getEmpbid_end_time();// column - actual_emp_bid_endtime
							    	Date sd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(p1);//actual startdate parsed
							    	Date sdf1 = new SimpleDateFormat("yyyy-MM-dd").parse(p1);
							    	System.out.println("new end date:"+sdf1);
							      	Date ed = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(p2);//actual enddate parsed
							    	Date edf1 = new SimpleDateFormat("yyyy-MM-dd").parse(p2);
							    	String oendtime = new SimpleDateFormat("HH:mm:ss").format(ed);
									Date oet = new SimpleDateFormat("HH:mm:ss").parse(oendtime);
					    			//System.out.println("coming in");
					    			if((currentdate.compareTo(edf1)==0) && (currentdate.compareTo(sdf1)==0) && (ct.after(ot)) )
					    			{
					    				//System.out.println("coming in");
					    				window.updatebiddingStatus(status, status, null, primaryid);//vacation status,shift status,dur id
					    			}
					    			else if((currentdate.compareTo(edf1)==0) && (currentdate.compareTo(sdf1)==0) && (ct.before(ot)) )
					    			{
					    				System.out.println("only date/time update, no status update");
					    				//window.updatebiddingStatus(status, status, primaryid);//vacation status,shift status,dur id
					    			}
					    			
					    		}
				    		}
				    		
				    	}
				    	
				    	else if ((currentdate.after(startdate) && (currentdate.before(enddate))))
				    	{
				    		System.out.println("Case 5: date is between range");
				    		String a2 =  curdateformat2+" "+starttime;
				    		String a3 =  curdateformat2+" "+endtime;
				    		//System.out.println("how a2 and a3 prints:"+a2+ " "+a3);
				    		window.updatebiddingStartTime(a2, a3, primaryid);
	//starttime as today date with today round starttime (a2),//column - actual_emp_bid_starttime
	// endtime as today date with today round endtime (a3)i.e new column//today_bidding_time
				    	}
				    	else if ((currentdate.after(enddate)))
		    			{
				    		System.out.println("case 6: bidding date has expired");
				    		window.updatebiddingStatus(status, status, null, primaryid);
		    			}
				    	else if ((currentdate.before(startdate) && (currentdate.before(enddate))))
				    	{
				    		System.out.println("case 7: future dates so do nothing");
				    	}
				    	
				    		    	//window.findByStartDateBetween(startdate,enddate);
				    
			
			 }
				    temp1.clear();
		}
			 
	}
		 return null;	
	}
}
				  
