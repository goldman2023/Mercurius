package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.mercurius.models.FindUrlBasedOnRegion;
import com.mercurius.models.Hostname;
import com.mercurius.models.UserToLogin;
import com.mercurius.repository.EmailVerify;
import com.mercurius.repository.PasswordRepositery;

import net.bytebuddy.utility.RandomString;

import org.springframework.mail.javamail.JavaMailSender;

@Service
public class PasswordService {

	private static final long EXPIRE_TOKEN_AFTER_MINUTES = 30;
	
	@Autowired
	private PasswordRepositery passwordDao;

	public String forgotPassword(String username) {

		Optional<UserToLogin> userOptional = Optional
				.ofNullable(passwordDao.findByUsername(username));

		if (!userOptional.isPresent()) {
			return "Invalid email id.";
		}

		UserToLogin user = userOptional.get();
		user.setToken(generateToken());
		user.setTokenCreationDate(LocalDateTime.now());

		user = passwordDao.save(user);

		return user.getToken();
	}
	
	public String resetPassword(String token, String password) {

		Optional<UserToLogin> userOptional = Optional
				.ofNullable(passwordDao.findByToken(token));

		if (!userOptional.isPresent()) {
			return "Invalid token.";
		}

		LocalDateTime tokenCreationDate = userOptional.get().getTokenCreationDate();

		if (isTokenExpired(tokenCreationDate)) {
			return "Token expired.";

		}

		UserToLogin user = userOptional.get();

		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(password);
        user.setPassword(encodedPassword);
		
		//user.setPassword(password);
		
		//user.setPassword(encoder.encode(user.getPassword())); //password encryption
		user.setToken(null);
		user.setTokenCreationDate(null);
		user.setFpverify(false);
		user.setTokenCreationDate(null);
		passwordDao.save(user);

		return "Your password successfully updated.";
	}

	/**
	 * Generate unique token. You may add multiple parameters to create a strong
	 * token.
	 * 
	 * @return unique token
	 */
	private String generateToken() {
		StringBuilder token = new StringBuilder();

		return token.append(UUID.randomUUID().toString())
				.append(UUID.randomUUID().toString()).toString();
	}

	/**
	 * Check whether the created token expired or not.
	 * 
	 * @param tokenCreationDate
	 * @return true or false
	 */
	private boolean isTokenExpired(final LocalDateTime tokenCreationDate) {

		LocalDateTime now = LocalDateTime.now();
		Duration diff = Duration.between(tokenCreationDate, now);

		return diff.toMinutes() >= EXPIRE_TOKEN_AFTER_MINUTES;
	}
	/*******************/
	
	@Autowired
	private EmailVerify emailverify;
	
	@Autowired
	private JavaMailSender mailSender;
	
	@Autowired
	HostnameService hostname;

