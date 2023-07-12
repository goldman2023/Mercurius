package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
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
import java.util.concurrent.TimeUnit;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.mercurius.models.AddEmployee;
import com.mercurius.models.BidRoundChild;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.BidWindowDuration;
import com.mercurius.models.DateTimeFormatConverters;
import com.mercurius.models.FindUrlBasedOnRegion;
import com.mercurius.models.Hostname;
import com.mercurius.models.TimeDateYearDifferenceMethod;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.BidRoundChildDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.BidWindowDurationDao;
import com.mercurius.repository.TimeZoneForBidScheduleDao;

@Service
public class NotificationForBidScheduleTimeIncreasedServiceImpl implements NotificationForBidScheduleTimeIncreasedService{

	@Autowired
	private AddEmployeeDao employee;
	
	@Autowired
	private BidWindowDurationDao window;
	
	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	PasswordEncoder encoder;
	
	@Autowired
	BidRoundChildDao round;
	
	@Autowired
	BidScheduleParamParentDao parent;
	
	@Autowired
	TimeZoneForBidScheduleDao timez;
	
	@Autowired
	HostnameService hostname;
	
	public long updatedminutes = 0;

	@Override
	public List<Object> BidWindowTimeIcreasedForEmployee(Long BidscheduleId, Long Empid, int Roundid,String siteURL,Long prevempdurationid)
			throws UnsupportedEncodingException, MessagingException, ParseException {
		
		System.out.println("**Increase Bid Window Email**");
		List<Hostname> h = hostname.getAllInfo();
		String ip = h.get(0).getIp();
		
		  /***common code for all switch cases starts here***/
				Long bidschid = BidscheduleId;
				Long empid = Empid;
				int roundno = Roundid;
				int count = 0;
				String verifyURL = null;
				int datefifference = 0;
				String updatedduration = null;
				
				Optional<AddEmployee> data1 = employee.getDetailForEmpId(empid);
				AddEmployee details = data1.get();
				String toAddress = details.getEmail();
				String email = toAddress;
				String fname = StringUtils.capitalize(details.getFname());
				String lname = StringUtils.capitalize(details.getLname());
				String initials = details.getInitials();
				
				
				Optional<BidWindowDuration> data2 = window.findByBidschIdandEmpIdandReoundId(bidschid, empid, roundno);
				BidWindowDuration result = data2.get();
				Optional<BidScheduleParamParent> bp = parent.findById(bidschid);
				BidScheduleParamParent info = bp.get();
				String location = info.getTimezone();
				String timezone = timez.getAcronym(location);
				
				// 0 means include weekends //1 means do not include weekends
				int includeexcludestatus = info.getWeekendstatus();
				// 0 means no intervals // 1 means interval option selected
				boolean hasInterval = info.getHasinterval();
				int intervalStatus = (hasInterval) ? 1:0;
				
				if(intervalStatus==0)
				{
					
				//get the previous employee round detail
				Optional<BidWindowDuration> pvemployee = window.findById(prevempdurationid);
				BidWindowDuration pve = pvemployee.get();
				Time pve_emp_bid_endtime = pve.getBidendtime();
				
				//variable declarations
				ArrayList<String> sdarray = new ArrayList<String>();
			    ArrayList<String> edarray = new ArrayList<String>();
			    ArrayList<String> starray = new ArrayList<String>();
				ArrayList<String> etarray = new ArrayList<String>();
				ArrayList<String> duration = new ArrayList<String>();
				
				ArrayList<String> updatedstartdatearray = new ArrayList<String>();
			    ArrayList<String> updatedenddatearray = new ArrayList<String>();
			    ArrayList<String> updatedstarttimetarray = new ArrayList<String>();
				ArrayList<String> updatedendtimearray = new ArrayList<String>();
				ArrayList<String> updateddurationarray = new ArrayList<String>();
				ArrayList<String> increaseddatepart1 = new ArrayList<String>();
				
				long row1=0;long row2=0;
				Time ost;Time oet;
				Date ust;Date uet;
				String originalstarttime=null;String originalendtime=null;
				long t1mins=0;long t2mins=0;long t3mins=0;long t4mins=0;
				long t1hrs=0;long t2hrs=0;
				String dur1=null;String dur2=null;
				String increaseddate;long t3hrs; long t5mins;long t3hrstomins;long row3;String dur3;
				int difference_In_days = 0;
				String dbupdate;String fs3 = null;
		
				
				Date sdate = result.getBidstartdate();//bid_round_start_date
				long durationid = result.getDuid();
			    Format formatter = new SimpleDateFormat("MM/dd/yyyy");
			    String oldstartdate = formatter.format(sdate);
			    Format fo1 = new SimpleDateFormat("MMM dd, yyyy");
			    String fos1 = fo1.format(sdate);
			    sdarray.add(fos1);//oldstartdate
			    
			    
			    Date sdate1 = result.getBidenddate();//bid_round_end_date
			    Format formatter1 = new SimpleDateFormat("MM/dd/yyyy");
			    String oldenddate = formatter1.format(sdate1);
			    Format fo2 = new SimpleDateFormat("MMM dd, yyyy");
			    String fos2 = fo2.format(sdate);
			    edarray.add(fos2);//oldenddate
			    
			    Time stime = result.getBidstarttime();//emp_bid_starttime 
			    String oldstarttime = new SimpleDateFormat("hh:mm a").format(stime);
			    starray.add(oldstarttime);
			    
			    Time etime = result.getBidendtime();//emp_bid_endtime
				String oldendtime = new SimpleDateFormat("hh:mm a").format(etime);
				etarray.add(oldendtime);
			    
			    Time dura = result.getEmpbidduration();//bid_round_duration
				String s4 = dura.toString();
				double minutes = 0;
				String[] split = s4.split(":");
				minutes = Double.parseDouble(split[0])*60 + Double.parseDouble(split[1]) + Double.parseDouble(split[2])/60;
				String oldduration = String.format("%.0f", minutes);
				duration.add(oldduration);
				
				//updated duration details of that employee for the passed round
					String updatedrecord1 = result.getEmpbid_start_time();//actual_emp_bid_starttime// shortly ur1
					Date ur1format1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(updatedrecord1);
					String dateformatfordbupdate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(ur1format1);
					String[] splitfordb = dateformatfordbupdate.split(" ");
					String sd = splitfordb[0];
				    String ur1format2 = new SimpleDateFormat("MM/dd/yyyy,HH:mm:ss").format(ur1format1);
				    String ur1format3 = new SimpleDateFormat("MM/dd/yyyy,hh:mm a").format(ur1format1);
				    String[] split11 = ur1format2.split(",");
				    String updatedstartdate = split11[0];
				    String updatedstarttime = split11[1];
				    String[] rightst = ur1format3.split(",");
				    String upstrtimeinrightformat = rightst[1];
				    Format f1 = new SimpleDateFormat("MMM dd, yyyy");
				    String fs1 = f1.format(ur1format1);//////////////
					DateFormat som1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				    Date dom1 = som1.parse(updatedrecord1);
				    String xo1 = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(dom1);
				 
				    
				    String updatedrecord2 = result.getEmpbid_end_time();//actual_emp_bid_endtime // shortly ur2
				    Date ur2format1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(updatedrecord2);
				    String ur2format2 = new SimpleDateFormat("MM/dd/yyyy,HH:mm:ss").format(ur2format1);
				    String ur2format3 = new SimpleDateFormat("MM/dd/yyyy,hh:mm a").format(ur2format1);
				    String[] split22 = ur2format2.split(",");
				    String updatedenddate = split22[0];
				    String updatedendtime = split22[1];
				    String[] rightet = ur2format3.split(",");
				    String upendtimeinrightformat = rightet[1];
				    Format f2 = new SimpleDateFormat("MMM dd, yyyy");
				    String fs2 = f2.format(ur2format1);////////////////
				    DateFormat som2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				    Date dom2 = som1.parse(updatedrecord2);
				    String xo2 = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss").format(dom2);
				   
				    
				    BidRoundChild data = round.getTimeBasedonBidIdandRoundseq(bidschid,roundno);
		   	     	ost = data.getRoundstarttime();
		   	     	oet = data.getRoundendttime();
		   	     	originalendtime = new SimpleDateFormat("hh:mm a").format(oet);
		   	     	originalstarttime = new SimpleDateFormat("hh:mm a").format(ost);
		   	     	String ostformat1 = new SimpleDateFormat("HH:mm:ss").format(oet);
		   	    
		   	     	SimpleDateFormat simpleDateFormat4 = new SimpleDateFormat("HH:mm:ss");
					ust = simpleDateFormat4.parse(updatedstarttime);
					uet = simpleDateFormat4.parse(updatedendtime);
					
					//Using a method from different class to calculate the date difference 
					TimeDateYearDifferenceMethod st = new TimeDateYearDifferenceMethod();
					st.findDifference(xo1, xo2);
			        long days = st.difference_In_Days;
					int totalnoofdays = (int)days;
					
					//case 1:
					 dbupdate = sd+" "+pve_emp_bid_endtime;
		    		  window.updatebiddingTodayTime(dbupdate,durationid);	
		    		  DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
		    	      Date upst = dateFormat.parse(updatedstarttime);
		    	      Date uped = dateFormat.parse(updatedendtime);
		    		  t1hrs = pve_emp_bid_endtime.getHours()-upst.getHours();
		    		  t2hrs = uped.getHours() - stime.getHours();
		    		  
		    		  DateTimeFormatConverters conversion = new DateTimeFormatConverters();
		    		  String fisrtDayEndTime = conversion.Conversion(pve_emp_bid_endtime,1);
		    		  String fisrtDayStartTime = conversion.Conversion(upst, 1);
		    		  String lastDayStartTime = conversion.Conversion(stime,1);
		    		  String lastDayEndTime = conversion.Conversion(uped,1);
			
				if(includeexcludestatus==0)
	{
					//System.out.println("Weekend IS included");
			        for(int m=0;m<=totalnoofdays+1;m++)
			        {
			        	 SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
						 Calendar calendar = Calendar.getInstance();
						 calendar.setTime(sdf.parse(updatedstartdate));
						 calendar.add(Calendar.DATE, m); 
						 increaseddate = sdf.format(calendar.getTime());  
						 Date trying = new SimpleDateFormat("MM/dd/yyyy").parse(increaseddate);
						 Format f3 = new SimpleDateFormat("MMM dd, yyyy");
						 fs3 = f3.format(trying);
						 increaseddatepart1.add(fs3);//increaseddate
			        }

			        int a1 = ur2format1.getDate();
			        int a2 = ur1format1.getDate();
			        if(a1>a2)
			        {
			        	 datefifference = ur2format1.getDate() - ur1format1.getDate();
			        }
			        if(a2>a1)
			        {
				    	 datefifference = ur1format1.getDate() - ur2format1.getDate();
			        }
				    	
				    	if(datefifference==0)
				    	{
				    		difference_In_days=0;
				    		//System.out.println("date2 -  date1:"+difference_In_days);
				    	}
				    	else if(datefifference==1)
				    	{
				    		difference_In_days=1;
				    		//System.out.println("date2 -  date1:"+difference_In_days);
				    	}
				    	else if(datefifference>1)
				    	{
				    		difference_In_days=2;
				    		//System.out.println("date2 -  date1:"+difference_In_days);
				    	}
				    System.out.println("difference_In_days:"+difference_In_days);
				    /***common code for all switch cases ends here***/
				    	
				    	switch (difference_In_days) {
				    	
				    	case 0:
				    		
				    		//System.out.println("case 0:");
					    	  SimpleDateFormat simpleDateFormat3 = new SimpleDateFormat("HH:mm:ss");
							  Date d1 = simpleDateFormat3.parse(updatedstarttime);
							  Date d2 = simpleDateFormat3.parse(updatedendtime);
							  
							  if(d1.getTime()>d2.getTime())
							  {
							   long diff = d1.getTime() - d2.getTime();//as given
						       updatedminutes = TimeUnit.MILLISECONDS.toMinutes(diff);
						        updatedduration = String.valueOf(updatedminutes);
							  }
							  if(d2.getTime()>d1.getTime())
							  {
							   long diff = d2.getTime() - d1.getTime();//as given
						       updatedminutes = TimeUnit.MILLISECONDS.toMinutes(diff);
						        updatedduration = String.valueOf(updatedminutes);
							  }

							  
							  updatedstartdatearray.add(fs1);//updatedstartdate
							  updatedenddatearray.add(fs2);//updatedenddate
							  updatedstarttimetarray.add(upstrtimeinrightformat);
							  updatedendtimearray.add(upendtimeinrightformat);
							  updateddurationarray.add(updatedduration);
							  count = 1;
							  break;
						//*************************************************************************************
				    	
				    	case 1:
				    		
				    		//System.out.println("case 1:");

							   t1mins = t1hrs * 60; 
							   t2mins = t2hrs * 60;
							  t3mins = pve_emp_bid_endtime.getMinutes()-upst.getMinutes();
							  if(t3mins>0)
							  {
								  row1 = t1mins + t3mins;
							  }
							  else
							  {
								  row1 = t1mins + t3mins; 
							  }
							  
							  t4mins = uped.getMinutes() - stime.getMinutes();
							  if(t4mins>0)
							  {
								  row2 = t2mins + t4mins;
							  }
							  else
							  {
								  row2 = t2mins - t4mins;
							  }
							   dur1 = String.valueOf(row1);
							   dur2 = String.valueOf(row2);
				              
				              for(int a=0;a<1;a++)
				              {
				              updatedstartdatearray.add(fs1);//updatedstartdate
				              updatedenddatearray.add(fs1);//updatedstartdate
				              updatedstarttimetarray.add(fisrtDayStartTime);
				              updatedendtimearray.add(fisrtDayEndTime);
				              updateddurationarray.add(dur1);
				              }
				              
				              for(int b=1;b<2;b++) 
				              {
				            	  updatedstartdatearray.add(fs2);//updatedenddate
					              updatedenddatearray.add(fs2);//updatedenddate
					              updatedstarttimetarray.add(lastDayStartTime);
								  updatedendtimearray.add(lastDayEndTime);
								  updateddurationarray.add(dur2);
				              }
				    		count = 2;
				    	    break;
				    	//*************************************************************************************
				    	    
				    	case 2:
				    		//System.out.println("case 2:");				 
				    		 
							   t1mins = t1hrs * 60; 
							   t2mins = t2hrs * 60;
							   t3mins = pve_emp_bid_endtime.getMinutes()-upst.getMinutes();
							  if(t3mins>0)
							  {
								  row1 = t1mins + t3mins;
							  }
							  else
							  {
								  row1 = t1mins + t3mins; 
							  }
							 
							  t4mins = uped.getMinutes() - stime.getMinutes();
							  if(t4mins>0)
							  {
								  row2 = t2mins + t4mins;
							  }
							  else
							  {
								  row2 = t2mins - t4mins;
							  }
							   dur1 = String.valueOf(row1);
							   dur2 = String.valueOf(row2);
				
							   t3hrs = oet.getHours() - ost.getHours();
							   t5mins = oet.getMinutes() - ost.getMinutes();
							   t3hrstomins = t3hrs * 60;
							   
							   if(t5mins>0)
								  {
									  row3 = t3hrstomins + t5mins;
								  }
								  else
								  {
									  row3 = t3hrstomins + t5mins; 
								  }
							   dur3 = String.valueOf(row3);
			
				              
							   int total = totalnoofdays;
							 
							   for(int x=0;x<=total;x++)
						{
				              if(x==0)
				              {
				              updatedstartdatearray.add(increaseddatepart1.get(x));
				              updatedenddatearray.add(increaseddatepart1.get(x));
				              updatedstarttimetarray.add(fisrtDayStartTime);
				              updatedendtimearray.add(fisrtDayEndTime);
				              updateddurationarray.add(dur1);
				              }
				              
				              if(x>0 && x<total)
				              {
				            	  updatedstartdatearray.add(increaseddatepart1.get(x));
					              updatedenddatearray.add(increaseddatepart1.get(x));
					              updatedstarttimetarray.add(originalstarttime);
								  updatedendtimearray.add(originalendtime);
								  updateddurationarray.add(dur3);
				              }
				              
				              if(x==total) 
				              {
				            	  updatedstartdatearray.add(increaseddatepart1.get(x));
					              updatedenddatearray.add(increaseddatepart1.get(x));
					              updatedstarttimetarray.add(originalstarttime);//lastDayStartTime
								  updatedendtimearray.add(lastDayEndTime);
								  updateddurationarray.add(dur2);
				              }
						}
				              
				    		count = total;
				     		break;
				    	}
				    	
				    	/*System.out.println("Old Round Details........");
						for(int i=0;i<1;i++)
						{
							  System.out.println("Round No:"+roundno);
							  System.out.println("Old Start Date:"+sdarray.get(i));		  
							  System.out.println("Old End Date:"+edarray.get(i));
							  System.out.println("Old Start Time:"+starray.get(i)+" "+"("+timezone+")");
							  System.out.println("Old End Time:"+etarray.get(i)+" "+"("+timezone+")");
							  System.out.println("Old Duration:"+duration.get(i)+" "+"mins");
						}
				    	
						System.out.println("Updated Round Details........");
				    	for(int j=0;j<updatedstartdatearray.size();j++)
					    {
					    	System.out.println("Round No:"+roundno);
					    	System.out.println("Updated Start Date:"+updatedstartdatearray.get(j));
					    	System.out.println("Updated End Date:"+updatedenddatearray.get(j));
					    	System.out.println("Updated Start Time:"+updatedstarttimetarray.get(j)+" "+"("+timezone+")");
					    	System.out.println("Updated End Time:"+updatedendtimearray.get(j)+" "+"("+timezone+")");
					    	System.out.println("Updated Duration:"+updateddurationarray.get(j)+" "+"mins");
					    }*/
					       
		
		FindUrlBasedOnRegion findbyregion = new FindUrlBasedOnRegion();
		String region = findbyregion.findRegion(ip);
		
		String fromAddress = "noreplymercuriusinc@gmail.com";
		String senderName = "MercuriusInc";
		String subject = "Your Bidding duration has Increased for Round - "+ roundno +" !!";
		
		
		if(region.equals("dev")) {
		//DEV
		 verifyURL = "https://dev.straightlines.io/login"; //DEV
		}
		else if (region.equals("test")) {
		//TEST
		 verifyURL = "https://test.straightlines.io/login"; //TEST
		}
		else if (region.equals("prod")) {
		//PROD
		 verifyURL = "http://straightlines.io/login"; //PROD
		}
		else if (region.equals("stage")) {
		//STAGING
		verifyURL = "https://staging.straightlines.io/login";//STAGING
		}
		
		String temp = "";
		for(int i=0;i<1;i++){
		temp=temp+"  <tr border-bottom='1' style='text-align:center;padding-top:15px;padding-bottom:15px; border-bottom: 10px solid #000;' >"
		//+ "    <td>"+bnames.get(j)+"</td>\r\n"
		       + "    <td style='padding-top:10px;padding-bottom:10px;'>"+roundno+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+sdarray.get(i)+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+edarray.get(i)+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+starray.get(i)+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+etarray.get(i)+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+duration.get(i)+" mins"+"</td>"
		+ "  </tr>";
		//System.out.println("print temp vlaue:"+temp);
		}
		
//		String temp = "";
//		for(int i=0;i<1;i++)
//		{
//			temp=temp+"  <tr>\r\n"
//			 + 	"<td>"+roundno+"</td>\r\n"
//			 + 	"<td>"+sdarray.get(i)+"</td>\r\n"	  
//			 + 	"<td>"+edarray.get(i)+"</td>\r\n"
//			 + 	"<td>"+starray.get(i)+" "+"("+timezone+")"+"</td>\r\n"
//			 + 	"<td>"+etarray.get(i)+" "+"("+timezone+")"+"</td>\r\n"
//			 + 	"<td>"+duration.get(i)+" "+"mins"+"</td>\r\n"
//			 + 		"  </tr>\r\n";
//		}
		
		String temp1 = "";
		for(int j=0;j<totalnoofdays;j++){
		temp1=temp1+"  <tr border-bottom='1' style='text-align:center;padding-top:15px;padding-bottom:15px; border-bottom: 10px solid #000;' >"
		//+ "    <td>"+bnames.get(j)+"</td>\r\n"
		       + "    <td style='padding-top:10px;padding-bottom:10px;'>"+roundno+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+updatedstartdatearray.get(j)+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+updatedenddatearray.get(j)+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+updatedstarttimetarray.get(j)+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+updatedendtimearray.get(j)+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+updateddurationarray.get(j)+" mins"+"</td>"
		+ "  </tr>";
		//System.out.println("print temp vlaue:"+temp);
		}
		
//		String temp1 = "";
//		for(int j=0;j<count;j++)
//	    {
//			temp1=temp1+"  <tr>\r\n"
//			+ 	"<td>"+roundno+"</td>\r\n"
//			+ 	"<td>"+updatedstartdatearray.get(j)+"</td>\r\n"
//			+ 	"<td>"+updatedenddatearray.get(j)+"</td>\r\n"
//			+ 	"<td>"+updatedstarttimetarray.get(j)+" "+"("+timezone+")"+"</td>\r\n"
//			+ 	"<td>"+updatedendtimearray.get(j)+" "+"("+timezone+")"+"</td>\r\n"
//			+ 	"<td>"+updateddurationarray.get(j)+" "+"mins"+"</td>\r\n"
//			+ 		"  </tr>\r\n";
//	    }
		
		
		int ustsize = updatedstarttimetarray.size();
		System.out.println("what is the array size:"+ustsize);
		System.out.println("totalnoofdays:"+totalnoofdays);
		

		System.out.println("Increase Bid Window Email for one round");	
		String content =
				"<!DOCTYPE html>"

				+"<html lang='en' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:v='urn:schemas-microsoft-com:vml'>"
				+"<head>"
				+"<title></title>"
				+"<meta content='text/html; charset=utf-8' http-equiv='Content-Type'/>"
				+"<meta content='width=device-width, initial-scale=1.0' name='viewport'/>"

				+"<style>"
				+"* {"
				+" box-sizing: border-box;"
				+"}"

				+"body {"
				+"margin: 0;"
				+"padding: 0;"
				+"}"

				+"a[x-apple-data-detectors] {"
				+"color: inherit !important;"
				+"text-decoration: inherit !important;"
				+"}"

				+"#MessageViewBody a {"
				+"color: inherit;"
				+"text-decoration: none;"
				+"}"

				+"p {"
				+"line-height: inherit"
				+"}"

				+"@media (max-width:520px) {"
				+".icons-inner {"
				+"text-align: center;"
				+"}"

				+".icons-inner td {"
				+"margin: 0 auto;"
				+"}"

				+".row-content {"
				+"width: 100% !important;"
				+"}"

				+".column .border {"
				+"display: none;"
				+"}"

				+"table {"
				+"table-layout: fixed !important;"
				+"}"

				+".stack .column {"
				+"width: 100%;"
				+"display: block;"
				+"}"
				+"}"
				+"</style>"
				+"</head>"
				+"<body style='background-color: #f5f5f5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;text-align:center;'>"
				+"<table border='0' cellpadding='0' cellspacing='0' class='nl-container' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
				+"<tbody>"
				+"<tr>"
				+"<td>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
				+"<tbody>"
				+"<tr>"
				+"<td>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;' width='700'>"
				+"<tbody>"
				+"<tr>"
				+"<td  align='center' class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: center; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>"
				+"<table border='0' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				+"<tr>"
				+"<td style='padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;padding-top:15px'>"
				+"<div align='center' style='line-height:10px'><img alt='' src='http://dev.straightlines.io/assets/img/mlog-email-template.png' style='display: inline-block; height: auto; border: 0; width: 110px; max-width: 100%;text-align:center;' align='center' title='' width='110'/></div>"
				+"</td>"
				+"</tr>"
				+"</table></td></tr></tbody></table></td></tr></tbody></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-2' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
				+"<tbody  align='center'><tr><td>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;' width='600'><tbody><tr>"
				+"<td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>"
				+"<table border='0'  align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr>"
				+"<td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div align='center' style='line-height:10px'><img align='center' alt='' src='http://dev.straightlines.io/assets/img/sl1.png' style='display: inline-block; height: auto; border: 0; width: 250px; max-width: 100%;text-align:center;' title='' width='300'/></div></td></tr></table>"
				+"<table border='0' align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr>"
				+"<td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>"

				+"<div align='center' style='line-height:10px'><img align='center' alt='' src='http://dev.straightlines.io/assets/img/BiddingIcon3x.png' style='display: inline-block; height: auto; border: 0; width: 100px; max-width: 100%;text-align:center;' title='' width='100'/></div></td></tr></table>"
				+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div align='center' style='text-align: left;'><span style='color:#000000'>Hello "+fname+" "+lname+" ("+initials+"),<br><br>"
				+"<div align='center' style='text-align: center;'><span style='color:#000000'>Your Bid Window duration for <b>Round "+roundno+"</b> has increased for the Bid Schedule <b>"+result.getBidschename()+"</b>.</span></div>"
				//+"</td></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				//+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div style='text-align: center;'><span style='color:#000000'>The <b>updated</b> Bid Window details for bidding are as follows:</span></div>"
				+"</td></table>"			
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				+"<thead class='thead-dark' style='background-color:#000;color:white'>"
				+"<tr style='text-align:center;padding-top:15px;padding-bottom:15px;'>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Round No</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Date</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Date</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Time</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Time</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Duration</th>"
				+"</tr>"
				+"</thead>"
				+"<tbody style='text-align:center' bgcolor='white'>"
				+temp1
				+" </tbody>"
				+"</table></td></tr></table>"

				
				+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div style='text-align: center;'><span style='color:#000000'>The <b>earlier</b> Bid Window details for reference are as follows:</span></div>"
				+"</td></tr></table>"
				+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				+"<thead class='thead-dark' style='background-color:#D0D0D0; color:black'>"
				+"<tr style='text-align:center;padding-top:15px;padding-bottom:15px;'>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Round No</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Date</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Date</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Time</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Time</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Duration</th>"
				+"</tr>"
				+"</thead>"
				+"<tbody style='text-align:center'>"
				+temp
				+" </tbody>"
				+"</table></td></tr></table>"
								
								
				+"<table border='0' align='center' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: center;'><span style='color:#000000'>Click to login and view the updated Bid Window details.</span></div><div align='center'>"

				+"<a href='"+verifyURL+"' target=\\'_self\\' style=\'text-decoration:none;display:inline-block;color:white !important;background-color:#ff6700;border-radius:20px;width:auto;margin-top:10px;padding-top:3px;padding-bottom:3px;text-align:center;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;\' ><span style=\'padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;\'><span style=\'font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;\'><span data-mce-style=\'font-size: 14px; line-height: 36px;\' style='font-size: 14px; line-height: 36px;color:white;'><strong>Login</strong></span></span></span></a>"
				+"</div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-3' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
				+"<tbody><tr><td>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;' width='500'>"
				+"<tbody><tr align='center'>"
				+"<td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>"
				+"<table border='0' align='center' cellpadding='15' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				+"<tr><td >"

				+"<div style='font-family: Tahoma, Verdana, sans-serif;text-align: center;text-align:center'>"
				+"<div class='txtTinyMce-wrapper' style='font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #393d47; line-height: 1.2;text-align:center'>"
				+"<p style='margin: 0; font-size: 14px; text-align: center;'><span style='font-size:10px;'>© 2021 Mercurius, Inc.® All Rights Reserved.</span><br/><span style='font-size:10px;'>Privacy Policy | Terms and Conditions</span></p>"

				+"</p></span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></body></html>";

	

		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		
		helper.setFrom(fromAddress, senderName);
		helper.setTo(toAddress);
		helper.setSubject(subject);
		
		content = content.replace("[[name]]", email);
		
		content = content.replace("[[URL]]", verifyURL);
		
		helper.setText(content, true);
		
		mailSender.send(message);
		
		System.out.println("Increase window timing Email has been sent");
				
		  sdarray.clear();
		  edarray.clear();
		  starray.clear();
		  etarray.clear();
		  duration.clear();
		  updatedstartdatearray.clear();
		  updatedenddatearray.clear();
		  updatedstarttimetarray.clear();
		  updatedendtimearray.clear();
		  updateddurationarray.clear();
		  count=0;
		  
	}
				
	if(includeexcludestatus==1)
	{
		//System.out.println("Weekends NOT included");
		
		for(int m=0;m<=totalnoofdays+1;m++)
        {
        	 SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
			   Calendar calendar = Calendar.getInstance();
			   calendar.setTime(sdf.parse(updatedstartdate));
			   calendar.add(Calendar.DATE, m); 
			   if(calendar.get(Calendar.DAY_OF_WEEK)== Calendar.SATURDAY||calendar.get(Calendar.DAY_OF_WEEK)== Calendar.SUNDAY)
			   {
				   System.out.println("its a sat/sun day");
			   }
			   else
			   {
			   increaseddate = sdf.format(calendar.getTime());  
			   Date trying = new SimpleDateFormat("MM/dd/yyyy").parse(increaseddate);
			   Format f3 = new SimpleDateFormat("MMM dd, yyyy");
			    fs3 = f3.format(trying);
			    System.out.println("increasing dates in new format:"+fs3);
			   increaseddatepart1.add(fs3);//increaseddate
			   }
			   
        }
		
		//System.out.println("what is the length:"+increaseddatepart1.size());
		int length = increaseddatepart1.size();
		
		
        int a1 = ur2format1.getDate();//July 4
        int a2 = ur1format1.getDate();//June 29
        //System.out.println("ur2format1.getDate():"+ur2format1.getDate());
    	//System.out.println("ur1format1.getDate():"+ur1format1.getDate());
        if(a1>a2)
        {
        	 datefifference = ur2format1.getDate() - ur1format1.getDate();
        	//System.out.println("what is a1>a2:"+datefifference);
        }
	    	//check the date difference between updatedstartdate and updatedenddate
        if(a2>a1)
        {
	    	 datefifference = ur1format1.getDate() - ur2format1.getDate();
	    	//System.out.println("what is a2>a1:"+datefifference);
        }
	    	
	    	if(datefifference==0)
	    	{
	    		difference_In_days=0;
	    		System.out.println("date2 -  date1:"+difference_In_days);
	    	}
	    	else if(datefifference==1)
	    	{
	    		difference_In_days=1;
	    		System.out.println("date2 -  date1:"+difference_In_days);
	    	}
	    	else if(datefifference>1)
	    	{
	    		difference_In_days=2;
	    		System.out.println("date2 -  date1:"+difference_In_days);
	    	}
	    
	    /***common code for all switch cases ends here***/
	    	
	    	switch (difference_In_days) {
	    	
	    	case 0:
	    		
	    		System.out.println("case 0:");
		    	  SimpleDateFormat simpleDateFormat3 = new SimpleDateFormat("HH:mm:ss");
				  Date d1 = simpleDateFormat3.parse(updatedstarttime);
				  Date d2 = simpleDateFormat3.parse(updatedendtime);
				  //long diff = d2.getTime() - d1.getTime();//as given
			      // updatedminutes = TimeUnit.MILLISECONDS.toMinutes(diff);
			     //  String updatedduration = String.valueOf(updatedminutes);
				  //System.out.println("updatedminutes:"+updatedminutes);
				  
			        if(d1.getTime()>d2.getTime())
					  {
					   long diff = d1.getTime() - d2.getTime();//as given
				       updatedminutes = TimeUnit.MILLISECONDS.toMinutes(diff);
				        updatedduration = String.valueOf(updatedminutes);
					  }
					  if(d2.getTime()>d1.getTime())
					  {
					   long diff = d2.getTime() - d1.getTime();//as given
				       updatedminutes = TimeUnit.MILLISECONDS.toMinutes(diff);
				        updatedduration = String.valueOf(updatedminutes);
					  }

				  
				  updatedstartdatearray.add(fs1);//updatedstartdate
				  updatedenddatearray.add(fs2);//updatedenddate
				  updatedstarttimetarray.add(upstrtimeinrightformat);
				  updatedendtimearray.add(upendtimeinrightformat);
				  updateddurationarray.add(updatedduration);
				  count = 1;
				  break;
			//*************************************************************************************
	    	
	    	case 1:
	    		System.out.println("case 1:");
				  t1hrs = oet.getHours() - ust.getHours();//23 - 20
				  t2hrs = uet.getHours() - ost.getHours();//20 - 20
				  //System.out.println("t1:"+t1hrs+","+"t2:"+t2hrs);
				   t1mins = t1hrs * 60; 
				   t2mins = t2hrs * 60;
				  t3mins = oet.getMinutes() - ust.getMinutes();//00-30
				  if(t3mins>0)
				  {
					  //System.out.println("true");
					  row1 = t1mins + t3mins;
				  }
				  else
				  {
					  //System.out.println("entering false..");
					  row1 = t1mins + t3mins; //here t3mins is a -ve number, so if i put t1mins-t3mins will lead to addition
					  System.out.println("row1:"+row1);
				  }
				  t4mins = uet.getMinutes() - ost.getMinutes();//45-30
				  if(t4mins>0)
				  {
					  row2 = t2mins + t4mins;
				  }
				  else
				  {
					  row2 = t2mins - t4mins;
				  }
				   dur1 = String.valueOf(row1);
				   dur2 = String.valueOf(row2);
	              //System.out.println("final:"+row1+","+row2);
	              
	              for(int a=0;a<1;a++)
	              {
	              updatedstartdatearray.add(fs1);//updatedstartdate
	              updatedenddatearray.add(fs1);//updatedstartdate
	              updatedstarttimetarray.add(fisrtDayStartTime);
	              updatedendtimearray.add(fisrtDayEndTime);
	              updateddurationarray.add(dur1);
	              }
	              
	              for(int b=1;b<2;b++) 
	              {
	            	  updatedstartdatearray.add(fs2);//updatedenddate
		              updatedenddatearray.add(fs2);//updatedenddate
		              updatedstarttimetarray.add(originalstarttime);//lastDayStartTime
					  updatedendtimearray.add(lastDayEndTime);
					  updateddurationarray.add(dur2);
	              }
	              
	    		count = 2;
	    		 dbupdate = sd+" "+ostformat1;
	    		window.updatebiddingTodayTime(dbupdate,durationid);
	    	    break;
	    	//*************************************************************************************
	    	    
	    	case 2:
	    		System.out.println("case 2:");				 
				  t1hrs = oet.getHours() - ust.getHours();//23 - 20
				  t2hrs = uet.getHours() - ost.getHours();//20 - 20
				  System.out.println("t1:"+t1hrs+","+"t2:"+t2hrs);
				   t1mins = t1hrs * 60; 
				   t2mins = t2hrs * 60;
				   t3mins = oet.getMinutes() - ust.getMinutes();//00-30
				  if(t3mins>0)
				  {
					  //System.out.println("true");
					  row1 = t1mins + t3mins;
				  }
				  else
				  {
					  //System.out.println("entering false..");
					  row1 = t1mins + t3mins; //here t3mins is a -ve number, so if i put t1mins-t3mins will lead to addition
					  System.out.println("row1:"+row1);
				  }
				  t4mins = uet.getMinutes() - ost.getMinutes();//45-30
				  if(t4mins>0)
				  {
					  row2 = t2mins + t4mins;
				  }
				  else
				  {
					  row2 = t2mins - t4mins;
				  }
				   dur1 = String.valueOf(row1);
				   dur2 = String.valueOf(row2);
	              //System.out.println("final:"+row1+","+row2);
	
				   t3hrs = oet.getHours() - ost.getHours();
				   t5mins = oet.getMinutes() - ost.getMinutes();
				   System.out.println("T5 mins:"+t5mins);
				   t3hrstomins = t3hrs * 60; 
				   System.out.println("T3 hrs:"+t3hrstomins);
				   
				   if(t5mins>0)
					  {
						  //System.out.println("true");
						  row3 = t3hrstomins + t5mins;
					  }
					  else
					  {
						  //System.out.println("entering false..");
						  row3 = t3hrstomins + t5mins; //here t5mins is a -ve number, 
						  System.out.println("row3:"+row3);
					  }
				   dur3 = String.valueOf(row3);
	              
				   int tot = length-1;
				  for(int x=0;x<length;x++)//length<4 => i.e 3
				   {
				
					  if(x==0)
		              {
		              updatedstartdatearray.add(increaseddatepart1.get(x));
		              updatedenddatearray.add(increaseddatepart1.get(x));
		              updatedstarttimetarray.add(fisrtDayStartTime);
		              updatedendtimearray.add(fisrtDayEndTime);
		              updateddurationarray.add(dur1);
		              }
		              
		              if(x>0 && x<tot)
		              {
		            	  updatedstartdatearray.add(increaseddatepart1.get(x));
			              updatedenddatearray.add(increaseddatepart1.get(x));
			              updatedstarttimetarray.add(originalstarttime);
						  updatedendtimearray.add(originalendtime);
						  updateddurationarray.add(dur3);
		              }
		              
		              if(x==tot) 
		              {
		            	  updatedstartdatearray.add(increaseddatepart1.get(x));
			              updatedenddatearray.add(increaseddatepart1.get(x));
			              updatedstarttimetarray.add(originalstarttime);//lastDayStartTime
						  updatedendtimearray.add(lastDayEndTime);
						  updateddurationarray.add(dur2);
		              }
					  
			   }
	              
				   count = length;
	    		//System.out.println("updating in db"+updatedenddate+" "+ostformat1);
	    		dbupdate = sd+" "+ostformat1;
	    		window.updatebiddingTodayTime(dbupdate,durationid);
	    		break;
	    	}
	    	
	    	/*System.out.println("Old Round Details........");
			for(int i=0;i<1;i++)
			{
				  System.out.println("Round No:"+roundno);
				  System.out.println("Old Start Date:"+sdarray.get(i));		  
				  System.out.println("Old End Date:"+edarray.get(i));
				  System.out.println("Old Start Time:"+starray.get(i)+" "+"("+timezone+")");
				  System.out.println("Old End Time:"+etarray.get(i)+" "+"("+timezone+")");
				  System.out.println("Old Duration:"+duration.get(i)+" "+"mins");
			}
	    	
			System.out.println("Updated Round Details........");
			System.out.println("count value:"+count);
	    	for(int j=0;j<count;j++)
		    {
		    	System.out.println("Round No:"+roundno);
		    	System.out.println("Updated Start Date:"+updatedstartdatearray.get(j));
		    	System.out.println("Updated End Date:"+updatedenddatearray.get(j));
		    	System.out.println("Updated Start Time:"+updatedstarttimetarray.get(j)+" "+"("+timezone+")");
		    	System.out.println("Updated End Time:"+updatedendtimearray.get(j)+" "+"("+timezone+")");
		    	System.out.println("Updated Duration:"+updateddurationarray.get(j)+" "+"mins");
		    }*/
		       
		//checkingurl = siteURL;
		FindUrlBasedOnRegion findbyregion = new FindUrlBasedOnRegion();
		String region = findbyregion.findRegion(ip);
		
		String fromAddress = "noreplymercuriusinc@gmail.com";
		String senderName = "MercuriusInc";
		String subject = "Your Bidding duration has Increased for Round - "+ roundno +" !!";
		
		if(region.equals("dev")) {
		//DEV
		verifyURL = "https://dev.straightlines.io/login"; //DEV
		}
		else if (region.equals("test")) {
		//TEST
		verifyURL = "https://test.straightlines.io/login"; //TEST
		}
		else if (region.equals("prod")) {
		//PROD
		verifyURL = "http://straightlines.io/login"; //PROD
		}
		else if (region.equals("stage")) {
		//STAGING
		verifyURL = "http://staging.straightlines.io/login";//STAGING
		}
		
		String temp = "";
		for(int i=0;i<1;i++){
		temp=temp+"  <tr border-bottom='1' style='text-align:center;padding-top:15px;padding-bottom:15px; border-bottom: 10px solid #000;' >"
		//+ "    <td>"+bnames.get(j)+"</td>\r\n"
		   + "    <td style='padding-top:10px;padding-bottom:10px;'>"+roundno+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+sdarray.get(i)+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+edarray.get(i)+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+starray.get(i)+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+etarray.get(i)+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+duration.get(i)+" mins"+"</td>"
		+ "  </tr>";
		//System.out.println("print temp vlaue:"+temp);
		}
		
		//String temp = "";
		//for(int i=0;i<1;i++)
		//{
		//temp=temp+"  <tr>\r\n"
		// + 	"<td>"+roundno+"</td>\r\n"
		// + 	"<td>"+sdarray.get(i)+"</td>\r\n"	  
		// + 	"<td>"+edarray.get(i)+"</td>\r\n"
		// + 	"<td>"+starray.get(i)+" "+"("+timezone+")"+"</td>\r\n"
		// + 	"<td>"+etarray.get(i)+" "+"("+timezone+")"+"</td>\r\n"
		// + 	"<td>"+duration.get(i)+" "+"mins"+"</td>\r\n"
		// + 		"  </tr>\r\n";
		//}
		
		
		
		String temp1 = "";
		for(int j=0;j<count;j++){
		temp1=temp1+"  <tr border-bottom='1' style='text-align:center;padding-top:15px;padding-bottom:15px; border-bottom: 10px solid #000;' >"
		//+ "    <td>"+bnames.get(j)+"</td>\r\n"
		   + "    <td style='padding-top:10px;padding-bottom:10px;'>"+roundno+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+updatedstartdatearray.get(j)+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+updatedenddatearray.get(j)+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+updatedstarttimetarray.get(j)+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+updatedendtimearray.get(j)+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+updateddurationarray.get(j)+" mins"+"</td>"
		+ "  </tr>";
		//System.out.println("print temp vlaue:"+temp);
		}
		
		//String temp1 = "";
		//for(int j=0;j<count;j++)
		//{
		//temp1=temp1+"  <tr>\r\n"
		//+ 	"<td>"+roundno+"</td>\r\n"
		//+ 	"<td>"+updatedstartdatearray.get(j)+"</td>\r\n"
		//+ 	"<td>"+updatedenddatearray.get(j)+"</td>\r\n"
		//+ 	"<td>"+updatedstarttimetarray.get(j)+" "+"("+timezone+")"+"</td>\r\n"
		//+ 	"<td>"+updatedendtimearray.get(j)+" "+"("+timezone+")"+"</td>\r\n"
		//+ 	"<td>"+updateddurationarray.get(j)+" "+"mins"+"</td>\r\n"
		//+ 		"  </tr>\r\n";
		//}
		
		int ustsize = updatedstarttimetarray.size();
		System.out.println("what is the size:"+ustsize);
		if(ustsize==1)
		{

		System.out.println("window increase email for one round");	
		
		String content =
			"<!DOCTYPE html>"
		
			+"<html lang='en' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:v='urn:schemas-microsoft-com:vml'>"
			+"<head>"
			+"<title></title>"
			+"<meta content='text/html; charset=utf-8' http-equiv='Content-Type'/>"
			+"<meta content='width=device-width, initial-scale=1.0' name='viewport'/>"
		
			+"<style>"
			+"* {"
			+" box-sizing: border-box;"
			+"}"
		
			+"body {"
			+"margin: 0;"
			+"padding: 0;"
			+"}"
		
			+"a[x-apple-data-detectors] {"
			+"color: inherit !important;"
			+"text-decoration: inherit !important;"
			+"}"
		
			+"#MessageViewBody a {"
			+"color: inherit;"
			+"text-decoration: none;"
			+"}"
		
			+"p {"
			+"line-height: inherit"
			+"}"
		
			+"@media (max-width:520px) {"
			+".icons-inner {"
			+"text-align: center;"
			+"}"
		
			+".icons-inner td {"
			+"margin: 0 auto;"
			+"}"
		
			+".row-content {"
			+"width: 100% !important;"
			+"}"
		
			+".column .border {"
			+"display: none;"
			+"}"
		
			+"table {"
			+"table-layout: fixed !important;"
			+"}"
		
			+".stack .column {"
			+"width: 100%;"
			+"display: block;"
			+"}"
			+"}"
			+"</style>"
			+"</head>"
			+"<body style='background-color: #f5f5f5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;text-align:center;'>"
			+"<table border='0' cellpadding='0' cellspacing='0' class='nl-container' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
			+"<tbody>"
			+"<tr>"
			+"<td>"
			+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
			+"<tbody>"
			+"<tr>"
			+"<td>"
			+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;' width='700'>"
			+"<tbody>"
			+"<tr>"
			+"<td  align='center' class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: center; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>"
			+"<table border='0' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
			+"<tr>"
			+"<td style='padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;padding-top:15px'>"
			+"<div align='center' style='line-height:10px'><img alt='' src='http://dev.straightlines.io/assets/img/mlog-email-template.png' style='display: inline-block; height: auto; border: 0; width: 110px; max-width: 100%;text-align:center;' align='center' title='' width='110'/></div>"
			+"</td>"
			+"</tr>"
			+"</table></td></tr></tbody></table></td></tr></tbody></table>"
			+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-2' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
			+"<tbody  align='center'><tr><td>"
			+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;' width='600'><tbody><tr>"
			+"<td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>"
			+"<table border='0'  align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr>"
			+"<td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>"
			+"<div align='center' style='line-height:10px'><img align='center' alt='' src='http://dev.straightlines.io/assets/img/sl1.png' style='display: inline-block; height: auto; border: 0; width: 250px; max-width: 100%;text-align:center;' title='' width='300'/></div></td></tr></table>"
			+"<table border='0' align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr>"
			+"<td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>"
		
			+"<div align='center' style='line-height:10px'><img align='center' alt='' src='http://dev.straightlines.io/assets/img/BiddingIcon3x.png' style='display: inline-block; height: auto; border: 0; width: 100px; max-width: 100%;text-align:center;' title='' width='100'/></div></td></tr></table>"
			+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
			+"<tr align='center'>"
			+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
			+"<div align='center' style='text-align: left;'><span style='color:#000000'>Hello "+fname+" "+lname+" ("+initials+"),<br><br>"
			+"<div align='center' style='text-align: center;'><span style='color:#000000'>Your Bid Window duration for <b>Round "+roundno+"</b> has increased for the Bid Schedule <b>"+result.getBidschename()+"</b>.</span></div>"
			//+"</td></table>"
			+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
			//+"<tr align='center'>"
			+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
			+"<div style='text-align: center;'><span style='color:#000000'>The <b>updated</b> Bid Window details for bidding are as follows:</span></div>"
			+"</td></table>"			
			+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
			+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
			+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
			+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
			+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
			+"<thead class='thead-dark' style='background-color:#000;color:white'>"
			+"<tr style='text-align:center;padding-top:15px;padding-bottom:15px;'>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Round No</th>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Date</th>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Date</th>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Time</th>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Time</th>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Duration</th>"
			+"</tr>"
			+"</thead>"
			+"<tbody style='text-align:center' bgcolor='white'>"
			+temp1
			+" </tbody>"
			+"</table></td></tr></table>"
		
		
			
			+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
			+"<tr align='center'>"
			+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
			+"<div style='text-align: center;'><span style='color:#000000'>The <b>earlier</b> Bid Window details for reference are as follows:</span></div>"
			+"</td></tr></table>"
			+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
			+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
			+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
			+"<thead class='thead-dark' style='background-color:#D0D0D0; color:black'>"
			+"<tr style='text-align:center;padding-top:15px;padding-bottom:15px;'>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Round No</th>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Date</th>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Date</th>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Time</th>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Time</th>"
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Duration</th>"
			+"</tr>"
			+"</thead>"
			+"<tbody style='text-align:center'>"
			+temp
			+" </tbody>"
			+"</table></td></tr></table>"
							
							
			+"<table border='0' align='center' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: center;'><span style='color:#000000'>Click to login and view the updated Bid Window details.</span></div><div align='center'>"
		
			+"<a href='"+verifyURL+"' target=\\'_self\\' style=\'text-decoration:none;display:inline-block;color:white !important;background-color:#ff6700;border-radius:20px;width:auto;margin-top:10px;padding-top:3px;padding-bottom:3px;text-align:center;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;\' ><span style=\'padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;\'><span style=\'font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;\'><span data-mce-style=\'font-size: 14px; line-height: 36px;\' style='font-size: 14px; line-height: 36px;color:white;'><strong>Login</strong></span></span></span></a>"
			+"</div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table>"
			+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-3' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
			+"<tbody><tr><td>"
			+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;' width='500'>"
			+"<tbody><tr align='center'>"
			+"<td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>"
			+"<table border='0' align='center' cellpadding='15' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
			+"<tr><td >"
		
			+"<div style='font-family: Tahoma, Verdana, sans-serif;text-align: center;text-align:center'>"
			+"<div class='txtTinyMce-wrapper' style='font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #393d47; line-height: 1.2;text-align:center'>"
			+"<p style='margin: 0; font-size: 14px; text-align: center;'><span style='font-size:10px;'>© 2021 Mercurius, Inc.® All Rights Reserved.</span><br/><span style='font-size:10px;'>Privacy Policy | Terms and Conditions</span></p>"
		
			+"</p></span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></body></html>";
		
		
			
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message);
			
			helper.setFrom(fromAddress, senderName);
			helper.setTo(toAddress);
			helper.setSubject(subject);
			
			content = content.replace("[[name]]", email);
			
			content = content.replace("[[URL]]", verifyURL);
			
			helper.setText(content, true);
			
			mailSender.send(message);
			
			System.out.println("Bid window increase Email has been sent");
			//System.out.println("the url"+siteURL);
				
			sdarray.clear();
			edarray.clear();
			starray.clear();
			etarray.clear();
			duration.clear();
			updatedstartdatearray.clear();
			updatedenddatearray.clear();
			updatedstarttimetarray.clear();
			updatedendtimearray.clear();
			updateddurationarray.clear();
			count=0; 
		}
		
		else
		{
		
			System.out.println("window increase email for Multiple rounds");
			
			String content =
				"<!DOCTYPE html>"
			
				+"<html lang='en' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:v='urn:schemas-microsoft-com:vml'>"
				+"<head>"
				+"<title></title>"
				+"<meta content='text/html; charset=utf-8' http-equiv='Content-Type'/>"
				+"<meta content='width=device-width, initial-scale=1.0' name='viewport'/>"
			
				+"<style>"
				+"* {"
				+" box-sizing: border-box;"
				+"}"
			
				+"body {"
				+"margin: 0;"
				+"padding: 0;"
				+"}"
			
				+"a[x-apple-data-detectors] {"
				+"color: inherit !important;"
				+"text-decoration: inherit !important;"
				+"}"
			
				+"#MessageViewBody a {"
				+"color: inherit;"
				+"text-decoration: none;"
				+"}"
			
				+"p {"
				+"line-height: inherit"
				+"}"
			
				+"@media (max-width:520px) {"
				+".icons-inner {"
				+"text-align: center;"
				+"}"
			
				+".icons-inner td {"
				+"margin: 0 auto;"
				+"}"
			
				+".row-content {"
				+"width: 100% !important;"
				+"}"
			
				+".column .border {"
				+"display: none;"
				+"}"
			
				+"table {"
				+"table-layout: fixed !important;"
				+"}"
			
				+".stack .column {"
				+"width: 100%;"
				+"display: block;"
				+"}"
				+"}"
				+"</style>"
				+"</head>"
				+"<body style='background-color: #f5f5f5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;text-align:center;'>"
				+"<table border='0' cellpadding='0' cellspacing='0' class='nl-container' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
				+"<tbody>"
				+"<tr>"
				+"<td>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
				+"<tbody>"
				+"<tr>"
				+"<td>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;' width='700'>"
				+"<tbody>"
				+"<tr>"
				+"<td  align='center' class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: center; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>"
				+"<table border='0' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				+"<tr>"
				+"<td style='padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;padding-top:15px'>"
				+"<div align='center' style='line-height:10px'><img alt='' src='http://dev.straightlines.io/assets/img/mlog-email-template.png' style='display: inline-block; height: auto; border: 0; width: 110px; max-width: 100%;text-align:center;' align='center' title='' width='110'/></div>"
				+"</td>"
				+"</tr>"
				+"</table></td></tr></tbody></table></td></tr></tbody></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-2' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
				+"<tbody  align='center'><tr><td>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;' width='600'><tbody><tr>"
				+"<td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>"
				+"<table border='0'  align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr>"
				+"<td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div align='center' style='line-height:10px'><img align='center' alt='' src='http://dev.straightlines.io/assets/img/sl1.png' style='display: inline-block; height: auto; border: 0; width: 250px; max-width: 100%;text-align:center;' title='' width='300'/></div></td></tr></table>"
				+"<table border='0' align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr>"
				+"<td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>"
			
				+"<div align='center' style='line-height:10px'><img align='center' alt='' src='http://dev.straightlines.io/assets/img/BiddingIcon3x.png' style='display: inline-block; height: auto; border: 0; width: 100px; max-width: 100%;text-align:center;' title='' width='100'/></div></td></tr></table>"
				+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div align='center' style='text-align: left;'><span style='color:#000000'>Hello "+fname+" "+lname+" ("+initials+"),<br><br>"
				+"<div align='center' style='text-align: center;'><span style='color:#000000'>Your Bid Window duration for <b>Round "+roundno+"</b> has increased for the Bid Schedule <b>"+result.getBidschename()+"</b>.</span></div>"
				//+"</td></table>"
				+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				//+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div style='text-align: center;'><span style='color:#000000'>The <b>updated</b> Bid Window details for bidding are as follows:</span></div>"
				+"</td></table>"			
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				+"<thead class='thead-dark' style='background-color:#000;color:white'>"
				+"<tr style='text-align:center;padding-top:15px;padding-bottom:15px;'>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Round No</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Date</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Date</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Time</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Time</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Duration</th>"
				+"</tr>"
				+"</thead>"
				+"<tbody style='text-align:center' bgcolor='white'>"
				+temp1
				+" </tbody>"
				+"</table></td></tr></table>"
			
               +"<br>"
               +"<div style='text-align: center;'><span style='color:#000000'><b>Please Note:</b> Bidding will not be available from "+updatedendtimearray.get(0)+"(" + timezone+") to "+updatedstarttimetarray.get(1)+"(" + timezone+")"+".</span></div>"

				
				+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div style='text-align: center;'><span style='color:#000000'>The <b>earlier</b> Bid Window details for reference are as follows:</span></div>"
				+"</td></tr></table>"
				+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				+"<thead class='thead-dark' style='background-color:#D0D0D0; color:black'>"
				+"<tr style='text-align:center;padding-top:15px;padding-bottom:15px;'>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Round No</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Date</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Date</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Time</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Time</th>"
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Duration</th>"
				+"</tr>"
				+"</thead>"
				+"<tbody style='text-align:center'>"
				+temp
				+" </tbody>"
				+"</table></td></tr></table>"
								
								
				+"<table border='0' align='center' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: center;'><span style='color:#000000'>Click to login and view the updated Bid Window details.</span></div><div align='center'>"
			
				+"<a href='"+verifyURL+"' target=\\'_self\\' style=\'text-decoration:none;display:inline-block;color:white !important;background-color:#ff6700;border-radius:20px;width:auto;margin-top:10px;padding-top:3px;padding-bottom:3px;text-align:center;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;\' ><span style=\'padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;\'><span style=\'font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;\'><span data-mce-style=\'font-size: 14px; line-height: 36px;\' style='font-size: 14px; line-height: 36px;color:white;'><strong>Login</strong></span></span></span></a>"
				+"</div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-3' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
				+"<tbody><tr><td>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;' width='500'>"
				+"<tbody><tr align='center'>"
				+"<td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>"
				+"<table border='0' align='center' cellpadding='15' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				+"<tr><td >"
			
				+"<div style='font-family: Tahoma, Verdana, sans-serif;text-align: center;text-align:center'>"
				+"<div class='txtTinyMce-wrapper' style='font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #393d47; line-height: 1.2;text-align:center'>"
				+"<p style='margin: 0; font-size: 14px; text-align: center;'><span style='font-size:10px;'>© 2021 Mercurius, Inc.® All Rights Reserved.</span><br/><span style='font-size:10px;'>Privacy Policy | Terms and Conditions</span></p>"
			
				+"</p></span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table></body></html>";
			
			
				
				MimeMessage message = mailSender.createMimeMessage();
				MimeMessageHelper helper = new MimeMessageHelper(message);
				
				helper.setFrom(fromAddress, senderName);
				helper.setTo(toAddress);
				helper.setSubject(subject);
				
				content = content.replace("[[name]]", email);
				
				content = content.replace("[[URL]]", verifyURL);
				
				helper.setText(content, true);
				
				mailSender.send(message);
				
				System.out.println("window increase Email for multiple rounds has been sent");
				//System.out.println("the url"+siteURL);
					
				sdarray.clear();
				edarray.clear();
				starray.clear();
				etarray.clear();
				duration.clear();
				updatedstartdatearray.clear();
				updatedenddatearray.clear();
				updatedstarttimetarray.clear();
				updatedendtimearray.clear();
				updateddurationarray.clear();
				count=0; 
		}
	  }
		
	}
				else if(intervalStatus==1)
				{
					
				}
				return null;
  }

}


