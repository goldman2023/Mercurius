package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.sql.Time;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.mercurius.models.AddEmployee;
import com.mercurius.models.BidScheduleMapEmployeeDetails;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.BidWindowDuration;
import com.mercurius.models.FindUrlBasedOnRegion;
import com.mercurius.models.Hostname;
import com.mercurius.models.UserToLogin;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.BidScheduleMapEmployeeDetailsDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.BidWindowDurationDao;
import com.mercurius.repository.TimeZoneForBidScheduleDao;
import com.mercurius.repository.UserRepository;

@Service
public class NotificationforBidScheduleChangedServiceImpl implements NotificationForBidScheduleChangedService {

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
	BidScheduleMapEmployeeDetailsDao empstatus;
	
	@Autowired
	UserRepository user;

	@Override
	public List<Object> BidscheduleModified(Long BidscheduleId, String siteURL)
			throws UnsupportedEncodingException, MessagingException {
	
		List<Hostname> h = hostname.getAllInfo();
		String ip = h.get(0).getIp();
		
		Long bidschid = BidscheduleId;

		Optional<BidScheduleParamParent> bp = parent.findById(bidschid);
		BidScheduleParamParent info = bp.get();
		String location = info.getTimezone();
		String timezone = timez.getAcronym(location);
		String verifyURL = null;
		String checkingurl;
		
		List<Long> d1 = window.getEmpIds(bidschid); //get employeeid's based on bidscheduleid
		List<Long> d2 = new ArrayList<Long>(); // new array to remove employeeid duplicates
		for(int i=0;i<d1.size();i++)
		{
			//System.out.println(d1.get(i));
			if(!d2.contains(d1.get(i)))
			{
				d2.add(d1.get(i));
			}
		}
		
		String email;
		
		ArrayList<String> duration = new ArrayList<String>();
		ArrayList<String> roundid = new ArrayList<String>();
		ArrayList<String> bnames = new ArrayList<String>();
	    ArrayList<String> startdate = new ArrayList<String>();
	    ArrayList<String> enddate = new ArrayList<String>();
		ArrayList<String> starttime = new ArrayList<String>();
		ArrayList<String> endtime = new ArrayList<String>();
		
		for(int i=0;i<d2.size();i++)//pass the employee id array
		{
			System.out.println(d2.get(i));
			Long empid = d2.get(i);
			Optional<AddEmployee> data = employee.getDetailForEmpId(empid);//get email id of that employee
			AddEmployee data1 = data.get();
			String toAddress = data1.getEmail();//save the email in toAddress
			email=toAddress;
			String fname = StringUtils.capitalize(data1.getFname());
			String lname = StringUtils.capitalize(data1.getLname());
			String initials = StringUtils.capitalize(data1.getInitials());
			//System.out.println("ToAddress:"+toAddress);
		
			long managerid = data1.getManagerid();
			Optional<UserToLogin> u = user.getTheFirstname(managerid);
			String managerfname = StringUtils.capitalize(u.get().getFirstname());
			String managerlname = StringUtils.capitalize(u.get().getLastname());
			String var1 = "Bid Manager, ";
			String var2 = managerfname+" "+managerlname+",";
			System.out.println("manager name:"+managerfname+","+managerlname);
			
			List<Object> wind = window.findByBidschIdandEmpId(bidschid, empid); // pass the employee id and bidschedule id
			for(int j=0; j<wind.size(); j++)
			{
				
			BidWindowDuration db = (BidWindowDuration) wind.get(j);//get the records matching two inputs
			
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
			
			}
		
			System.out.println(bnames);		
			
			String temp = "";
			for(int j=0;j<bnames.size();j++){
			temp=temp+"  <tr border-bottom='1' style='text-align:center;padding-top:15px;padding-bottom:15px; border-bottom: 10px solid #000;' >"
			//+ "    <td>"+bnames.get(j)+"</td>\r\n"
			       + "    <td style='padding-top:10px;padding-bottom:10px;'>"+roundid.get(j)+"</td>"
			+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+startdate.get(j)+"</td>"
			+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+enddate.get(j)+"</td>"
			+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+starttime.get(j)+"</td>"
			+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+endtime.get(j)+"</td>"
			+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+duration.get(j)+" mins"+"</td>"
			+ "  </tr>";
			//System.out.println("print temp vlaue:"+temp);
			}
			
			List<BidScheduleMapEmployeeDetails>  bempdetails = empstatus.getEmployeesforBidscheduleId(bidschid,empid);
			int tsize = bempdetails.size();
			
			FindUrlBasedOnRegion findbyregion = new FindUrlBasedOnRegion();
			String region = findbyregion.findRegion(siteURL);
			
			
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

			for(int x=0;x<tsize;x++)
			{
				String checkstatus = bempdetails.get(x).getEmployeebidstatus();
				if(checkstatus.equals("Created"))
				{
					System.out.println("Window Added for employee");
					
					
					String fromAddress = "noreplymercuriusinc@gmail.com";
					String senderName = "MercuriusInc";
					String subject = "New Bid Window is Allocated to you!";
					
					
					String content =
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
							+"<div align='center' style='text-align: center;'><span style='color:#000000'>"+var1+" <i>"+var2+"</i> has allocated a new Bid Schedule named <b>"+bnames.get(0)+"</b> for you.</span></div>"
							+"<br>"
							+"<div style='text-align: center;'><span style='color:#000000'>The <b>new</b> Bid Rounds details are as follows:</span></div>"
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
							+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Duration</th>"
							+"</tr>"
							+"</thead>"
							+"<tbody style='text-align:center'>"
							+temp
							+" </tbody>"
							+"</table></td></tr></table>"
							+"<table border='0' align='center' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: center;'><span style='color:#000000'>Click on login to view the Bid Schedule details.</span></div><div align='center'>"

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
							
							System.out.println("Email has been sent");
							//System.out.println("the url"+siteURL);
							
							bnames.clear();
							startdate.clear();
							enddate.clear();
							starttime.clear();
							endtime.clear();
							wind.clear();
							duration.clear();
							roundid.clear();
							wind.clear();
					
				}
				else if(checkstatus.equals("Modified"))
				{
					System.out.println("Window modfied for employee");
					
					
					String fromAddress = "noreplymercuriusinc@gmail.com";
					String senderName = "MercuriusInc";
					String subject = "Your Bid Window details have changed!";
					
					/*System.out.println(bnames);		
					String temp = "";
					for(int j=0;j<bnames.size();j++){
						temp=temp+"  <tr>\r\n"
						//+ "    <td>"+bnames.get(j)+"</td>\r\n" 				
				        + "    <td>"+roundid.get(j)+"</td>\r\n"
						+ "    <td>"+startdate.get(j)+"</td>\r\n"
						+ "    <td>"+enddate.get(j)+"</td>\r\n"
						+ "    <td>"+starttime.get(j)+"</td>\r\n"
						+ "    <td>"+endtime.get(j)+"</td>\r\n"
						+ "    <td>"+duration.get(j)+" mins"+"</td>\r\n"
						+ "  </tr>\r\n";
						//System.out.println("print temp vlaue:"+temp);
					}*/
					

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
					+"<div align='center' style='text-align: center;'><span style='color:#000000'>"+var1+" <i>"+var2+"</i> has modified the Bid Schedule named <b>"+bnames.get(0)+"</b>.</span></div>"
					+"<br>"
					+"<div style='text-align: center;'><span style='color:#000000'>The <b>updated</b> Bid Rounds details are as follows:</span></div>"
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
					+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Duration</th>"
					+"</tr>"
					+"</thead>"
					+"<tbody style='text-align:center'>"
					+temp
					+" </tbody>"
					+"</table></td></tr></table>"
					+"<table border='0' align='center' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: center;'><span style='color:#000000'>Click on login to view the updated Bid Schedule details.</span></div><div align='center'>"

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
					
					System.out.println("Email has been sent");
					System.out.println("the url"+siteURL);
							
					
					bnames.clear();
					startdate.clear();
					enddate.clear();
					starttime.clear();
					endtime.clear();
					wind.clear();
					duration.clear();
					roundid.clear();
					wind.clear();

				}
			}
			
		
	}
		
return null;
}

}
