package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.sql.Time;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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
public class NotificationforBiddingCompleteServiceImpl implements NotificationforBiddingCompleteService{

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
	
	@Autowired
	private SkipVacationInternalService skipinternal;
	
	@Autowired
	private IncompleteStatusForLeaveExhaustedService incompletestatus;
	
	@Override
	public List<Object> BiddingComplete(Long BidscheduleId, Long Empid, int Roundid, int vacationcount,String siteURL, int vaactionexhausted)
			throws UnsupportedEncodingException, MessagingException, ParseException {
		
		List<Hostname> h = hostname.getAllInfo();
		String ip = h.get(0).getIp();
		long minutes = 0;
		
		String var1 = "";
		String var2 = "";
		String var3 = "";
		String var4 = "";
		String var5 = "";
		String var6 = "";
		String status = null;
		
		Long bidschid = BidscheduleId;
		Long empid = Empid;
		int roundno = Roundid;
		String verifyURL = null;
		String checkingurl;
		//if vacationcount=0 then skipped current round OR no rounds skipped
		//if vacationcount>0 then skipped all vacation rounds
		int skippedvacation = vacationcount;
		//System.out.println("vacationcount:"+skippedvacation);
		String vexhaust=null;
		
		Optional<BidScheduleParamParent> bp = parent.findById(bidschid);
		BidScheduleParamParent info = bp.get();
		String location = info.getTimezone();
		String timezone = timez.getAcronym(location);
		long managerid = info.getBidmanagerid();
		Optional<UserToLogin> u = user.getTheFirstname(managerid);
		String managerfname = u.get().getFirstname();
		String managerlname = u.get().getLastname();
		//System.out.println("managername:"+managerfname+","+managerfname);
		String mfname;
		String mlname;
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

		
		Optional<AddEmployee> data1 = employee.getDetailForEmpId(empid);
		AddEmployee details = data1.get();
		String toAddress = details.getEmail();
		String email = toAddress;
		String fname = StringUtils.capitalize(details.getFname());
		String lname = StringUtils.capitalize(details.getLname());
		String initials = details.getInitials();
		
		Optional<BidWindowDuration> data2 = window.findByBidschIdandEmpIdandReoundId(bidschid, empid, roundno);
		BidWindowDuration result = data2.get();
		
		String a1 = result.getShiftlinebidstatus();
		String a2 = result.getVacationbidstatus();
		//System.out.println("status:"+a1+","+a2);
		System.out.println("**Bidding Completion EMAIL**");
		String casecatch = null;
		
		if(a1.equals("System Completed")||(a2.equals("System Completed")))
		{
			System.out.println("Usecase1: System Comlpeted");
			System.out.println("system did");
			var1 = "System has completed the";
			casecatch = "system";
		}
		else if(a1.equals("Manager Completed")&&a2.equals("Manager Completed"))
		{
			System.out.println("Usecase2: Manager Completed");
			var1 = "Bid Manager, ";
			var2 = mfname+" "+mlname+",";
			var3 = "completed the";
			casecatch = "completed";
		}
		else if(a1.equals("Manager Completed")&&a2.equals("Manager Skipped"))
		{
			System.out.println("Usecase 3: Manager completed and skipped");
			var1 = "Bid Manager, ";
			var2 = mfname+" "+mlname+",";
			var3 = "completed the";
			var4 = "Also, Bid Manager has ";
			var5 = "skipped";
			var6 = "the vacation selection for this round.";
			status = "Manager Skipped";
			casecatch = "mskipped";
		}
		else if(a1.equals("Completed")&&a2.equals("Completed"))
		{
			System.out.println("Usecase 4: Employee completed");
			var1 = "You have completed the";
			casecatch = "completed";
		}
		else if(a1.equals("Completed")&&a2.equals("Skipped"))
		{
			System.out.println("Usecase 5: Employee Completed and Skipped");
			var1 = "You have completed the";
			var4 = "Also, you have ";
			var5 = "skipped";
			var6 = "the vacation selection for this round.";
			status = "Skipped";
			casecatch = "uskipped";
		}
		
		if(vaactionexhausted==0)
		{
			vexhaust = "";
		}
		else if(vaactionexhausted==1)
		{
			vexhaust = "Your vacation leave got exhausted with this round. No more bidding shall be allowed for further rounds.";
		}
		
		//String edate = result.getEmpbid_end_time();
		
		//Three types of Completed - Completed,System Completed,Manager Completed
		//so giving  .contains condition here
		
		//Here atleast one status should be "Completed", the possible scenarios are
		// 1. Shiftline_status = Completed, vacation_status=Skipped
		// 2. Shiftline_status = Completed, vacation_status=Not Eligible
		if(a1.contains("Completed")||a2.contains("Completed"))
		{
		
		int rid = result.getRoundseq_id();
		
		String sdate = result.getEmpbid_start_time();
		Date date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(sdate);
	    String newstr = new SimpleDateFormat("MM/dd/yyyy,hh:mm:ss").format(date);
	    String[] split1 = newstr.split(",");
	    String startdate = split1[0];
	    String starttime = split1[1];
	    //System.out.println(startdate);
	    //System.out.println(starttime);
	    String s2 = new SimpleDateFormat("hh:mm a ").format(date);
	    Format fs1 = new SimpleDateFormat("MMM dd, yyyy");
	    String fso1 = fs1.format(date);//////////////
	    //System.out.println("new format start date:"+fso1);
	    
	    String edate = result.getEmpbid_end_time();
	    Date date1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(edate);
	    String newstr1 = new SimpleDateFormat("MM/dd/yyyy,hh:mm:ss").format(date1);
	    String[] split2 = newstr1.split(",");
	    String enddate = split2[0];
	    String endtime = split2[1];
	    //System.out.println(enddate);
	    //System.out.println(endtime);
	    String s3 = new SimpleDateFormat("hh:mm a").format(date1);
	    Format fs2 = new SimpleDateFormat("MMM dd, yyyy");
	    String fso2 = fs2.format(date1);//////////////
	    //System.out.println("new format end date:"+fso2);
	    
	    SimpleDateFormat simpleDateFormat3 = new SimpleDateFormat("hh:mm:ss");
	    //HH:mm:ss format is not working if the starttime is 2022-03-16 12:40:00 and endtime is 2022-03-16 13:00:00
	    Date date3 = simpleDateFormat3.parse(starttime);
		Date date4 = simpleDateFormat3.parse(endtime);
		//System.out.println(date3.getTime()+",,,"+date4.getTime());
		//long diff = date4.getTime() - date3.getTime();//as given
		//long minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
		if(date3.getTime()>date4.getTime())
        {
			long diff = date3.getTime() - date4.getTime();//as given
			 minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
        	//System.out.println("what is a1>a2:"+datefifference);
        }
		if(date4.getTime()>date3.getTime())
        {
		long diff = date4.getTime() - date3.getTime();//as given
		 minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
        }
		
		//System.out.println(minutes);
		//long seconds = TimeUnit.MILLISECONDS.toSeconds(diff);
		
		 List<ShiftlineBidding> sbid = shiftbidding.getshiftdetails(bidschid, empid, roundno);
		 int nz = sbid.size();
		 System.out.println("no of shifts selected:"+sbid.size());
		 for(nz=0;nz<sbid.size();nz++)
		 {
		 //System.out.println("no of shifts selected:"+sbid.size());
			 ShiftlineBidding sd = sbid.get(nz);
			 System.out.println(sd.getSchedulename()+" "+sd.getShiftname()+" "+sd.getPattern());
		 }
		 
		 String temp1 = "";
			for(int i=0;i<nz;i++){
			temp1=temp1+"  <tr border-bottom='1' style='text-align:center;padding-top:5px;padding-bottom:5px; border-bottom: 1px solid #ddd;' >"
			//+ "    <td>"+bnames.get(j)+"</td>\r\n"
		    + "    <td style='padding-top:5px;padding-bottom:5px; border-bottom: 2px solid #ddd;'>"+sbid.get(i).getSchedulename()+" &nbsp; &nbsp; &nbsp;  &nbsp;  &nbsp; &nbsp; &nbsp;"+sbid.get(i).getShiftname()+" &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp;  &nbsp;  "+sbid.get(i).getPattern()+" </td>"
			//+ "    <td style='padding-top:5px;padding-bottom:5px;'>"+sbid.get(i).getShiftname()+"</td>"
			//+ "    <td style='padding-top:5px;padding-bottom:5px;'>"+sbid.get(i).getPattern()+"</td>"
			+ "  </tr>";
			//System.out.println("print temp vlaue:"+temp);
			}
		 
			
		 List<VacationBidding> vbid = vacaybidding.getvacationdetails(bidschid, empid, roundno);
		 int vz = vbid.size();
		 System.out.println("no of vacation selected:"+vbid.size());
		 String[] mat = new String[vz];
		 for(vz=0;vz<vbid.size();vz++)
		 { 
			 VacationBidding v = vbid.get(vz);
			 int sd = v.getVacationstartdate().getMonth()+1;
			 int ed = v.getVacationenddate().getMonth()+1;
			 System.out.println(sd+"/"+v.getVacationstartdate().getDate()+" - "+ed+"/"+v.getVacationenddate().getDate());
			  //mat[i] = v.getVacationstartdate().getMonth()+"/"+v.getVacationstartdate().getDate()+" - "+v.getVacationenddate().getMonth()+"/"+v.getVacationenddate().getDate();
		 }
		 
		 String temp2 = "";
		 temp2=temp2+"  <tr border-bottom='1' style='text-align:center;padding-top:5px;padding-bottom:5px; border-bottom: 1px solid #ddd;' >"
		             //+ "    <td>"+bnames.get(j)+"</td>\r\n"
		             + "    <td style='padding-top:5px;padding-bottom:5px; border-bottom: 2px solid #ddd;'>";

		             //+ "  </tr>";
		             for(int i=0;i<vz;i++){
		             //temp2=temp2+"vbid.get(i).getVacationstartdate().getMonth()+vbid.get(i).getVacationstartdate().getDate()+" &nbsp; - &nbsp;"+vbid.get(i).getVacationenddate().getMonth()+ +vbid.get(i).getVacationenddate().getDate()+";
		            	 int total = vz-1;
		            	 String comma = "";
		            	 if(i==total)
		            	 {
		            		 comma = "";
		            	 }
		            	 else
		            	 {
		            		 comma = ",";
		            	 }
		            	 int sd = vbid.get(i).getVacationstartdate().getMonth()+1;
		    			 int ed = vbid.get(i).getVacationenddate().getMonth()+1;
		             temp2=temp2+sd+"/"+vbid.get(i).getVacationstartdate().getDate()+" &nbsp; - &nbsp;"+ed+"/"+vbid.get(i).getVacationenddate().getDate() +"&nbsp; &nbsp;"+comma+" &nbsp; &nbsp; ";
		             }
		 temp2=temp2+"</td></tr>";
		
		String fromAddress = "noreplymercuriusinc@gmail.com";
		String senderName = "MercuriusInc";
		String subject = "Round - "+ rid +" Bidding Completed!";
		
		String temp = "";
		for(int j=0;j<1;j++){
		temp=temp+"  <tr border-bottom='1' style='text-align:center;padding-top:15px;padding-bottom:15px; border-bottom: 10px solid #000;' >"
		//+ "    <td>"+bnames.get(j)+"</td>\r\n"
		       + "    <td style='padding-top:10px;padding-bottom:10px;'>"+rid+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+fso1+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+fso2+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+s2+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+s3+" "+"("+timezone+")"+"</td>"
		+ "    <td style='padding-top:10px;padding-bottom:10px;'>"+minutes+""+" mins"+"</td>"
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
		
		/*String content =
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
				+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+var1+" <i>"+var2+"</i> "+var3+" <b>Round "+rid+"</b> Bidding for the Bid Schedule <b>"+result.getBidschename()+"</b>.<br>"+var4+"</span></div>"
				+"<br>"
				+"<div style='text-align: center;'><span style='color:#000000'>The Bid Rounds details are as follows:</span></div>"
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
	*/
		if(roundno==1 && casecatch.equals("completed"))
		{
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
				+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+var1+" <i>"+var2+"</i> "+var3+" <b>Round "+rid+"</b> Bidding for the Bid Schedule <b>"+result.getBidschename()+"</b>.<br>"+var4+" <b>"+var5+"</b> "+var6+"</span></div>"
				//+"</td></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				//+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div style='text-align: center;'><span style='color:#000000'>Your bidding information are detailed below:</span></div>"
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
				+"<div style='text-align: center;'><span style='color:#000000'>The Bid Rounds details are as follows:</span></div>"
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
				+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+vexhaust+" <br></div>"
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
		}
		
		if(roundno==1 && casecatch.equals("system"))
		{
			
			
			 subject = "System has completed the Round - "+ rid +" Bidding for you!";
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
				+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+var1+" <i>"+var2+"</i> "+var3+" <b>Round "+rid+"</b> Bidding for the Bid Schedule <b>"+result.getBidschename()+"</b>.<br>"+var4+" <b>"+var5+"</b> "+var6+"</span></div>"
				+"<div align='center' style='text-align: center;'><span style='color:#000000'><b>Note:</b>  System will not make any vacation selections for this round.</span></div>"
				//+"</td></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				//+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div style='text-align: center;'><span style='color:#000000'>Your bidding information are detailed below:</span></div>"
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

				
				/*+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
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
				+"</table></td></tr></table>"*/

				
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
		}
		
		
		if(roundno==1 && (casecatch.equals("uskipped") || casecatch.equals("mskipped")) )
		{
			
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
				+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+var1+" <i>"+var2+"</i> "+var3+" <b>Round "+rid+"</b> Bidding for the Bid Schedule <b>"+result.getBidschename()+"</b>.<br>"+var4+" <b>"+var5+"</b> "+var6+"</span></div>"
				//+"</td></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				//+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div style='text-align: center;'><span style='color:#000000'>Your bidding information are detailed below:</span></div>"
				+"</td></table>"			
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='75%'>"
				+"<thead class='thead-dark' style='background-color:#D0D0D0;color:black'>"
				+"<tr style='text-align:center;padding-top:8px;padding-bottom:8px;'>"
				+"<th style='padding-top:8px;padding-bottom:4px;' scope='col'>ShiftLines Bid</th>"
				+"</tr>"
				+"</thead>"
				+"<tbody style='text-align:center' bgcolor='white'>"
				+temp1
				+" </tbody>"
				+"</table></td></tr></table>"

				
				/*+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
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
				+"</table></td></tr></table>"*/

				
				+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				//+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+var1+" <i>"+var2+"</i> "+var3+" <b>Round "+rid+"</b> Bidding for the Bid Schedule <b>"+result.getBidschename()+"</b>.<br>"+var4+"</span></div>"
				+"<div style='text-align: center;'><span style='color:#000000'>The Bid Rounds details are as follows:</span></div>"
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
		}


		
		//email for rounds>1
		if(roundno>1 && (casecatch.equals("uskipped") || casecatch.equals("mskipped")) )
		{
			
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
				+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+var1+" <i>"+var2+"</i> "+var3+" <b>Round "+rid+"</b> Bidding for the Bid Schedule <b>"+result.getBidschename()+"</b>.<br>"+var4+" <b>"+var5+"</b> "+var6+"</span></div>"
				//+"</td></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				//+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div style='text-align: center;'><span style='color:#000000'>Your bidding information are detailed below:</span></div>"
				+"</td></table>"			
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				/*+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='75%'>"
				+"<thead class='thead-dark' style='background-color:#D0D0D0;color:black'>"
				+"<tr style='text-align:center;padding-top:8px;padding-bottom:8px;'>"
				+"<th style='padding-top:8px;padding-bottom:4px;' scope='col'>ShiftLines Bid</th>"
				+"</tr>"
				+"</thead>"
				+"<tbody style='text-align:center' bgcolor='white'>"
				+temp1
				+" </tbody>"
				+"</table></td></tr></table>"*/

				
				/*+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
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
				+"</table></td></tr></table>"*/

				
				+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+var1+" <i>"+var2+"</i> "+var3+" <b>Round "+rid+"</b> Bidding for the Bid Schedule <b>"+result.getBidschename()+"</b>.<br>"+var4+" <b>"+var5+"</b> "+var6+"</span></div>"
				+"<div style='text-align: center;'><span style='color:#000000'>The Bid Rounds details are as follows:</span></div>"
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
		}
		
		if(roundno>1 && casecatch.equals("completed") )
		{
			
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
				+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+var1+" <i>"+var2+"</i> "+var3+" <b>Round "+rid+"</b> Bidding for the Bid Schedule <b>"+result.getBidschename()+"</b>.<br>"+var4+" <b>"+var5+"</b> "+var6+"</span></div>"
				//+"</td></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				//+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div style='text-align: center;'><span style='color:#000000'>Your bidding information are detailed below:</span></div>"
				+"</td></table>"			
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>"
				/*+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'><tr><td>"
				+"<table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='75%'>"
				+"<thead class='thead-dark' style='background-color:#D0D0D0;color:black'>"
				+"<tr style='text-align:center;padding-top:8px;padding-bottom:8px;'>"
				+"<th style='padding-top:8px;padding-bottom:4px;' scope='col'>ShiftLines Bid</th>"
				+"</tr>"
				+"</thead>"
				+"<tbody style='text-align:center' bgcolor='white'>"
				+temp1
				+" </tbody>"
				+"</table></td></tr></table>"*/

				
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
				//+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+var1+" <i>"+var2+"</i> "+var3+" <b>Round "+rid+"</b> Bidding for the Bid Schedule <b>"+result.getBidschename()+"</b>.<br>"+var4+"</span></div>"
				+"<div style='text-align: center;'><span style='color:#000000'>The Bid Rounds details are as follows:</span></div>"
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
				
				+"<div align='center' style='text-align: center;'><span style='color:#000000'> "+vexhaust+" <br></div>"
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
		}
		
		//System.out.println("the url"+siteURL);
			
		//Condition (skippedvacation==0) based on two conditions
		//1. current employee has both "Complete" status for both shift and vacation status
		//2. current employee has "Skipped" as vacation status (for one round/current round)
		
		//Check if the next employee has Eligible Status and update his starttime for Increased Bid Window email
		Long bid = null;
		Long eid = null;
		int roundid = 0;
		Long durationid = result.getDuid();
		long prevempdurationid = durationid;
		String nextemployeetarttime = edate;
		
		//Get all primary id's for that BidSchedule
		List<Object> array1 = window.getPrimaryIds(bidschid);
		Long lastid = (Long) array1.get(array1.size()-1);
		//Capture the last element of the primaryid from that array for the FOR loop
		//System.out.println("lastprimaryid:"+lastid);
		
		if(skippedvacation==0)//no rounds skipped OR one round skipped
		{
			System.out.println("Skipped vacation for one/current Round");
		for(long k=durationid+1;k<=lastid;k++)//durationid = primaryid of the bidding completed Employee
		{
			Optional<BidWindowDuration>  nrec = window.findById(k);
			//System.out.println("k value:"+k);
			if(!nrec.isEmpty()) 
			{
				BidWindowDuration res = nrec.get();
				 Long did = res.getDuid();
				 bid = res.getBidschidref();
				 eid = res.getEmpidref();
				 roundid = res.getRoundseq_id();
				 String ss = res.getShiftlinebidstatus();
				 String vs = res.getVacationbidstatus();
				 //System.out.println(did+",,"+bid+",,"+eid+",,"+ss+",,"+vs);
				 
				 //Two Eligible are there - Eligible, Not Eligible
				 //We need only the exact word "Eligible" so giving .equals condition
				 
	//The Shiftline_status and Vacation_status should be "Eligible"
	/*If current vacation round is skipped for employee1 then bidincrease will happen only to employee2*/
	
				if(ss.equals("Eligible")&&vs.equals("Eligible"))
				{
					//System.out.println(res.getEmpbid_start_time()+",,,"+edate);
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
		
		/* if a employee skipped vacation for all rounds, 
		 * then round 2,3,4.. etc will have "skipped" as both shiftline_status and vacation_status
		 */
		
		List<Object> array2 = window.getPrimaryIds(bidschid);
		Long lastid1 = (Long) array2.get(array2.size()-1);
		
		if(skippedvacation>0)//multiple rounds are skipped
		{
			System.out.println("Skipping multiple round for current employee");
			//skip.SkipVacation(bidschid, empid, roundno+1, skippedvacation, siteURL);
			skipinternal.SkipVacationJavaInternal(bidschid, empid, roundno+1, skippedvacation, siteURL, status);
			
			
			for(long k=durationid+1;k<=lastid1;k++)//durationid = primaryid of the bidding completed Employee
			{
			System.out.println("checking in............");
				Optional<BidWindowDuration>  nrec = window.findById(k);
				//System.out.println("k value:"+k);
				if(!nrec.isEmpty()) 
				{
					BidWindowDuration res = nrec.get();
					 Long did = res.getDuid();
					 bid = res.getBidschidref();
					 eid = res.getEmpidref();
					 roundid = res.getRoundseq_id();
					 String ss = res.getShiftlinebidstatus();
					 String vs = res.getVacationbidstatus();
					 //System.out.println(did+",,"+bid+",,"+eid+",,"+ss+",,"+vs);
					 
					 //Two Eligible are there - Eligible, Not Eligible
					 //We need only the exact word "Eligible" so giving .equals condition
					 
		//The Shiftline_status and Vacation_status should be "Eligible"
		/*If current vacation round is skipped for employee1 then bidincrease will happen only to employee2*/
		
					if(ss.equals("Eligible")&&vs.equals("Eligible"))
					{
						//System.out.println(res.getEmpbid_start_time()+",,,"+edate);
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
						increaseService.BidWindowTimeIcreasedForEmployee(bid, eid, roundid, siteURL, prevempdurationid);
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
			
			System.out.println("Bischedule increase email for next employees");
			Optional<BidWindowDuration> d1 = window.findByBidschIdandEmpIdandReoundId(bidschid, empid, roundno);
			Long pid = d1.get().getDuid();
			//System.out.println("primaryid:"+pid);
			//Optional<BidWindowDuration>  nc = window.findById(pid);
			
			BidScheduleParamParent bp1 = parent.getbyNoOfRoundsBasedonBidschId(bidschid);
			long totalrounds = bp1.getTotalbidrounds();
			//System.out.println("totalrounds:"+totalrounds);
			
			/*long keyval = pid+1;
			Optional<BidWindowDuration> nextemp = window.findById(keyval);
			long nextempbidschid = nextemp.get().getBidschidref();
			long nextempempid = nextemp.get().getEmpidref();
			long nextemproundno = nextemp.get().getRoundseq_id();
			
			if(bidschid==nextempbidschid)//compare current employee and next employee share same bidschedule
			{
			for(int a=(int) nextemproundno;a<=totalrounds;a++)
			{
				Optional<BidWindowDuration> d2 = window.findByBidschIdandEmpIdandReoundId(nextempbidschid, nextempempid, a);
				
			}
			}*/
			
			for(long k=pid+1;k<=lastid1;k++)
			{
				Optional<BidWindowDuration>  nrec = window.findById(k);
				//System.out.println("k value:"+k);
				if(!nrec.isEmpty()) 
				{
					BidWindowDuration res = nrec.get();
					 Long did = res.getDuid();
					 bid = res.getBidschidref();
					 eid = res.getEmpidref();
					 rid = res.getRoundseq_id();
					 String ss = res.getShiftlinebidstatus();
					 String vs = res.getVacationbidstatus();
					 //System.out.println(did+",,"+bid+",,"+eid+",,"+ss+",,"+vs);
					 
					 //Two Eligible are there - Eligible, Not Eligible
					 //We need only the exact word "Eligible" so giving .equals condition
					 
		//The Shiftline_status and Vacation_status should be "Eligible"
		/*If current vacation round is skipped for employee1 then bidincrease will happen only to employee2*/
		
					if(ss.equals("Eligible")&&vs.equals("Eligible"))
					{
						//System.out.println("nextemployeetarttime:"+nextemployeetarttime);
						res.setEmpbid_start_time(nextemployeetarttime);
						window.save(res);
						//set the endtime of bidding completed employee as startime of next employee
						//increaseService.BidWindowTimeIcreasedForEmployee(bid, eid, rid, siteURL);
						//trigger the bid window increase email
						int counton=0;
						if(roundno == rid)
						{
							System.out.println("condition TRUE");
						//System.out.println("Same Rounds");
						///WORK HERE...............
						for(int a=rid+1;a<=totalrounds;a++) 
						{
							System.out.println("ENTER:"+counton);
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
							increaseService.BidWindowTimeIcreasedForEmployee(d3.get().getBidschidref(), d3.get().getEmpidref(), d3.get().getRoundseq_id(), siteURL, prevempdurationid);
							counton++;
							//System.out.println("total counton value:"+counton);
							System.out.println("EXIT:"+counton);
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
							increaseService.BidWindowTimeIcreasedForEmployee(d3.get().getBidschidref(), d3.get().getEmpidref(), d3.get().getRoundseq_id(), siteURL, prevempdurationid);
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
				
			}
		
			}
		
		/*added*/
		if(vaactionexhausted==1)
		{

			System.out.println("Skipping multiple round for current employee");
			//skip.SkipVacation(bidschid, empid, roundno+1, skippedvacation, siteURL);
			//skipinternal.SkipVacationJavaInternal(bidschid, empid, roundno+1, skippedvacation, siteURL, status);
			incompletestatus.IncompleteStatusUpdate(bidschid, empid, roundno+1, siteURL, "Not Eligible");
			
			System.out.println("Bischedule increase email for next employees");
			Optional<BidWindowDuration> d1 = window.findByBidschIdandEmpIdandReoundId(bidschid, empid, roundno);
			Long pid = d1.get().getDuid();
			//System.out.println("primaryid:"+pid);
			//Optional<BidWindowDuration>  nc = window.findById(pid);
			
			BidScheduleParamParent bp1 = parent.getbyNoOfRoundsBasedonBidschId(bidschid);
			long totalrounds = bp1.getTotalbidrounds();
			//System.out.println("totalrounds:"+totalrounds);
			
			/*long keyval = pid+1;
			Optional<BidWindowDuration> nextemp = window.findById(keyval);
			long nextempbidschid = nextemp.get().getBidschidref();
			long nextempempid = nextemp.get().getEmpidref();
			long nextemproundno = nextemp.get().getRoundseq_id();
			
			if(bidschid==nextempbidschid)//compare current employee and next employee share same bidschedule
			{
			for(int a=(int) nextemproundno;a<=totalrounds;a++)
			{
				Optional<BidWindowDuration> d2 = window.findByBidschIdandEmpIdandReoundId(nextempbidschid, nextempempid, a);
				
			}
			}*/
			
			for(long k=pid+1;k<=lastid1;k++)
			{
				Optional<BidWindowDuration>  nrec = window.findById(k);
				//System.out.println("k value:"+k);
				if(!nrec.isEmpty()) 
				{
					BidWindowDuration res = nrec.get();
					 Long did = res.getDuid();
					 bid = res.getBidschidref();
					 eid = res.getEmpidref();
					 rid = res.getRoundseq_id();
					 String ss = res.getShiftlinebidstatus();
					 String vs = res.getVacationbidstatus();
					 //System.out.println(did+",,"+bid+",,"+eid+",,"+ss+",,"+vs);
					 
					 //Two Eligible are there - Eligible, Not Eligible
					 //We need only the exact word "Eligible" so giving .equals condition
					 
		//The Shiftline_status and Vacation_status should be "Eligible"
		/*If current vacation round is skipped for employee1 then bidincrease will happen only to employee2*/
		
					if(ss.equals("Eligible")&&vs.equals("Eligible"))
					{
						//System.out.println("nextemployeetarttime:"+nextemployeetarttime);
						res.setEmpbid_start_time(nextemployeetarttime);
						window.save(res);
						//set the endtime of bidding completed employee as startime of next employee
						//increaseService.BidWindowTimeIcreasedForEmployee(bid, eid, rid, siteURL);
						//trigger the bid window increase email
						int counton=0;
						if(roundno == rid)
						{
							System.out.println("condition TRUE");
						//System.out.println("Same Rounds");
						///WORK HERE...............
						for(int a=rid+1;a<=totalrounds;a++) 
						{
							System.out.println("ENTER:"+counton);
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
							increaseService.BidWindowTimeIcreasedForEmployee(d3.get().getBidschidref(), d3.get().getEmpidref(), d3.get().getRoundseq_id(), siteURL, prevempdurationid);
							counton++;
							//System.out.println("total counton value:"+counton);
							System.out.println("EXIT:"+counton);
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
							increaseService.BidWindowTimeIcreasedForEmployee(d3.get().getBidschidref(), d3.get().getEmpidref(), d3.get().getRoundseq_id(), siteURL, prevempdurationid);
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
				
			}
		
			
		}
			
		array1.clear();
		array2.clear();
		
		}
		
		
		
	return null;
		
	
}

}



