package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
import com.mercurius.models.FindUrlBasedOnRegion;
import com.mercurius.models.Hostname;
import com.mercurius.models.UserToLogin;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.UserRepository;

@Service
public class NotificationForRegistrationServiceImpl implements NotificationForRegistrationService{
	
	@Autowired
	private AddEmployeeDao employee;
	
	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	PasswordEncoder encoder;
	
	@Autowired
	UserRepository user;

	@Autowired
	HostnameService hostname;
	
	@Override
	public List<Object> sendVerificationUsername(Long BidmanagerId, String siteURL)
			throws UnsupportedEncodingException, MessagingException {
		
		/*Optional<AddEmployee> un1 = employee.getDetailForEmail(username);
		AddEmployee ud3 = un1.get();
	
		Long id = ud3.getManagerid();*/
		
		List<Hostname> h = hostname.getAllInfo();
		String ip = h.get(0).getIp();
		
		Long mid = BidmanagerId;
		Optional<UserToLogin> u = user.getTheFirstname(mid);
		String managerfname = u.get().getFirstname();
		String managerlname = u.get().getLastname();
		String mfname;
		String mlname;
		String email;
		String firstname;
		String lastname;
		String fname;
		String lname;
		String toAddress;
		int notify;
		String encodedText;
		long roleid;
		String verifyURL = null;
		String checkingurl;
		
		List<Object> data = employee.getEmpNamesBasedOnUserId(mid);
		for(int i=0; i<data.size(); i++)
		{
			AddEmployee d1 = (AddEmployee) data.get(i);
			email = d1.getEmail();  
			firstname = d1.getFname();
			lastname = d1.getLname();
			roleid = d1.getrole();
			notify = d1.getEmailsent();
			toAddress = email;
			System.out.println("coming in:.."+toAddress);
			String s = "null";
			//URIEncoder ue = new URIEncoder();
			//encodedText = ue.encodeURI(toAddress);
			
			if(firstname.isEmpty()||firstname.equals(s))
			{
				fname="";
			}
			else 
			{
				fname=StringUtils.capitalize(firstname);
			}
			
			if(lastname.equals(s)||lastname.isEmpty())
			{
				lname="";
			}
			else 
			{
				lname=StringUtils.capitalize(lastname);
			}
			
			encodedText = URLEncoder.encode(toAddress,StandardCharsets.UTF_8.name());
						
			System.out.println("email: "+email);
			System.out.println("after encoded:"+encodedText);
			System.out.println("Registration email trigger for :"+toAddress);
		
		//String fromAddress = "fruitmuskmelon@gmail.com";
			if(notify==0)
			{
		String fromAddress = "noreplymercuriusinc@gmail.com";
		String senderName = "MercuriusInc";
		String subject = "Welcome to StraightLines.";
		
		//checkingurl = siteURL;
		FindUrlBasedOnRegion findbyregion = new FindUrlBasedOnRegion();
		String region = findbyregion.findRegion(ip);
		
		if(region.equals("dev")) {
		//DEV
			System.out.println("what region:"+region);
		 verifyURL = "https://dev.straightlines.io/register?email="+encodedText+"&firstname="+fname+"&lastname="+lname+"&role="+roleid;
		 System.out.println("verifyURL:"+verifyURL);
		}
		else if (region.equals("test")) {
		//TEST
			System.out.println("what region:"+region);
		 verifyURL = "https://test.straightlines.io/register?email="+encodedText+"&firstname="+fname+"&lastname="+lname+"&role="+roleid;
		 System.out.println("verifyURL:"+verifyURL);
		}
		else if (region.equals("prod")) {
		//PROD
		 verifyURL = "http://straightlines.io/register?email="+encodedText+"&firstname="+fname+"&lastname="+lname+"&role="+roleid;
		}
		else if (region.equals("stage")) {
		//STAGING
		 verifyURL = "https://staging.straightlines.io/register?email="+encodedText+"&firstname="+fname+"&lastname="+lname+"&role="+roleid;//PROD
		}
		
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
				+"<div align='center' style='line-height:10px'><img alt='' src='http://dev.straightlines.io/assets/img/mlog-email-template.png' style='display: inline-block; height: auto; border: 0; width: 80px; max-width: 100%;text-align:center;' align='center' title='' width='80'/></div>"
				+"</td>"
				+"</tr>"
				+"</table></td></tr></tbody></table></td></tr></tbody></table>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-2' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>"
				+"<tbody  align='center'><tr><td>"
				+"<table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;' width='600'><tbody><tr>"
				+"<td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>"
				+"<table border='0'  align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr>"
				+"<td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>"
				+"<div align='center' style='line-height:10px'><img align='center' alt=''  src='http://dev.straightlines.io/assets/img/registration.png' style='display: inline-block; height: auto; border: 0; width: 150px; max-width: 100%;text-align:center;' title='' width='200'/></div></td></tr></table>"
				+"<table border='0' align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr>"
				+"<td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>"

				//+"<div align='center' style='line-height:10px'><img align='center' alt='' src='http://dev.straightlines.io/assets/img/BiddingIcon3x.png' style='display: inline-block; height: auto; border: 0; width: 100px; max-width: 100%;text-align:center;' title='' width='100'/></div></td></tr></table>"
				+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"
				
				+"<table border='0' align='left' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: left; font-size:15px'><span style='color:#000000'>Hello "+fname+" "+lname+",<br><br> Bid Manager <i>"+mfname+" "+mlname+"</i>, has added you to StraightLines, a new mobile application for bidding and scheduling.</span></div><div align='center'>"
				+"<br>"
				+"<div style='text-align: left; font-size:15px'><span style='color:#000000'> In order to register your account, please click on the button below.</span></div>"
				+"<br>"
				+"<a href='"+verifyURL+"' target=\\'_self\\' style=\'text-decoration:none;display:inline-block;color:white !important;background-color:#ff6700;border-radius:20px;width:auto;margin-top:10px;padding-top:3px;padding-bottom:3px;text-align:center;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;\' ><span style=\'padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;\'><span style=\'font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;\'><span data-mce-style=\'font-size: 14px; line-height: 36px;\' style='font-size: 14px; line-height: 36px;color:white;'><strong>Register Now</strong></span></span></span></a>"
				+"<br>"
				
				+"<table border='0' align='left' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: left; font-size:15px'><span style='color:#000000'>"
				+ "<p><b><i>To begin using StraightLines...</i></b></p>\r\n"
				+ "\r\n"
				+ "<p style='color:blue;'><b>Mobile Phone</b></p>\r\n"
				//+ "\r\n"
				+ "<p>In a browser on your mobile phone, go to <a href='"+verifyURL+"'>StraightLines</a></p>"
				//+ "</span></div><div align='center'>"
				+ "\r\n"
				+ "<p style='color:blue;'><b>Computer</b></p>"
				+ "<p>StraightLines is currently available as a mobile application. However, you can use the mobile application on a computer by following these instructions:</p>"
				//+ "<p align='center'  1. In a browser on your computer, go to <a href='"+verifyURL+"'>StraightLines.io.</a></p>"
				+ " <ol>"
				+ "  <li>In a browser on your computer, go to <a href='"+verifyURL+"'>StraightLines</a></li>\r\n"
				+ "  <li>Right-click anywhere in the web page.</li>\r\n"
				+ "  <li>In the right-click menu, select:</li>\r\n"
				+ "	 <ul style='list-style-type:circle'>\r\n"
				+ "         <li>“Inspect” (Google Chrome, Microsoft Edge)</li>\r\n"
				+ "         <li>“Inspect Element” (Firefox, Microsoft Internet Explorer, Safari, Opera)</li>\r\n"
				+ "      </ul>"
				+ "  <li>Refresh the web page.</li>\r\n"
				+ "</ol>  "
				+ "<p>The StraightLines application now displays in your browser as it would on a mobile device. You can interact with the application using your computer’s mouse and keyboard. </p>"
				+ "\r\n"
				+ "<p>NOTE: When using Safari, if you don’t see “Inspect Element” in the right-click menu:</p>"
				+ " <ol>"
				+ "  <li>Enable the Develop tab:</li>\r\n"
				+ " <ol type='a'>"
				+ "  <li>Click Safari and select Preferences.</li>\r\n"
				+ "  <li>Select the Advanced tab.</li>\r\n"
				+ "  <li>Check the “Show Develop menu in menu bar” checkbox.</li>\r\n"
				+ " </ol>"
				+ "  <li>Right-click anywhere in the web page.</li>\r\n"
				+ "  <li>Select “Inspect Element” in the right-click menu.</li>\r\n"
				+ "  <li>Refresh the web page.</li>\r\n"
				+ "</ol>  "
				
				+"<br>"
				+"<div style='text-align: left;font-size:15px'><span style='color:#000000';>Best,</span></div>"
				+"<div style='text-align: left;font-size:15px'><span style='color:#000000';>StraightLines Team</span></div>"
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
		System.out.println("the url:"+siteURL);
		System.out.println("the region is:"+region);
		d1.setEmailsent(1);
		employee.save(d1);
		}
			else
			{
				System.out.println("Email already sent!!");
			}
		}
		data.clear();
		return data;
		
	}

}
