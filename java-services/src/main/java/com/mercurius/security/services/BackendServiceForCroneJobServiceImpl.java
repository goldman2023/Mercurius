package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.UnknownHostException;

import javax.servlet.http.HttpServletRequest;
import java.sql.Time;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.controllers.TestController;
import com.mercurius.models.BidRoundChild;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.BidWindowDuration;
import com.mercurius.models.GetTimeBasedonTimeZone;
import com.mercurius.repository.BidRoundChildDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.BidWindowDurationDao;

@Service
public class BackendServiceForCroneJobServiceImpl implements BackendServiceForCroneJobService {
	
	@Autowired
	private BidWindowDurationDao window;
	
	@Autowired
	private BidScheduleParamParentDao schedule;
	
	@Autowired
	private BidRoundChildDao round;

	@Autowired
	private MissedBidWindowEmailService missed;
	
	@Override
	public List<Object> updateWindowTransactionTable() throws ParseException, UnsupportedEncodingException, MessagingException, UnknownHostException{
		
		String status = "Incomplete";
		//Select only bidscheduleid's where shiftline_status or vacation_status = "Eligible"
		List<Object>  o = window.getBidscheduleids("Eligible", "Eligible");
	
		//Hashset to remove duplicates in bidscheduleid's
		LinkedHashSet<Long> set = new LinkedHashSet<Long>();
		for (int i = 0; i < o.size(); i++)
		 {
	            set.add((Long) o.get(i));
	     }
		
		 ArrayList<Long> bids = new ArrayList<>(set);//convert hashset to array
	
		 for(int j=0;j<bids.size();j++) 
		  {
			  //Select * records where bidscheduleid = value and (shiftline_status or vacation_status = "Eligible") 
			  List<BidWindowDuration> bd = window.getdetails(bids.get(j), "Eligible", "Eligible");
			  BidWindowDuration data = bd.get(0);
			  Long bidschid = data.getBidschidref();
			  Optional<BidScheduleParamParent> bp = schedule.findById(bidschid);
			  long bidid = bp.get().getBidschid();
			  String tz = bp.get().getTimezone();
				 
			  GetTimeBasedonTimeZone gt = new GetTimeBasedonTimeZone();
			  String today = gt.getTime(tz);
			  //  System.out.println("Today date and time based on timezone:"+today);
				 
			  SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			  Date td = dateFormat.parse(today);
	          String strDate = dateFormat.format(td);  
	          //System.out.println("Converted String: " + strDate); 
	             
	          Format formatter = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
	          String curdateformat1 = formatter.format(td);//current date as String
	          Date currentdate = new SimpleDateFormat("yyyy-MM-dd").parse(curdateformat1);
	          //System.out.println("the current date is:"+currentdate); 
	          String curdateformat2 = new SimpleDateFormat("yyyy-MM-dd").format(currentdate);//current date in diff form of String
	          Date currenttime = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss").parse(strDate);
	          String curtimeformat2 = new SimpleDateFormat("HH:mm:ss").format(currenttime);
	          Date ct = new SimpleDateFormat("HH:mm:ss").parse(curtimeformat2);
	          //System.out.println("The current time is:"+ct);
				 
			//System.out.println("No of records selected is "+bd.size()+" for the bidschedule id:"+bd.get((int) 0).getBidschidref());
			//bd.size() is number of records selected for a bidschedule having "Eligible" status
			  for(int x=0;x<bd.size();x++)
			  {
			 	  
				  	BidWindowDuration d1 = bd.get(x);
					String s1 = d1.getEmpbid_start_time();//column - actual_emp_bid_starttime
			    	String s2 = d1.getEmpbid_end_time();// column - actual_emp_bid_endtime
			    	Date startdate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(s1);//actual startdate parsed
			    	Date startdateformat1 = new SimpleDateFormat("yyyy-MM-dd").parse(s1);
			      	Date enddate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(s2);//actual enddate parsed
			    	Date enddateformat1 = new SimpleDateFormat("yyyy-MM-dd").parse(s2);
						    	
			    	// Date currenttime = new SimpleDateFormat("YYYY-MM-dd hh:mm:ss").parse(strDate);
					 String originalendtime = new SimpleDateFormat("HH:mm:ss").format(enddate);
					//  System.out.println("The origianl end time is:"+originalendtime);
					 Date ot = new SimpleDateFormat("HH:mm:ss").parse(originalendtime);
					//  System.out.println("The original end time is:"+ot);
			    	
			    	long bidschididref = d1.getBidschidref();
			    	int bidroundid = d1.getRoundseq_id();
			    	long bidempid = d1.getEmpidref();
			    	long primaryid = d1.getDuid();
			    	BidRoundChild brc = round.getTimeBasedonBidIdandRoundseq(bidschididref, bidroundid);
			    	Time t1 = brc.getRoundstarttime();
			    	String starttime = new SimpleDateFormat("HH:mm:ss").format(t1);
			    	Time t2 = brc.getRoundendttime();
			    	String endtime = new SimpleDateFormat("HH:mm:ss").format(t2);
				  
			    	String shiftstatus = bd.get(x).getShiftlinebidstatus(); 
			    	String vacationstatus = bd.get(x).getVacationbidstatus();
			    	
			    	if(shiftstatus.equals("Eligible")&&vacationstatus.equals("Eligible"))
			    	{
			    		
			    		if ((currentdate.compareTo(startdateformat1)==0)&&(currentdate.before(enddateformat1)))
				    	{
				    		//System.out.println("CASE 1: first day of bidding");//current day is actualempbid_startday
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
				    			//System.out.println("Case 2 : Last date of bidding after bidding time finished:");
					    		window.updatebiddingStatus(status, status, null, primaryid);//vacation status,shift status,dur id
					    		
					    		//bid window missed EMAIL
					    		String s=null;
					    		missed.BiddingMissed(bidschididref, bidempid, bidroundid,s);
				    		}
				    		else if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)==0)&&(ct.before(ot)))
				    		//currentdate==startdate && current time is before the actual bidding endtime
				    		{
				    			//System.out.println("Case 3 : Last date of bidding before bidding time started:");
				    			//System.out.println("Do nothing");
				    		}
				    		else if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)!=0))
				    		{
				    			//System.out.println("Case 4 : Last date of bidding:");
				    			String a1 = curdateformat2+" "+starttime;
					    		Optional<BidWindowDuration> bwd1 = window.findById(primaryid);
					    		BidWindowDuration sample = bwd1.get();
					    		sample.setEmpbid_start_time(a1);
					      		window.save(sample);
					    		//window.updatebiddingStartTime(a1, null, primaryid);
					    		Optional<BidWindowDuration> bwd = window.findById(primaryid);
					    		if(bwd.isPresent())
					    		{
					    			
					    			String p1 = bwd.get().getEmpbid_start_time();//column - actual_emp_bid_starttime
							    	String p2 = bwd.get().getEmpbid_end_time();// column - actual_emp_bid_endtime
							    	Date sd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(p1);//actual startdate parsed
							    	Date sdf1 = new SimpleDateFormat("yyyy-MM-dd").parse(p1);
							      	Date ed = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(p2);//actual enddate parsed
							    	Date edf1 = new SimpleDateFormat("yyyy-MM-dd").parse(p2);
							    	String oendtime = new SimpleDateFormat("HH:mm:ss").format(ed);
									Date oet = new SimpleDateFormat("HH:mm:ss").parse(oendtime);
					    			if((currentdate.compareTo(edf1)==0) && (currentdate.compareTo(sdf1)==0) && (ct.after(ot)) )
					    			{
					    				window.updatebiddingStatus(status, status,null, primaryid);//vacation status,shift status,dur id
					    			}
					    			else if((currentdate.compareTo(edf1)==0) && (currentdate.compareTo(sdf1)==0) && (ct.before(ot)) )
					    			{
					    				//System.out.println("only date/time update, no status update");
					    				//window.updatebiddingStatus(status, status, primaryid);//vacation status,shift status,dur id
					    			}
					    			
					    		  }
				    		  }
				    	   }
				    	
				    	else if ((currentdate.after(startdate) && (currentdate.before(enddate))))
				    	{
				    		//System.out.println("Case 5: date is between range");
				    		String a2 =  curdateformat2+" "+starttime;
				    		String a3 =  curdateformat2+" "+endtime;
				    		window.updatebiddingStartTime(a2, a3, primaryid);
	//starttime as today date with today round starttime (a2),//column - actual_emp_bid_starttime
	// endtime as today date with today round endtime (a3)i.e new column//today_bidding_time
				    	}
				    		
				    	else if ((currentdate.after(enddate)))
		    			{
				    		//System.out.println("Case 6: bidding date has expired");
				    		window.updatebiddingStatus(status, status, null, primaryid);
				    		
				    		//bid window missed EMAIL
				    	      InetAddress localHost = InetAddress.getLocalHost();
				    	      System.out.println("localhost:"+localHost.getHostAddress());
				    	      String s = localHost.toString();
				    		missed.BiddingMissed(bidschididref, bidempid, bidroundid,s);
		    			}
				    	else if ((currentdate.before(startdate) && (currentdate.before(enddate))))
				    	{
				    		//System.out.println("Case 7: future dates so do nothing");
				    	}
			    	}
			    	
			    	
				 
			    	//else if(shiftstatus.equals("Eligible"))
				 {
					 //System.out.println("shiftline status condition executing:");
					 String vs = d1.getVacationbidstatus();
					 if ((currentdate.compareTo(startdateformat1)==0)&&(currentdate.before(enddateformat1)))
				    	{
				    		//System.out.println("CASE 1: first day of bidding");//current day is actualempbid_startday
				    		//String a2 =  curdateformat2+" "+starttime;
				    		String a3 =  curdateformat2+" "+endtime;
				    		//System.out.println("how a2 and a3 prints:"+a2+ " "+a3);
				    		window.updatebiddingEndTime(a3, primaryid);
				    	}
				    	
				    	else if (currentdate.compareTo(enddateformat1)==0)
				    		//currentdate=enddate 
				    	
				    {
				    		if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)==0) && (ct.after(ot)))
				    		//currentdate==startdate && current time is past the actual bidding endtime
				    		{
				    			//System.out.println("Case 2 : Last date of bidding after bidding time finished:");
					    		window.updatebiddingStatus(vs, status, null, primaryid);//vacation status,shift status,today bid time,dur id
					    		
					    		//bid window missed EMAIL
					    		 InetAddress localHost = InetAddress.getLocalHost();
					    	     String s = localHost.toString();
					    	     //System.out.println("inet:"+localHost.getHostAddress());
					    		missed.BiddingMissed(bidschididref, bidempid, bidroundid,s);
				    		}
				    		else if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)==0)&&(ct.before(ot)))
				    		//currentdate==startdate && current time is before the actual bidding endtime
				    		{
				    			//System.out.println("Case 3 : Last date of bidding before bidding time started:");
				    			//System.out.println("Do nothing");
				    		}
				    		else if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)!=0))
				    		{
				    			//System.out.println("Case 4 : Last date of bidding:");
				    			String a1 = curdateformat2+" "+starttime;
					    		Optional<BidWindowDuration> bwd1 = window.findById(primaryid);
					    		BidWindowDuration sample = bwd1.get();
					    		sample.setEmpbid_start_time(a1);
					      		window.save(sample);
					    		//window.updatebiddingStartTime(a1, null, primaryid);
					    		Optional<BidWindowDuration> bwd = window.findById(primaryid);
					    		if(bwd.isPresent())
					    		{
					    			
					    			String p1 = bwd.get().getEmpbid_start_time();//column - actual_emp_bid_starttime
							    	String p2 = bwd.get().getEmpbid_end_time();// column - actual_emp_bid_endtime
							    	Date sd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(p1);//actual startdate parsed
							    	Date sdf1 = new SimpleDateFormat("yyyy-MM-dd").parse(p1);
							    	//System.out.println("new end date:"+sdf1);
							      	Date ed = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(p2);//actual enddate parsed
							    	Date edf1 = new SimpleDateFormat("yyyy-MM-dd").parse(p2);
							    	String oendtime = new SimpleDateFormat("HH:mm:ss").format(ed);
									Date oet = new SimpleDateFormat("HH:mm:ss").parse(oendtime);
					    			//System.out.println("coming in");
					    			if((currentdate.compareTo(edf1)==0) && (currentdate.compareTo(sdf1)==0) && (ct.after(ot)) )
					    			{
					    				//System.out.println("coming in");
					    				window.updatebiddingStatus(vs, status,null, primaryid);//vacation status,shift status,today bid time,dur id
					    			}
					    			else if((currentdate.compareTo(edf1)==0) && (currentdate.compareTo(sdf1)==0) && (ct.before(ot)) )
					    			{
					    				//System.out.println("only date/time update, no status update");
					    				//window.updatebiddingStatus(status, status, primaryid);//vacation status,shift status,dur id
					    			}
					    			
					    		}
				    		}
				    }
				    	
				    	else if ((currentdate.after(startdate) && (currentdate.before(enddate))))
				    	{
				    		//System.out.println("Case 5: date is between range");
				    		String a2 =  curdateformat2+" "+starttime;
				    		String a3 =  curdateformat2+" "+endtime;
				    		//System.out.println("how a2 and a3 prints:"+a2+ " "+a3);
				    		window.updatebiddingStartTime(a2, a3, primaryid);
	//starttime as today date with today round starttime (a2),//column - actual_emp_bid_starttime
	// endtime as today date with today round endtime (a3)i.e new column//today_bidding_time
				    	}
				    		
				    	else if ((currentdate.after(enddate)))
		    			{
				    		//System.out.println("Case 6: bidding date has expired");
				    		window.updatebiddingStatus(vs, status, null, primaryid);
				    		
				    		//bid window missed EMAIL
				    		 InetAddress localHost = InetAddress.getLocalHost();
				    	     String s = localHost.toString();
				    		missed.BiddingMissed(bidschididref, bidempid, bidroundid,s);
				 
		    			}
				    	else if ((currentdate.before(startdate) && (currentdate.before(enddate))))
				    	{
				    		//System.out.println("Case 7: future dates so do nothing");
				    	}
					  	 
				 }
				 
				
			    	//else if(vacationstatus.equals("Eligible"))
				 {
					 //System.out.println("vacation status condition executing:");
					 String shst = d1.getShiftlinebidstatus();
					 
					 if ((currentdate.compareTo(startdateformat1)==0)&&(currentdate.before(enddateformat1)))
				    	{
				    		//System.out.println("CASE 1: first day of bidding");//current day is actualempbid_startday
				    		//String a2 =  curdateformat2+" "+starttime;
				    		String a3 =  curdateformat2+" "+endtime;
				    		//System.out.println("how a2 and a3 prints:"+a2+ " "+a3);
				    		window.updatebiddingEndTime(a3, primaryid);
				    	}
				    	
				    	else if (currentdate.compareTo(enddateformat1)==0)
				    		//currentdate=enddate 
				    {
				    		if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)==0) && (ct.after(ot)))
				    		//currentdate==startdate && current time is past the actual bidding endtime
				    		{
				    			//System.out.println("Case 2 : Last date of bidding after bidding time finished:");
					    		window.updatebiddingStatus(status, shst, null, primaryid);//vacation status,shift status,dur id
					    		
					    		//bid window missed EMAIL
					    		InetAddress localHost = InetAddress.getLocalHost();
					    	    String s = localHost.toString();
					    	    missed.BiddingMissed(bidschididref, bidempid, bidroundid,s);
					    		
				    		}
				    		else if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)==0)&&(ct.before(ot)))
				    		//currentdate==startdate && current time is before the actual bidding endtime
				    		{
				    			//System.out.println("Case 3 : Last date of bidding before bidding time started:");
				    			//System.out.println("Do nothing");
				    		}
				    		else if((currentdate.compareTo(enddateformat1)==0) && (currentdate.compareTo(startdateformat1)!=0))
				    		{
				    			//System.out.println("Case 4 : Last date of bidding:");
				    			String a1 = curdateformat2+" "+starttime;
					    		Optional<BidWindowDuration> bwd1 = window.findById(primaryid);
					    		BidWindowDuration sample = bwd1.get();
					    		sample.setEmpbid_start_time(a1);
					      		window.save(sample);
					    		//window.updatebiddingStartTime(a1, null, primaryid);
					    		Optional<BidWindowDuration> bwd = window.findById(primaryid);
					    		if(bwd.isPresent())
					    		{
					    			
					    			String p1 = bwd.get().getEmpbid_start_time();//column - actual_emp_bid_starttime
							    	String p2 = bwd.get().getEmpbid_end_time();// column - actual_emp_bid_endtime
							    	Date sd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(p1);//actual startdate parsed
							    	Date sdf1 = new SimpleDateFormat("yyyy-MM-dd").parse(p1);
					
							      	Date ed = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(p2);//actual enddate parsed
							    	Date edf1 = new SimpleDateFormat("yyyy-MM-dd").parse(p2);
							    	String oendtime = new SimpleDateFormat("HH:mm:ss").format(ed);
									Date oet = new SimpleDateFormat("HH:mm:ss").parse(oendtime);
					    			
					    			if((currentdate.compareTo(edf1)==0) && (currentdate.compareTo(sdf1)==0) && (ct.after(ot)) )
					    			{
					    				window.updatebiddingStatus(status, shst,null, primaryid);//vacation status,shift status,dur id
					    			}
					    			else if((currentdate.compareTo(edf1)==0) && (currentdate.compareTo(sdf1)==0) && (ct.before(ot)) )
					    			{
					    				//System.out.println("only date/time update, no status update");
					    				//window.updatebiddingStatus(status, status, primaryid);//vacation status,shift status,dur id
					    			}
					    			
					    		}
				    		}
				    }
				    	
				    	else if ((currentdate.after(startdate) && (currentdate.before(enddate))))
				    	{
				    		//System.out.println("Case 5: date is between range");
				    		String a2 =  curdateformat2+" "+starttime;
				    		String a3 =  curdateformat2+" "+endtime;
				    		window.updatebiddingStartTime(a2, a3, primaryid);
	//starttime as today date with today round starttime (a2),//column - actual_emp_bid_starttime
	// endtime as today date with today round endtime (a3)i.e new column//today_bidding_time
				    	}
				    		
				    	else if ((currentdate.after(enddate)))
		    			{
				    		//System.out.println("Case 6: bidding date has expired");
				    		window.updatebiddingStatus(status, shst, null, primaryid);
				    		
				    		//bid window missed EMAIL
				    		InetAddress localHost = InetAddress.getLocalHost();
				    	    String s = localHost.toString();
				    	    missed.BiddingMissed(bidschididref, bidempid, bidroundid,s);
				    		
		    			}
				    	else if ((currentdate.before(startdate) && (currentdate.before(enddate))))
				    	{
				    		//System.out.println("Case 7: future dates so do nothing");
				    	}
					   
				 }
				 }
			  bd.clear();
		  }
		  //System.out.println("2 condition pass count:"+count);
		  set.clear();
		  bids.clear();
		 
		return null;
	}

}
