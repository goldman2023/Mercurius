package com.mercurius.models;

import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.BidWindowDurationDao;
import com.mercurius.security.services.BackendServiceForCroneJobService;
import com.mercurius.security.services.BidSummaryEmailService;
import com.mercurius.security.services.CronJobForBasicWatchScheduleService;
import com.mercurius.security.services.CronJobForUserDefinedShiftDefService;
import com.mercurius.security.services.EmployeeVacationScheduleService;

@Component
public class Scheduler {
	@Autowired
	private BackendServiceForCroneJobService s;

	@Autowired
	BidScheduleParamParentDao parent;
	
	@Autowired
	private BidWindowDurationDao window;
	
	@Autowired
	private BidSummaryEmailService summmaryemail;
	
	@Autowired
	private CronJobForBasicWatchScheduleService basicWatchPost;
	
	@Autowired
	private EmployeeVacationScheduleService vacationPost;
	
	@Autowired
	private CronJobForUserDefinedShiftDefService userDefinedShiftStatusUpdate;

	@Scheduled(cron = " */15 * * * * * ")// every 15 secs (second, minute, hour, day, month, weekday)
  	public void cronJobSch() throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException 
	{
     SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
      Date now = new Date();
      String strDate = sdf.format(now);
      //System.out.println("Java cron job expression:: " + strDate);
      System.out.println("Cron Job 1 - database update of bidstatus for shift and vacation status");
      s.updateWindowTransactionTable();
      
      
      InetAddress ip = InetAddress.getLocalHost();
      String hostname = ip.getHostAddress().trim();
      
      
      System.out.println("Cron Job 2 - send summary email");
      ArrayList<Long> empidarray = new ArrayList<>();
      
      List<BidScheduleParamParent> bp = parent.summaryemailinfo("Incomplete");
      int totalbidsch = bp.size();
      for(int i=0;i<totalbidsch;i++)
      {
    	  BidScheduleParamParent  parentData = bp.get(i);
    	  long bschid = parentData.getBidschid();
    	  
    	  
    	  List<BidWindowDuration> erecords = window.getEligibleStatus("Eligible", "Eligible",bschid);
    	  if(erecords.isEmpty())
    	  {
    	  
    	  List<Object> empids = window.getallEmpids(bschid);
    	  long totalempids = empids.size();
    	  for(int j=0;j<totalempids;j++)
    	  {
    		  Object x = empids.get(j);
    		  if(!empidarray.contains(x))
    		  {
    		  empidarray.add((Long)x);
    		  }
    	  }
    	  //System.out.println("the bidscheduleid is:"+bschid+" the total employees:"+empidarray.size()+" and employees are:"+empidarray);
    	  int count=0;
    	  for(int y1=0;y1<empidarray.size();y1++)
    	  {
    		  summmaryemail.BiddingSummary(bschid, empidarray.get(y1), hostname);
    		  count++;
    	  }
    	  
    	  if(count==empidarray.size())
    	  {
    	
    	  parent.updateSummaryemailstatus("Completed", bschid);
    	  
    	  System.out.println("Cron Job 3 - post basic watch schedule for shift and vacation");
    	  
    	  if(parentData.getStatus().equals("Bidding Scheduled"))
    	  {
    		  parent.updateBasicWatchScheduleStatus("Bidding Completed", bschid);
    		  basicWatchPost.postDataInBasicWatchScheduleTable();
    		  parent.updateBasicWatchScheduleStatus("Shift Only Posted", bschid);
    		  vacationPost.postVacationDetails();
    		  parent.updateBasicWatchScheduleStatus("Shift and Vacation Posted", bschid);
    	  }
    	  if(parentData.getStatus().equals("Shifts Assigned"))
    	  {
    		  basicWatchPost.postDataInBasicWatchScheduleTable();
    		  parent.updateBasicWatchScheduleStatus("Shift Assigned and Posted", bschid);
    	  }
    	  if(parentData.getStatus().equals("Shift Assigned and Vacation Scheduled"))
    	  {
    		  basicWatchPost.postDataInBasicWatchScheduleTable();
    		  parent.updateBasicWatchScheduleStatus("Shift Alone Posted", bschid);
    		  vacationPost.postVacationDetails();
    		  parent.updateBasicWatchScheduleStatus("Shift and Vacation Posted", bschid);
    	  }
    	  
    	  }
    	  empidarray.clear();
      }
    	  
     }
      
   }
	
	@Scheduled(cron = " 0 0 1 * * *")//runs every night 1pm
  	public void midNightCronJob() throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException 
	{
		System.out.println("Cron Job 4 - Update User Defined Shift Status");
		userDefinedShiftStatusUpdate.changeUserDefinedShiftStatus();
	}
}
