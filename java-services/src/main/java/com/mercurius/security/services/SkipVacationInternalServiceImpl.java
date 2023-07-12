package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.BidWindowDuration;
import com.mercurius.models.FindUrlBasedOnRegion;
import com.mercurius.models.Hostname;
import com.mercurius.models.UserToLogin;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.BidWindowDurationDao;
import com.mercurius.repository.TimeZoneForBidScheduleDao;
import com.mercurius.repository.UserRepository;

@Service
public class SkipVacationInternalServiceImpl implements SkipVacationInternalService{
	
	@Autowired
	private AddEmployeeDao employee;
	
	@Autowired
	private BidWindowDurationDao window;
	
	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	PasswordEncoder encoder;
	
	@Autowired
	BidScheduleParamParentDao parent;
	
	@Autowired
	TimeZoneForBidScheduleDao timez;
	
	@Autowired
	HostnameService hostname;
	
	@Autowired
	UserRepository user;
	
	@Autowired
	private NotificationForBidScheduleTimeIncreasedService increaseService;

	@Override
	public List<Object> SkipVacationJavaInternal(Long BidscheduleId, Long Empid, int Roundid, int vacationcount,
			String siteURL, String statuspassed) throws UnsupportedEncodingException, MessagingException, ParseException {
		
		List<Hostname> h = hostname.getAllInfo();
		String ip = h.get(0).getIp();
		long minutes =0;
		
		int vcount = vacationcount;
		Long bidschid = BidscheduleId;
		Long empid = Empid;
		int roundno = Roundid;
		String status = statuspassed;
		String verifyURL = null;
		String checkingurl;
		long diff = 0;
		
		Optional<BidScheduleParamParent> bp = parent.findById(bidschid);
		BidScheduleParamParent info = bp.get();
		String location = info.getTimezone();
		String timezone = timez.getAcronym(location);
		
		Optional<AddEmployee> data1 = employee.getDetailForEmpId(empid);
		AddEmployee details = data1.get();
		String toAddress = details.getEmail();
		String email = toAddress;
		String fname = StringUtils.capitalize(details.getFname());
		String lname = StringUtils.capitalize(details.getLname());
		String initials = StringUtils.capitalize(details.getInitials());
		long managerid = details.getManagerid();
		Optional<UserToLogin> u = user.getTheFirstname(managerid);
		String managerfname = u.get().getFirstname();
		String managerlname = u.get().getLastname();
		System.out.println("manager name:"+managerfname+","+managerlname);
		String mfname = null, mlname =null;
		
		if(managerfname.equals(null))
		{
			mfname ="";
		}
		else
		{
			mfname=managerfname;
			mfname=StringUtils.capitalize(managerfname);
		}
		
		if(managerlname.equals(null))
		{
			mlname ="";
		}
		else
		{
			mlname=managerlname;
			mlname=StringUtils.capitalize(managerlname);
		}

		
		Optional<BidWindowDuration> data2 = window.findByBidschIdandEmpIdandReoundId(bidschid, empid, roundno);
		BidWindowDuration result = data2.get();
		long did = result.getDuid();
		System.out.println("what is the did:"+did);
		
		String a1 = result.getShiftlinebidstatus();
		String a2 = result.getVacationbidstatus();
		System.out.println("status:"+a1+","+a2);
		
		//if(a1.contains("Completed")||a2.contains("Completed"))
		System.out.println("vacation count:"+vcount);
		String var1 = "";
		String var2 = "";
		String var3 = "";
		
		if(status.equals("Skipped"))
		{
			System.out.println("Employee Skipped");
			var1 = "You have skipped the";
			status = "Skipped";
		}
		else if(status.equals("Manager Skipped"))
		{
			System.out.println("Manager Skipped");
			var1 = "Bid Manager ";
			var2 = mfname+" "+mlname+",";
			var3 = " has skipped the";
			status = "Manager Skipped";
		}
		
		
		int rid = result.getRoundseq_id();
		
		String sdate = result.getEmpbid_start_time();
		Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(sdate);
	    String newstr = new SimpleDateFormat("MM/dd/yyyy,hh:mm:ss").format(date);
	    String[] split1 = newstr.split(",");
	    String startdate = split1[0];
	    String starttime = split1[1];
	    System.out.println(startdate);
	    System.out.println(starttime);
	    String s2 = new SimpleDateFormat("hh:mm a ").format(date);
	    Format fs1 = new SimpleDateFormat("MMM dd, yyyy");
	    String fso1 = fs1.format(date);//////////////
	    System.out.println("new format start date:"+fso1);
	    
	    String edate = result.getEmpbid_end_time();
	    System.out.println("what is inside edate:"+edate);
	    Date date1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(edate);
	    String newstr1 = new SimpleDateFormat("MM/dd/yyyy,hh:mm:ss").format(date1);
	    String[] split2 = newstr1.split(",");
	    String enddate = split2[0];
	    String endtime = split2[1];
	    System.out.println(enddate);
	    System.out.println(endtime);
	    String s3 = new SimpleDateFormat("hh:mm a").format(date1);
	    Format fs2 = new SimpleDateFormat("MMM dd, yyyy");
	    String fso2 = fs2.format(date1);//////////////
	    System.out.println("new format end date:"+fso2);
	    
	    SimpleDateFormat simpleDateFormat3 = new SimpleDateFormat("HH:mm:ss");
	    Date date3 = simpleDateFormat3.parse(starttime);
		Date date4 = simpleDateFormat3.parse(endtime);
		
		//long diff = date4.getTime() - date3.getTime();//as given
		//long minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
		//System.out.println(minutes);
		//long seconds = TimeUnit.MILLISECONDS.toSeconds(diff);
		
		if(date3.getTime()>date4.getTime())
        {
		 diff = date3.getTime() - date4.getTime();//as given
			 //minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
        	//System.out.println("what is a1>a2:"+datefifference);
        }
		if(date4.getTime()>date3.getTime())
        {
		 diff = date4.getTime() - date3.getTime();//as given
		 //minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
        }
		minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
		
		String nextemployeetarttime = edate;//i.e nextemployeetarttime = previous employee endtime
		
		if(vcount==0)
		{
		
		String fromAddress = "noreplymercuriusinc@gmail.com";
		String senderName = "MercuriusInc";
		String subject = "Skipped Vacation Bidding for the Round - "+ rid;
		
		String temp = "";
		for(int j=0;j<1;j++){
		temp=temp+"  <tr border-bottom='1' style='text-align:center;padding-top:15px;padding-bottom:15px; border-bottom: 10px solid #000;' >"
		//+ "    <td>"+bnames.get(j)+"</td>\r\n"
		       + "    <td style='padding-top:10px;padding-bottom:10px;'>"+rid+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+fso1+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+fso2+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+s2+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+s3+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+status+"</td>"
		+ "  </tr>";
		//System.out.println("print temp vlaue:"+temp);
		}
		
		//checkingurl = siteURL;
		FindUrlBasedOnRegion findbyregion = new FindUrlBasedOnRegion();
		String region = findbyregion.findRegion(ip);
		
		if(region.equals("dev")) {
		//DEV
		 verifyURL = "https://dev.straightlines.io/login"; //DEV
		}
		else if (region.equals("test")) {
		//TEST
		 verifyURL = "https://test.straightlines.io/login";//TEST
		}
		else if (region.equals("prod")) {
		//PROD
		 verifyURL = "http://straightlines.io/login";//PROD
		}
		else if (region.equals("stage")) {
		//STAGING
		 verifyURL = "https://staging.straightlines.io/login";//STAGING
		}
		
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
				+"<div align='center' style='text-align: center;'><span style='color:#000000'>"+var1+" <i>"+var2+"</i> "+var3+" <b>Round "+rid+"</b> bidding for the Bid Schedule <b>"+result.getBidschename()+"</b>.</span></div>"
				//+"<div style='text-align: center;'><span style='color:#000000'>The Bid Rounds details are as follows:</span></div>"
				+"</td></tr></table>"
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
				+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Status</th>"
				+"</tr>"
				+"</thead>"
				+"<tbody style='text-align:center'>"
				+temp
				+" </tbody>"
				+"</table></td></tr></table>"
				+"<table border='0' align='center' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: center;'><span style='color:#000000'>Click on login to view your bidding details.</span></div><div align='center'>"
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
		window.updateShiftAndVacationStatus(status,status, did);
		mailSender.send(message);
		
		System.out.println("Email has been sent");
		//System.out.println("the url"+siteURL);
		
		
		Long bid = null;
		Long eid = null;
		int roundid = 0;
		Long durationid = result.getDuid();
		long prevempdurationid = durationid;
		 nextemployeetarttime = edate;
		
		//Get all primary id's for that BidSchedule
		List<Object> array1 = window.getPrimaryIds(bidschid);
		Long lastid = (Long) array1.get(array1.size()-1);
		//Capture the last element of the primaryid from that array for the FOR loop
		//System.out.println("lastprimaryid:"+lastid);
		
		//no rounds skipped OR one round skipped
		
			System.out.println("Skipped vacation for one/current Round");
		for(long k=durationid+1;k<=lastid;k++)//durationid = primaryid of the bidding completed Employee
		{
			Optional<BidWindowDuration>  nrec = window.findById(k);
			//System.out.println("k value:"+k);
			if(!nrec.isEmpty()) 
			{
				BidWindowDuration res = nrec.get();
				 Long did1 = res.getDuid();
				 bid = res.getBidschidref();
				 eid = res.getEmpidref();
				 roundid = res.getRoundseq_id();
				 String ss = res.getShiftlinebidstatus();
				 String vs = res.getVacationbidstatus();
				 System.out.println(did1+",,"+bid+",,"+eid+",,"+ss+",,"+vs);
				 
				 //Two Eligible are there - Eligible, Not Eligible
				 //We need only the exact word "Eligible" so giving .equals condition
				 
	//The Shiftline_status and Vacation_status should be "Eligible"
	/*If current vacation round is skipped for employee1 then bidincrease will happen only to employee2*/
	
				if(ss.equals("Eligible")&&vs.equals("Eligible"))
				{
					System.out.println(res.getEmpbid_start_time()+",,,"+edate);
					if(res.getEmpbid_start_time().equals(edate)) 
					{
						System.out.println("same date and time, so no increase email trigger");
						break;
					}
					else
					{
						System.out.println("mistach date time, so trigger increase bid window email");
					res.setEmpbid_start_time(nextemployeetarttime);
					window.save(res);
					//set the endtime of bidding completed employee as startime of next employee
					increaseService.BidWindowTimeIcreasedForEmployee(bid, eid, roundid, siteURL,prevempdurationid);
					//trigger the bid window increase email
					break;
					}
				}
				else
				{
					//System.out.println("Condition fails");
					continue;
				}
				
			}
	
		 
		}
	}
		
		ArrayList<String> duration = new ArrayList<String>();
		ArrayList<String> roundidarr = new ArrayList<String>();
		ArrayList<String> bnames = new ArrayList<String>();
	    ArrayList<String> startdatearr = new ArrayList<String>();
	    ArrayList<String> enddatearr = new ArrayList<String>();
		ArrayList<String> starttimearr = new ArrayList<String>();
		ArrayList<String> endtimearr = new ArrayList<String>();
		ArrayList<String> vacationstatus = new ArrayList<String>();
		
		/***adding****/
		
		List<Object> array2 = window.getPrimaryIds(bidschid);
		Long lastid1 = (Long) array2.get(array2.size()-1);
		
		if(vcount>0)
		{
			System.out.println("Skipping more vacation rounds");
			
			if(status.equals("Skipped"))
			{
				System.out.println("Employee Skipped");
				var1 = "You have skipped multiple rounds for the";
				status = "Skipped";
			}
			else if(status.equals("Manager Skipped"))
			{
				System.out.println("Manager Skipped");
				var1 = "Bid Manager ";
				var2 = mfname+" "+mlname+",";
				var3 = " has skipped multiple rounds for the";
				status = "Manager Skipped";
			}
			
			BidScheduleParamParent bp1 = parent.getbyNoOfRoundsBasedonBidschId(bidschid);
			long totalrounds = bp1.getTotalbidrounds();
			BidScheduleParamParent info1 = bp.get();
			String location1 = info.getTimezone();
			String timezone1 = timez.getAcronym(location);
			long minutes1 =0;
			System.out.println("Total rounds in Bidschedule is:"+totalrounds);
			for(int i=roundno;i<totalrounds+1;i++)//roundno=1,totalrounds=6
			{
				
				Optional<BidWindowDuration> ww = window.findByBidschIdandEmpIdandReoundId(bidschid, empid, i);
				BidWindowDuration db = ww.get();
				Long durid = db.getDuid();
				String bidschname = db.getBidschename();
				bnames.add(bidschname);
				
				String stdate = db.getEmpbid_start_time();
				Date convstdate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(stdate);
			    String newstrdate = new SimpleDateFormat("MM/dd/yyyy,hh:mm:ss").format(convstdate);
			    String[] splitsd = newstrdate.split(",");
			    String startdate1 = splitsd[0];
			    String starttime1 = splitsd[1];
			    System.out.println(startdate1);
			    System.out.println(starttime1);
			    String s2format = new SimpleDateFormat("hh:mm a ").format(convstdate);
			    Format fs1format = new SimpleDateFormat("MMM dd, yyyy");
			    String fso1format = fs1format.format(convstdate);//////////////
			    System.out.println("new format start date:"+fso1format);
			    startdatearr.add(fso1format);
			    starttimearr.add(s2format);
			    
			    String endate = db.getEmpbid_end_time();
			    Date convendate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(endate);
			    String newendate = new SimpleDateFormat("MM/dd/yyyy,hh:mm:ss").format(convendate);
			    String[] splited = newendate.split(",");
			    String enddate1 = splited[0];
			    String endtime1 = splited[1];
			    System.out.println(enddate1);
			    System.out.println(endtime1);
			    String s3format = new SimpleDateFormat("hh:mm a").format(convendate);
			    Format fs2format = new SimpleDateFormat("MMM dd, yyyy");
			    String fso2fromat = fs2format.format(convendate);//////////////
			    System.out.println("new format end date:"+fso2fromat);
			    enddatearr.add(fso2fromat);
			    endtimearr.add(s3format);
			    
			    SimpleDateFormat sdf3 = new SimpleDateFormat("HH:mm:ss");
			    Date sd3 = sdf3.parse(starttime1);
				Date ed3 = sdf3.parse(endtime1);
				
//				long diff1 = ed3.getTime() - sd3.getTime();//as given
//			    minutes1 = TimeUnit.MILLISECONDS.toMinutes(diff1);
//				String dur = String.valueOf(minutes1);
//				System.out.println(minutes1);
//				duration.add(dur);
				//long seconds = TimeUnit.MILLISECONDS.toSeconds(diff);
				String dur = null;
				if(ed3.getTime()>sd3.getTime())
		        {
					long diff1 = ed3.getTime() - sd3.getTime();//as given
					 minutes1 = TimeUnit.MILLISECONDS.toMinutes(diff1);
					 dur = String.valueOf(minutes1);
					System.out.println(minutes1);
					//duration.add(dur);
		        }
				if(sd3.getTime()>ed3.getTime())
		        {
					long diff1 = sd3.getTime() - ed3.getTime();//as given
					 minutes1 = TimeUnit.MILLISECONDS.toMinutes(diff1);
					 dur = String.valueOf(minutes1);
					System.out.println(minutes1);
					//duration.add(dur);
		        }
				duration.add(dur);
				System.out.println(minutes1);
	
				
				int rid1 = db.getRoundseq_id();
				String s5 = Integer.toString(rid1);
				//System.out.println(s5);
				roundidarr.add(s5);
				
				String vstatus = db.getVacationbidstatus();
				vacationstatus.add(vstatus);
				window.updateShiftAndVacationStatus(status,status, durid);
				
				////
				
				/*System.out.println("roundno:"+i);
				Optional<BidWindowDuration> ww = window.findByBidschIdandEmpIdandReoundId(bidschid, empid, i);
				BidWindowDuration db = ww.get();
				//BidWindowDuration db = (BidWindowDuration) wind.get(j);//get the records matching two inputs
				Long durid = db.getDuid();
				String bidschname = db.getBidschename();
				bnames.add(bidschname);
				
				Date sdate = db.getBidstartdate();
			    Format formatter = new SimpleDateFormat("MM/dd/yyyy");
			    String s = formatter.format(sdate);
			    //System.out.println(s);
			    Format f1 = new SimpleDateFormat("MMM dd, yyyy");
			    String fs1 = f1.format(sdate);
			    //System.out.println("fs1 value: "+fs1);
			    //startdate.add(s); 
			    startdate.add(fs1);
			    
			    Date edate = db.getBidenddate();
				Format formatter1 = new SimpleDateFormat("MM/dd/yyyy");
			    String s1 = formatter1.format(edate);
			   //System.out.println(s1);
			    //enddate.add(s1); 
			    Format f2 = new SimpleDateFormat("MMM dd, yyyy");
			    String fs2 = f2.format(edate);
			    //System.out.println("fs2 value: "+fs2);
			    enddate.add(fs2); 
			    
			    Time stime = db.getBidstarttime();//emp_bid_starttime 
			    //String[] split1 = stime.split(" ");
			    //String s2 = split1[1];
			    //String s2 = new SimpleDateFormat("H:mm:ss").format(stime);//commented
			    String s2 = new SimpleDateFormat("hh:mm a").format(stime)+" "+"("+timezone+")";
			    //System.out.println(s2);
				starttime.add(s2);
				
				Time etime = db.getBidendtime();//emp_bid_endtime
				//String[] split2 = etime.split(" ");
			    //String s3 = split2[1];
				//String s3 = new SimpleDateFormat("H:mm:ss").format(etime);//commented
				 String s3 = new SimpleDateFormat("hh:mm a").format(etime)+" "+"("+timezone+")";
				//System.out.println(s3);
				endtime.add(s3);
				
				Time dura = db.getEmpbidduration();
				String s4 = dura.toString();
				double minutes = 0;
				String[] split = s4.split(":");
					minutes = Double.parseDouble(split[0])*60 + Double.parseDouble(split[1]) + Double.parseDouble(split[2])/60;
					String rounded = String.format("%.0f", minutes);
					//System.out.println("minutes:"+rounded);
					//System.out.println(duration);
					duration.add(rounded);
				
					int rid = db.getRoundseq_id();
					String s5 = Integer.toString(rid);
					//System.out.println(s5);
					roundid.add(s5);
					
				String vstatus = db.getVacationbidstatus();
				vacationstatus.add(vstatus);*/
				
			
			}
			
			System.out.println(bnames);		
			String temp1 = "";
			for(int j=0;j<bnames.size();j++){
				//temp=(String) temp+;
				//+ "    <td>"+bnames.get(j)+"</td>\r\n" 				
		        System.out.println(roundidarr.get(j));
				System.out.println(startdatearr.get(j));
				System.out.println(enddatearr.get(j));
				System.out.println(starttimearr.get(j));
				System.out.println(endtimearr.get(j));
				System.out.println(duration.get(j)+" mins");
				System.out.println(vacationstatus.get(j));
				//+ "  </tr>";
				//System.out.println("print temp vlaue:"+temp);
			}
			
			String fromAddress1 = "noreplymercuriusinc@gmail.com";
			String senderName1 = "MercuriusInc";
			String subject1 = "Skipped Vacation Bidding for Multiple Rounds";
			
			//String temp = "";
			for(int j=0;j<bnames.size();j++){
			temp1=temp1+"  <tr border-bottom='1' style='text-align:center;padding-top:15px;padding-bottom:15px; border-bottom: 10px solid #000;' >"
			//+ "    <td>"+bnames.get(j)+"</td>\r\n"
			       + "    <td style='padding-top:10px;padding-bottom:10px;'>"+roundidarr.get(j)+"</td>"
			+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+startdatearr.get(j)+"</td>"
			+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+enddatearr.get(j)+"</td>"
			+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+starttimearr.get(j)+" "+"("+timezone1+")"+"</td>"
			+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+endtimearr.get(j)+" "+"("+timezone1+")"+"</td>"
			+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+status+"</td>"
			+ "  </tr>";
			//System.out.println("print temp vlaue:"+temp);
			}
			
			//checkingurl = siteURL;
			FindUrlBasedOnRegion findbyregion1 = new FindUrlBasedOnRegion();
			String region1 = findbyregion1.findRegion(ip);
			
			if(region1.equals("dev")) {
			//DEV
			 verifyURL = "https://dev.straightlines.io/login"; //DEV
			}
			else if (region1.equals("test")) {
			//TEST
			 verifyURL = "https://test.straightlines.io/login";//TEST
			}
			else if (region1.equals("prod")) {
			//PROD
			 verifyURL = "http://straightlines.io/login";//PROD
			}
			else if (region1.equals("stage")) {
			//STAGING
			verifyURL = "http://staging.straightlines.io/login";//STAGING
			}

			String content1 =
			"<!DOCTYPE html>"

			+"<html lang='en' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:v='urn:schemas-microsoft-com:vml'>"
			+"<head>"
			+"<title></title>"
			+"<meta content='text/html; charset=utf-8' http-equiv='Content-Type'/>"
			+"<meta content='width=device-width, initial-scale=1.0' name='viewport'/>"

			// +"<link href='https://fonts.googleapis.com/css?family=Abril+Fatface' rel='stylesheet' type='text/css'/>"
			// +"<link href='https://fonts.googleapis.com/css?family=Alegreya' rel='stylesheet' type='text/css'/>"
			// +"<link href='https://fonts.googleapis.com/css?family=Arvo' rel='stylesheet' type='text/css'/>"
			// +"<link href='https://fonts.googleapis.com/css?family=Bitter' rel='stylesheet' type='text/css'/>"
			// +"<link href='https://fonts.googleapis.com/css?family=Cabin' rel='stylesheet' type='text/css'/>"
			// +"<link href='https://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'/>"

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
			+"<div align='center' style='text-align: center;'><span style='color:#000000'>"+var1+" <i>"+var2+"</i> "+var3+" Bid Schedule <b>"+bnames.get(0)+"</b> and they are detailed below.</span></div>"
			//+"<div style='text-align: center;'><span style='color:#000000'>The Bid Rounds details are as follows:</span></div>"
			+"</td></tr></table>"
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
			+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Status</th>"
			+"</tr>"
			+"</thead>"
			+"<tbody style='text-align:center'>"
			+temp1
			+" </tbody>"
			+"</table></td></tr></table>"
			+"<table border='0' align='center' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: center;'><span style='color:#000000'>Click on login to view your Bid Schedule details.</span></div><div align='center'>"

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

			MimeMessage message1 = mailSender.createMimeMessage();
			MimeMessageHelper helper1 = new MimeMessageHelper(message1);
			
			helper1.setFrom(fromAddress1, senderName1);
			helper1.setTo(toAddress);
			helper1.setSubject(subject1);
			
			content1 = content1.replace("[[name]]", email);
			
			//String verifyURL = "http://dev.straightlines.io/login"; //DEV
			
			//String verifyURL = "http://test.straightlines.io/login"; //TEST
			
			//String verifyURL = "http://straightlines.io/login"; //PROD
			
			content1 = content1.replace("[[URL]]", verifyURL);
			
			helper1.setText(content1, true);
			
			mailSender.send(message1);
			
			System.out.println("Email has been sent");
			//System.out.println("the url"+siteURL);
			
		/***adding**/
			
			/*System.out.println("Bischedule increase email for next employees");
			Optional<BidWindowDuration> d1 = window.findByBidschIdandEmpIdandReoundId(bidschid, empid, roundno);
			Long pid = d1.get().getDuid();
			System.out.println("primaryid:"+pid);
			//Optional<BidWindowDuration>  nc = window.findById(pid);*/
			
			
			/*for(long k=pid+1;k<=lastid1;k++)
			{
				Optional<BidWindowDuration>  nrec = window.findById(k);
				//System.out.println("k value:"+k);
				if(!nrec.isEmpty()) 
				{
					BidWindowDuration res = nrec.get();
					 Long did3 = res.getDuid();
					 Long bid = res.getBidschidref();
					 Long eid = res.getEmpidref();
					 int rid1 = res.getRoundseq_id();
					 String ss = res.getShiftlinebidstatus();
					 String vs = res.getVacationbidstatus();
					 System.out.println(did3+",,"+bid+",,"+eid+",,"+ss+",,"+vs);*/
					 
					 //Two Eligible are there - Eligible, Not Eligible
					 //We need only the exact word "Eligible" so giving .equals condition
					 
		//The Shiftline_status and Vacation_status should be "Eligible"
		/*If current vacation round is skipped for employee1 then bidincrease will happen only to employee2*/
		
				/*	if(ss.equals("Eligible")&&vs.equals("Eligible"))
					{
						System.out.println("nextemployeetarttime:"+nextemployeetarttime);
						
					if(res.getEmpbid_start_time().equals(edate)) 
					{
						System.out.println("same date and time, so no increase email trigger");
						//break;
					}
					else
					{
						res.setEmpbid_start_time(nextemployeetarttime);
						window.save(res);
						//set the endtime of bidding completed employee as startime of next employee
						increaseService.BidWindowTimeIcreasedForEmployee(bid, eid, rid, siteURL);
						//trigger the bid window increase email
					}
						
						if(roundno == rid)
						{
							System.out.println("Same Rounds");
						///WORK HERE...............
						for(int a=rid+1;a<=totalrounds;a++) 
						{
							Optional<BidWindowDuration> d2 = window.findByBidschIdandEmpIdandReoundId(bid, empid, a);//old employee
							Optional<BidWindowDuration> d3 = window.findByBidschIdandEmpIdandReoundId(bid, eid, a);//new employee
							long pid2 = d2.get().getDuid();
							String oempsttime = d2.get().getEmpbid_start_time();
							long pid3 = d3.get().getDuid();
							String nempsttime = d3.get().getEmpbid_start_time();
							System.out.println("old employee pid:"+pid2+"with starttime:"+oempsttime);
							System.out.println("new employee pid:"+pid3+"with starttime:"+nempsttime);
							d3.get().setEmpbid_start_time(oempsttime);
							window.save(d3.get());
							increaseService.BidWindowTimeIcreasedForEmployee(d3.get().getBidschidref(), d3.get().getEmpidref(), d3.get().getRoundseq_id(), ip);
						}
						}
						
						if(roundno !=rid)// 1!=2
						{
							System.out.println("roundno:"+roundno+",,rid:"+rid);
							System.out.println("Different rounds");
							int pp = roundno;
							int nn = rid;
							for(int a=roundno;a<=totalrounds;a++) //1;6;1++
							{
								pp = a+1;
								nn = a+2;
								System.out.println("after increment:"+pp+",,"+nn);
							Optional<BidWindowDuration> d2 = window.findByBidschIdandEmpIdandReoundId(bid, empid, pp);//old employee
							Optional<BidWindowDuration> d3 = window.findByBidschIdandEmpIdandReoundId(bid, eid, nn);//new employee
							if(d2.isPresent()&&d3.isPresent())
							{
							long pid2 = d2.get().getDuid();
							String oempsttime = d2.get().getEmpbid_start_time();
							long pid3 = d3.get().getDuid();
							String nempsttime = d3.get().getEmpbid_start_time();
							System.out.println("old employee pid:"+pid2+"with starttime:"+oempsttime);
							System.out.println("new employee pid:"+pid3+"with starttime:"+nempsttime);
							d3.get().setEmpbid_start_time(oempsttime);
							window.save(d3.get());
							increaseService.BidWindowTimeIcreasedForEmployee(d3.get().getBidschidref(), d3.get().getEmpidref(), d3.get().getRoundseq_id(), ip);
							}
							}
						}
						
						break;
					}
					else
					{
						//System.out.println("Condition fails");
						continue;
					}
					
				}
				
			}*/

			
		}
		
		bnames.clear();
		startdatearr.clear();
		enddatearr.clear();
		starttimearr.clear();
		endtimearr.clear();
		//wind.clear();
		duration.clear();
		roundidarr.clear();
		vacationstatus.clear();
		
	
	
		return null;
 }

}
