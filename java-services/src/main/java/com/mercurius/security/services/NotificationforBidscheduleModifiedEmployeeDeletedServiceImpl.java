package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.mercurius.models.AddEmployee;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.BidWindowDuration;
import com.mercurius.models.FindUrlBasedOnRegion;
import com.mercurius.models.UserToLogin;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.BidWindowDurationDao;
import com.mercurius.repository.UserRepository;

@Service
public class NotificationforBidscheduleModifiedEmployeeDeletedServiceImpl implements NotificationforBidscheduleModifiedEmployeeDeletedService {

	@Autowired
	private AddEmployeeDao employee;
	
	@Autowired
	UserRepository user;
	
	@Autowired
	private BidScheduleParamParentDao parent;
	
	@Autowired
	private JavaMailSender mailSender;
	
	@Override
	public List<Object> BidscheduleModifiedEmpDeleted(Long BidscheduleId, Long Empid, String siteURL)
			throws UnsupportedEncodingException, MessagingException {
		// TODO Auto-generated method stub
		
		System.out.println("comings");
		
		Optional<AddEmployee> empdetails = employee.getDetailForEmpId(Empid);
		String email = empdetails.get().getEmail();
		String toAddress = email;
		System.out.println(toAddress);
		String fname = empdetails.get().getFname();
		String lname = empdetails.get().getLname();
		String initials = empdetails.get().getInitials();
		Long managerid = empdetails.get().getManagerid();
		
		//long managerid = info.getBidmanagerid();
		Optional<UserToLogin> u = user.getTheFirstname(managerid);
		String managerfname = u.get().getFirstname();
		String managerlname = u.get().getLastname();
		
		BidScheduleParamParent bd = parent.getbyNoOfRoundsBasedonBidschId(BidscheduleId);
		String bdname = bd.getBidschename();
		System.out.println(bdname);
		
		String fromAddress = "noreplymercuriusinc@gmail.com";
		String senderName = "MercuriusInc";
		String subject = "You are removed from the BidSchedule - "+bdname+"";
		
		
		String checkingurl = siteURL;
		FindUrlBasedOnRegion findbyregion = new FindUrlBasedOnRegion();
		String region = findbyregion.findRegion(checkingurl);
		String verifyURL = null;
		
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
		+"<div align='center' style='text-align: center;'><span style='color:#000000'>We kindly inform you that the Bid Manager, <i>"+managerfname+" "+managerlname+"</i>, has removed you from the existing BidSchedule <b>"+bdname+"</b>.</span></div>"
		//+"<div style='text-align: center;'><span style='color:#000000'>Click on login to view the changes.</span></div>"
		+"</td></tr></table>"
	/*	+"<table align='center'  border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td style='text-align:center;width:100%;'></td></tr></table>"
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
		*/
		+"<table border='0' align='center' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: center;'><span style='color:#000000'>Click on login to view the details.</span></div><div align='center'>"

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

		
		return null;
	}

}
