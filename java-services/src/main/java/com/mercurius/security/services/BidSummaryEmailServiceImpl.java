package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.ArrayList;
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
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.BidWindowDuration;
import com.mercurius.models.FindUrlBasedOnRegion;
import com.mercurius.models.Hostname;
import com.mercurius.models.ShiftlineBidding;
import com.mercurius.models.UserToLogin;
import com.mercurius.models.VacationBidding;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.BidWindowDurationDao;
import com.mercurius.repository.ShiftlineBiddingDao;
import com.mercurius.repository.TimeZoneForBidScheduleDao;
import com.mercurius.repository.UserRepository;
import com.mercurius.repository.VacationBiddingDao;

@Service
public class BidSummaryEmailServiceImpl implements BidSummaryEmailService  {

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
	private NotificationForBidScheduleTimeIncreasedService increaseService;
	
	@Autowired
	private NotificationforSkippingVacationService skip;
	
	@Autowired
	HostnameService hostname;
	
	@Autowired
	UserRepository user;
	

	@Autowired
	private ShiftlineBiddingDao shiftbidding;
	
	@Autowired
	private VacationBiddingDao vacaybidding;
	
	
	@Override
	public List<Object> BiddingSummary(Long BidscheduleId, Long Empid, String siteURL)
			throws UnsupportedEncodingException, MessagingException, ParseException {
		// TODO Auto-generated method stub
		
		String url  = siteURL;
		List<Hostname> h = hostname.getAllInfo();
		String ip = h.get(0).getIp();
		String verifyURL = null;
		Long bidschid = BidscheduleId;
		Long empid = Empid;
		//int roundno = Roundid;
		System.out.println("BidschId:"+bidschid+", EmpId:"+empid);
		
		Optional<BidScheduleParamParent> bp = parent.findById(bidschid);
		BidScheduleParamParent info = bp.get();
		String location = info.getTimezone();
		long totalrounds = info.getTotalbidrounds();
		String timezone = timez.getAcronym(location);
		long managerid = info.getBidmanagerid();
		Optional<UserToLogin> u = user.getTheFirstname(managerid);
		String managerfname = u.get().getFirstname();
		String managerlname = u.get().getLastname();
		String bidschname = info.getBidschename();
		
		

		Optional<AddEmployee> data1 = employee.getDetailForEmpId(empid);
		AddEmployee details = data1.get();
		String toAddress = details.getEmail();
		System.out.println("emp email:"+toAddress);
		String email = toAddress;
		String fname = StringUtils.capitalize(details.getFname());
		String lname = StringUtils.capitalize(details.getLname());
		String initials = details.getInitials();
		String temp1 = "";
		
		for(int roundno=1;roundno<=1;roundno++)
		{
		//Optional<BidWindowDuration> data2 = window.findByBidschIdandEmpIdandReoundId(bidschid, empid,roundno);
		//BidWindowDuration result = data2.get();
		
		
		List<ShiftlineBidding> sbid = shiftbidding.getshiftdetails(bidschid, empid, roundno);
		 int nz = sbid.size();
		 System.out.println("no of shifts selected:"+sbid.size());
		 for(nz=0;nz<sbid.size();nz++)
		 {
		 //System.out.println("no of shifts selected:"+sbid.size());
			 ShiftlineBidding sd = sbid.get(nz);
			 System.out.println(sd.getSchedulename()+" "+sd.getShiftname()+" "+sd.getPattern());
		 }
		 
		  temp1 = "";
			for(int i=0;i<nz;i++){
			temp1=temp1+"  <tr border-bottom='1' style='text-align:center;padding-top:5px;padding-bottom:5px; border-bottom: 1px solid #ddd;' >"
			//+ "    <td>"+bnames.get(j)+"</td>\r\n"
		    + "    <td style='padding-top:5px;padding-bottom:5px; border-bottom: 2px solid #ddd;'>"+sbid.get(i).getSchedulename()+" &nbsp; &nbsp; &nbsp;  &nbsp;  &nbsp; &nbsp; &nbsp;"+sbid.get(i).getShiftname()+" &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp;  &nbsp;  "+sbid.get(i).getPattern()+" </td>"
			//+ "    <td style='padding-top:5px;padding-bottom:5px;'>"+sbid.get(i).getShiftname()+"</td>"
			//+ "    <td style='padding-top:5px;padding-bottom:5px;'>"+sbid.get(i).getPattern()+"</td>"
			+ "  </tr>";
			//System.out.println("print temp vlaue:"+temp);
			}
		
		}
		
		ArrayList<String> vacationdates = new ArrayList<String>();
		String pushstr = "";
		
		for(int roundno=1;roundno<=totalrounds;roundno++)
		{
			
			Optional<BidWindowDuration> data2 = window.findByBidschIdandEmpIdandReoundId(bidschid, empid, roundno);
			if(!data2.isEmpty())
			{
			BidWindowDuration bwd = data2.get();
			
			String a1 = bwd.getShiftlinebidstatus();
			String a2 = bwd.getVacationbidstatus();
			
			if((a1.endsWith("Completed")&&a2.endsWith("Completed"))||(a1.endsWith("System Completed")&&a2.endsWith("Incomplete")))
			{
			List<VacationBidding> vbid = vacaybidding.getvacationdetails(bidschid, empid, roundno);
			 int vz = vbid.size();
			 System.out.println("no of vacation selected:"+vbid.size());
			 String[] mat = new String[vz];
			 for(vz=0;vz<vbid.size();vz++)
			 { 
				 VacationBidding v = vbid.get(vz);
				 int sd = v.getVacationstartdate().getMonth()+1;
				 int ed = v.getVacationenddate().getMonth()+1;
				 String result = sd+"/"+v.getVacationstartdate().getDate()+" - "+ed+"/"+v.getVacationenddate().getDate();
				 System.out.println(result);
				 if(vz==vbid.size()-1)
				 {
				 pushstr = pushstr.concat(result);
				 }
				 else 
				 {
					 pushstr = pushstr.concat(result)+" ,  "; 
				 }
				  //mat[i] = v.getVacationstartdate().getMonth()+"/"+v.getVacationstartdate().getDate()+" - "+v.getVacationenddate().getMonth()+"/"+v.getVacationenddate().getDate();
			 }
			vacationdates.add(pushstr);
			pushstr="";
		}
		
			else
			{
				vacationdates.add(a2);
				pushstr="";
			}
		/*System.out.println("Size of vacationdates:"+vacationdates.size());
		for(int j=0;j<vacationdates.size();j++)
		{
			int x = j+1;
		System.out.println("Round:"+x+" - "+vacationdates.get(j));
		}*/
		}
		}
		
		
		 String temp2 = "";
		 for(int i=0;i<vacationdates.size();i++){
		 		 temp2=temp2+"  <tr border-bottom='1' style='text-align:center;padding-top:5px;padding-bottom:5px; border-bottom: 1px solid #ddd;' >"
		 		             
		 		             + "    <td style='padding-top:5px;padding-bottom:5px; border-bottom: 2px solid #ddd;'>";

		 		             //+ "  </tr>";
		 		              int x = i+1;
		 		            	 temp2 = temp2+"Round "+x+" - "+vacationdates.get(i)+"</td></tr>";
		 		            
		 }
		
		 String fromAddress = "noreplymercuriusinc@gmail.com";
			String senderName = "MercuriusInc";
			String subject = "Bidding Summary Email";
			
			
			FindUrlBasedOnRegion findbyregion = new FindUrlBasedOnRegion();
			String region = findbyregion.findRegion(ip);
			
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
					+"<div align='center' style='text-align: center;'><span style='color:#000000'> You have completed bidding for all rounds for the Bid Schedule <b>"+bidschname+"</b>.</span></div>"
					//+"</td></table>"
					+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
					+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
					+"<h2 align='center'>BID SUMMARY</h2>"
					+"<div style='text-align: center;'><span style='color:#000000'>The entire bidding summary are detailed below:</span></div>"
					+"</td></table>"			
					+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
					+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
					+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
					+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
					+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='75%'>"
					+"<thead class='thead-dark' style='background-color:#D0D0D0;color:black'>"
					+"<tr style='text-align:center;padding-top:8px;padding-bottom:8px;'>"
					+"<th style='padding-top:8px;padding-bottom:4px;' scope='col'>ShiftLines Bid</th>"
					//+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Date</th>"
					//+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Date</th>"
					//+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Start Time</th>"
					//+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>End Time</th>"
					//+"<th style='padding-top:10px;padding-bottom:10px;' scope='col'>Duration</th>"
					+"</tr>"
					+"</thead>"
					+"<tbody style='text-align:center' bgcolor='white'>"
					+temp1
					+" </tbody>"
					+"</table></td></tr></table>"

					
					+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
					+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
					+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='75%'>"
					+"<thead class='thead-dark' style='background-color:#D0D0D0; color:black'>"
					+"<tr style='text-align:center;padding-top:15px;padding-bottom:15px;'>"
					+"<th style='padding-top:10px;padding-bottom:5px;' scope='col'>Vacations Bid</th>"
					+"</tr>"
					+"</thead>"
					+"<tbody style='text-align:center'>"
					+temp2
					+" </tbody>"
					+"</table></td></tr></table>"

					
					+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
					+"<tr align='center'>"
					+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
					//+"<div style='text-align: center;'><span style='color:#000000'>The Bid Rounds details are as follows:</span></div>"
					+"</td></tr></table>"
					/*+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
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
					+"</table></td></tr></table>"*/
					//+"<div align='center' style='text-align: center;'><span style='color:#000000'>  <br></div>"
					+"<table border='0' align='center' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: center;'><span style='color:#000000'>Click to login and view your Bidding details anytime.</span></div><div align='center'>"
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
			
			System.out.println("Bidding completion email has been sent");

			
			vacationdates.clear();
		return null;
		
	}
 
}