	public UserToLogin forgotPasswordpart1(String username, String surl) throws MessagingException, UnsupportedEncodingException {
		
		//Optional<UserToLogin> userOptional = Optional
			//	.ofNullable(passwordDao.findByUsername(username));
		
		List<Hostname> h = hostname.getAllInfo();
		String ip = h.get(0).getIp();
		
		System.out.println("Forgot password Email trigger for The emil id is:"+username);
		Optional<UserToLogin> un1 = emailverify.findByUsername(username);
		UserToLogin ud3 = un1.get();
		String firstname = ud3.getFirstname();
		String lastname = ud3.getLastname();
		String fname;
		String lname;
		String vcode = ud3.getVerificationCode();
		System.out.println("verification code:"+vcode);
		String verifyURL = null;
		String checkingurl;
		if(vcode==null)
		{
			String randomCode = RandomString.make(64);
			ud3.setVerificationCode(randomCode);
			ud3.setEnabled(false);
			ud3.setFpverify(false);
			emailverify.save(ud3);
		}
		
		String toAddress = ud3.getUsername();
		//String fromAddress = "fruitmuskmelon@gmail.com";
		String fromAddress = "noreplymercuriusinc@gmail.com";
		String senderName = "MercuriusInc";
		String subject = "Reset Password for your StraightLines Account.";
		
		//URIEncoder ue = new URIEncoder();
		//String encodedText = ue.encodeURI(toAddress);
		
		if(firstname.equals(null))
		{
			fname= "";
		}
		else
		{
			fname=StringUtils.capitalize(firstname);
		}
		
		if(lastname.equals(null))
		{
			lname= "";
		}
		else
		{
			lname=StringUtils.capitalize(lastname);
		}
		
		String encodedText = URLEncoder.encode(toAddress,StandardCharsets.UTF_8.name());
   			/* .replaceAll("\\+", "%2B").replaceAll(":", "%3A").replaceAll(";", "%3B").replaceAll("<","%3C").replaceAll("=", "%3D")
  			.replaceAll(">", "%3E").replaceAll("\\?", "%3F").replaceAll("@", "%40")
  			
  			.replaceAll("¡", "%C2%A1")
 			.replaceAll("¢", "%C2%A2").replaceAll("£", "%C2%A3").replaceAll("¤", "%C2%A4").replaceAll("¥", "%C2%A5")
 			.replaceAll("¦", "%C2%A6").replaceAll("§", "%C2%A7").replaceAll("¨", "%C2%A8").replaceAll("©", "%C2%A9")
 			.replaceAll("ª", "%C2%AA").replaceAll("«", "%C2%AB").replaceAll("¬", "%C2%AC").replaceAll("®", "%C2%AE")
 			.replaceAll("¯", "%C2%AF").replaceAll("°", "%C2%B0").replaceAll("±", "%C2%B1").replaceAll("²", "%C2%B2")
 			.replaceAll("³", "%C2%B3").replaceAll("´", "%C2%B4").replaceAll("µ", "%C2%B5").replaceAll("¶", "%C2%B6")
 			.replaceAll("·", "%C2%B7").replaceAll("¸", "%C2%B8").replaceAll("¹", "%C2%B9").replaceAll("º", "%C2%BA")
 			.replaceAll("»", "%C2%BB").replaceAll("¼", "%C2%BC").replaceAll("½", "%C2%BD").replaceAll("¾", "%C2%BE")
 			.replaceAll("¿", "%C2%BF").replaceAll("À", "%C3%80").replaceAll("Á", "%C3%81").replaceAll("Â", "%C3%82")
 			.replaceAll("Ã", "%C3%83").replaceAll("Ä", "%C3%84").replaceAll("Å", "%C3%85").replaceAll("Æ", "%C3%86")
 			.replaceAll("Ç", "%C3%87").replaceAll("È", "%C3%88").replaceAll("É", "%C3%89").replaceAll("Ê", "%C3%8A")
 			.replaceAll("Ë", "%C3%8B").replaceAll("Ì", "%C3%8C").replaceAll("Í", "%C3%8D").replaceAll("Î", "%C3%8E")
 			.replaceAll("Ï", "%C3%8F").replaceAll("Ð", "%C3%90").replaceAll("Ñ", "%C3%91").replaceAll("Ò", "%C3%92")
 			.replaceAll("Ó", "%C3%93").replaceAll("Ô", "%C3%94").replaceAll("Õ", "%C3%95").replaceAll("Ö", "%C3%96")
 			.replaceAll("×", "%C3%97").replaceAll("Ø", "%C3%98").replaceAll("Ù", "%C3%99").replaceAll("Ú", "%C3%9A")
 			.replaceAll("Û", "%C3%9B").replaceAll("Ü", "%C3%9C").replaceAll("Ý", "%C3%9D").replaceAll("Þ", "%C3%9E")
 			.replaceAll("ß", "%C3%9F").replaceAll("à", "%C3%A0").replaceAll("á", "%C3%A1").replaceAll("â", "%C3%A2")
 			.replaceAll("ã", "%C3%A3").replaceAll("ä", "%C3%A4").replaceAll("å", "%C3%A5").replaceAll("æ", "%C3%A6")
 			.replaceAll("ç", "%C3%A7").replaceAll("è", "%C3%A8").replaceAll("é", "%C3%A9").replaceAll("ê", "%C3%AA")
 			.replaceAll("ë", "%C3%AB").replaceAll("ì", "%C3%AC").replaceAll("í", "%C3%AD").replaceAll("î", "%C3%AE")
 			.replaceAll("ï", "%C3%AF").replaceAll("ð", "%C3%B0").replaceAll("ñ", "%C3%B1").replaceAll("ò", "%C3%B2")
 			.replaceAll("ó", "%C3%B3").replaceAll("ô", "%C3%B4").replaceAll("õ", "%C3%B5").replaceAll("ö", "%C3%B6")
 			.replaceAll("÷", "%C3%B7").replaceAll("ø", "%C3%B8").replaceAll("ù", "%C3%B9").replaceAll("ú", "%C3%BA")
 			.replaceAll("û", "%C3%BB").replaceAll("ü", "%C3%BC").replaceAll("ý", "%C3%BD").replaceAll("þ", "%C3%BE")
 			.replaceAll("ÿ", "%C3%BF");*/
		
		//checkingurl = surl;
		FindUrlBasedOnRegion findbyregion = new FindUrlBasedOnRegion();
		String region = findbyregion.findRegion(ip);
		
		if(region.equals("dev")) 
		{
		//DEV
			System.out.println("what region:"+region);
	     verifyURL = "https://dev.straightlines.io/reset-password?email="+encodedText+"&verificationcode="+ud3.getVerificationCode();
	     System.out.println("verifyURL:"+verifyURL);
		}
		else if (region.equals("test")) 
		{
		//TEST
			System.out.println("what region:"+region);
		 verifyURL = "https://test.straightlines.io/reset-password?email="+encodedText+"&verificationcode="+ud3.getVerificationCode();
		 System.out.println("verifyURL:"+verifyURL);
		}
		else if (region.equals("prod")) {
		//PROD
		 verifyURL = "http://straightlines.io/reset-password?email="+encodedText+"&verificationcode="+ud3.getVerificationCode();
		}
		else if (region.equals("stage")) {
		//STAGING
			 verifyURL = "https://staging.straightlines.io/reset-password?email="+encodedText+"&verificationcode="+ud3.getVerificationCode();
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
				+"<div align='center' style='line-height:10px'><img align='center' alt=''  src='http://dev.straightlines.io/assets/img/password-reset.png' style='display: inline-block; height: auto; border: 0; width: 150px; max-width: 100%;text-align:center;' title='' width='200'/></div></td></tr></table>"
				+"<table border='0' align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr>"
				+"<td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>"

				//+"<div align='center' style='line-height:10px'><img align='center' alt='' src='http://dev.straightlines.io/assets/img/BiddingIcon3x.png' style='display: inline-block; height: auto; border: 0; width: 100px; max-width: 100%;text-align:center;' title='' width='100'/></div></td></tr></table>"
				+" <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>"
				+"<tr align='center'>"
				+"<td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>"

				+"<table border='0' align='left' cellpadding='5' cellspacing='0' class='button_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'><tr><td><div style='text-align: left; font-size:15px'><span style='color:#000000'>Hello "+fname+" "+lname+",<br><br>We've received a request to reset the password for the StraightLines account.</span></div><div align='center'>"//associated with user email id: ("+username+").
				+"<br>"
				+"<div style='text-align: left; font-size:15px'><span style='color:#000000'>You can reset your password by clicking the button below:</span></div>"
				+"<br>"
				+"<a href='"+verifyURL+"' target=\\'_self\\' style=\'text-decoration:none;display:inline-block;color:white !important;background-color:#ff6700;border-radius:20px;width:auto;margin-top:10px;padding-top:3px;padding-bottom:3px;text-align:center;font-family:Tahoma, Verdana, Segoe, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;\' ><span style=\'padding-left:50px;padding-right:50px;font-size:18px;display:inline-block;letter-spacing:normal;\'><span style=\'font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;\'><span data-mce-style=\'font-size: 14px; line-height: 36px;\' style='font-size: 14px; line-height: 36px;color:white;'><strong>Reset Your Password</strong></span></span></span></a>"
				+"<br>"
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
		
		content = content.replace("[[name]]", ud3.getUsername());
		
		content = content.replace("[[URL]]", verifyURL);
		
		helper.setText(content, true);
		
		mailSender.send(message);
		//}
		
		System.out.println("Email has been sent");
		System.out.println("the url"+surl);
		//return ud3.getVerificationCode();
		return ud3;
	}
	
	public boolean verify(String verificationCode) {
		UserToLogin user = emailverify.findByVerificationCode(verificationCode);
		
		if (user == null || user.isEnabled()) {
			return false;
		} else {
			user.setVerificationCode(null);
			user.setEnabled(true);
			user.setFpverify(true);
			emailverify.save(user);
			
			return true;
		}

	}

	@Autowired
	private PasswordService passwordService;
	
	public String processForgotPassword1(String username, String home) throws UnsupportedEncodingException, MessagingException {
		
		String response = passwordService.forgotPassword(username);

		if (!response.startsWith("Invalid")) {
			
			Optional<UserToLogin> un1 = emailverify.findByUsername(username);
			UserToLogin ud3 = un1.get();
			String toAddress = ud3.getUsername();
			//String fromAddress = "fruitmuskmelon@gmail.com";
			String fromAddress = "noreplymercuriusinc@gmail.com";
			String senderName = "MercuriusInc";
			String subject = "Reset passwork link";
			
//			String content = "Dear [[name]],<br>"
//					+ "Please click the link below if you are trying to change the password:<br>"
//					+ "<h3><a href=\"[[URL]]\" target=\"_self\">VERIFY</a></h3>"
//					+ "Thank you,<br>"
//					+ "Mercurius, Inc.";
			
			String content =
					
					"<!DOCTYPE html>"
							+"<html lang='en'>"
							+"<head>"
							+"<center>"
							    +"<title>StraightLines.io</title>"
							  +"<meta charset='utf-8'>"
							  +"<meta name='viewport' content='width=device-width, initial-scale=1'>"
							  +"<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'>"
							  +"<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'></script>"
							+"<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css'>"
							+"<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC' crossorigin='anonymous'>"
							+"<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js' integrity='sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM' crossorigin='anonymous'></script>"
							+"<script src='https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js' integrity='sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p' crossorigin='anonymous'></script>"
							+"<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js' integrity='sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF' crossorigin='anonymous'></script>"
							  +"<style>"
					      +".btn-primary, .btn-primary:hover{"
					       +"color: #fff;"
					        +"background-color: #ff6700;"
					        +"border-color: #ff6700"
					      +"}"
					      +"@media (min-width:400px){"
					        +".img-fluid-mercurius{"
					            +"width:25%;"
					        +"}"
					        +".img-fluid-straightlines{"
					            +"width:40%;"
					        +"}"
					        +".btn-primary, .btn-primary:hover , .btn-primary:active, .btn-primary:visited {"
					        +"color: #fff;"
					        +"width:150px;"
					        +"background-color: #ff6700;"
					        +"border-color: #ff6700;"
					        +"border:none;"

					      +"}"
					      +".img-fluid-registration{"
					         +"width:200px;" 
					         +"height:200px;"
					        +"}"
					      +"}"
					      +"@media (max-width:399px){"
					        +".img-fluid-mercurius{"
					            +"width:70%;"
					        +"}"
					        +".img-fluid-straightlines{"
					            +"width:100%;"
					        +"}"
					        +".img-fluid-registration{"
					         +"width:90%;"  
					        +"}"
					        +".btn-primary,  .btn-primary:active, .btn-primary:visited {"
					        +"color: #fff;"
					        +"background-color: #ff6700;"
					        +"border:none;"
					        +"width:125px;"
					        +"border-color: #ff6700"
					      +"}"
					      +"}"
					      
					  +"</style>"
					+"</head>"
					+"<body style='background-color: lightgray;'>"

					      +"<div class='container text-center' style='padding-top:25px;padding-bottom:25px;'>"
					        +"<div class='row'>"
					            
					          +"<div class='col-sm-12'>"
					           +"<img alt='' src='http://dev.straightlines.io/assets/img/mercurius-logo-hires-with-name.png' class='img-fluid img-fluid-mercurius' >"
					          +"</div>"
					        +"</div>"
					      +"</div>"
					      +"<div class='container text-center' >"
					        +"<div class='row'>"
					            +"<div class='col-lg-1'></div>"
					          +"<div class='col-lg-10'>"
					            +"<div class='card text-center' >"
					                +"<div class='card-body text-center'>"
					                    +"<div class='row text-center'>"
					                        +"<div class='col-lg-12'>"
					                    +"<img  alt='' src='http://dev.straightlines.io/assets/img/StraightLines-tagline.png'  class='img-fluid img-fluid-straightlines' >"
					                    +"</div><div class='col-lg-12'>"
					                    +"<img  alt='' src='http://dev.straightlines.io/assets/img/password-reset.png' class='img-fluid img-fluid-registration' >"
					                +"</div>"
					        
					                        +"<div class='col-lg-12 text-center'>"
					                            +"<p class='text-center'>"
					                                +"Please click on the button below to reset your password."
					                                +"</p><p class='card-text'> We're glad you're here!"
					                            +"</p>"
					                        +"</div>"
					                        
					                        +"<div class='col-lg-12 text-center' style='margin-top:25px'>"
					                            +"<!-- <button ><b>Register Account</b></button> -->"
					                            +"<a type='button' class='btn  text-center btn-primary' style='margin-left:auto; margin-right:auto; ' title='Activate Account' href=\'[[URL]]\' target=\'_self\' ><b>Reset Password</b></a>"
					                        +"</div>"
					                        
					                +"</div>"
					              +"</div>"
					          
					            +"</div>"
					            +"<div class='col-sm-1'></div>"
					        +"</div>"
					        +"<div class='row text-center'>"
					            
					            +"<div class='col-sm-12 text-center' style='margin-top:15px'>"
					              +"<p >"
					                +"© 2021 Mercurius,Inc.® All Rights Reserved.<br>"
					                +"Privacy Policy | Terms and Conditions"
					              +"</p>"
					            +"</div>"
					          +"</div>"
					        +"</div>"
					      +"</div>"
					      +"</body>"
					      +"</center>"
					      +"</html>";

			
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message);
			
			helper.setFrom(fromAddress, senderName);
			helper.setTo(toAddress);
			helper.setSubject(subject);
			
			content = content.replace("[[name]]", ud3.getUsername());
			//response = "http://localhost:2020/reset-password?token=" + response;
			//response = home+"/reset-password?token=" + response;
			
			String verifyURL = home+"/reset-password?token=" + response;
			//String verifyURL = "http://localhost:8080/verify?code=" + ud2.getVerificationCode();
			//http://localhost:8080
			
			content = content.replace("[[URL]]", verifyURL);
			
			helper.setText(content, true);
			
			mailSender.send(message);
			
			System.out.println("Email has been sent");
			System.out.println("the url"+home);
			
		}
		
		return response;
	}

}
