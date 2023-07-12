package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.sql.Time;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.mercurius.models.AddBidManager;
import com.mercurius.models.AddEmployee;
import com.mercurius.models.DateTimeFormatConverters;
import com.mercurius.models.EmployeeBasicWatchSchedule;
import com.mercurius.models.FindUrlBasedOnRegion;
import com.mercurius.models.Hostname;
import com.mercurius.models.LeaveRequest;
import com.mercurius.repository.AddBidManagerDao;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.EmployeeBasicWatchScheduleDao;
import com.mercurius.repository.LeaveRequestDao;

@Service
public class NotificationToUpdateLeaveRequestServiceImpl implements NotificationToUpdateLeaveRequestService{

	
	@Autowired
	HostnameService hostname;
	
	@Autowired
	private LeaveRequestDao leaveRequestDao;
	
	@Autowired
	private AddEmployeeDao employee;
	
	@Autowired
	private AddBidManagerDao managerDao;
	

	@Autowired
	private EmployeeBasicWatchScheduleDao bwsShiftDao;
	
	@Autowired
	private JavaMailSender mailSender;
	
	@Override
	public LeaveRequest sendEmailToUpdateLeaveRequest(Long requestId)
			throws UnsupportedEncodingException, MessagingException, ParseException {
		List<Hostname> h = hostname.getAllInfo();
		String ip = h.get(0).getIp();
		FindUrlBasedOnRegion findbyregion = new FindUrlBasedOnRegion();
		String region = findbyregion.findRegion(ip);
		String verifyURL = null;
		
		if(region.equals("dev")) {
			 verifyURL = "https://dev.straightlines.io/login"; //DEV
			}
			else if (region.equals("test")) {
			 verifyURL = "https://test.straightlines.io/login";//TEST
			}
			else if (region.equals("prod")) {
			 verifyURL = "http://straightlines.io/login";//PROD
			}
			else if (region.equals("stage")) {
			 verifyURL = "https://staging.straightlines.io/login";//STAGING
			}

		String shiftChangeFrom = "N/a";
		String shiftChangeTo = "N/a";
		String leaveStartDate = "N/a";
		String leaveEndDate = "N/a";
		Optional<LeaveRequest> requestData = leaveRequestDao.findById(requestId);
		LeaveRequest rData = requestData.get();
		long empId = rData.getEmpId();		
		Optional<AddEmployee> empData = employee.getDetailForEmpId(empId);
		AddEmployee eData = empData.get();
		String empFname = eData.getFname();
		String empLname = eData.getLname();
		String toAddress = eData.getEmail();
		String empInitials = eData.getInitials();
		String requestType = rData.getRequestType();
		DateTimeFormatConverters dateconvert = new DateTimeFormatConverters();
		Date UpdatedDate = rData.getRequestUpdatedDate();
		String reqUpdatedDate = dateconvert.Conversion(UpdatedDate, 5);
		Date shiftChangeFromDate = rData.getShiftChangeFromDate();
		if(shiftChangeFromDate!=null)
		{
		 shiftChangeFrom = dateconvert.Conversion(shiftChangeFromDate, 5);
		}
		Date shiftChangeToDate = rData.getShiftChangeToDate();
		if(shiftChangeToDate!=null)
		{
		 shiftChangeTo = dateconvert.Conversion(shiftChangeToDate, 5);
		}
		
		String TimeFrom = null;
		String TimeTo = null;
		Time shiftChangeTimeFrom = rData.getShiftTimeChangeFrom();
		Time shiftChangeTimeTo   = rData.getShiftTimeChangeTo();
		Format form = new SimpleDateFormat("hh:mm:ss a");
		if(shiftChangeTimeFrom!=null&&shiftChangeTimeTo!=null)
		{
	     TimeFrom = form.format(shiftChangeTimeFrom);
	     TimeTo = form.format(shiftChangeTimeTo);
		}
		
		String denialReason = rData.getDenialReason();
		String status = rData.getStatus();
		Date startDate = rData.getLeaveStartDate();
		if(startDate!=null)
		{
		 leaveStartDate = dateconvert.Conversion(startDate, 5);
		}
		Date endDate = rData.getLeaveEndDate();
		if(endDate!=null)
		{
		 leaveEndDate = dateconvert.Conversion(endDate, 5);
		}
		
		String leaveStartTime = null;
		String leaveEndTime = null;
		Time lstarttime = rData.getLeaveStartTime();
		Time lendtime = rData.getLeaveEndTime();
		Format convertToHour = new SimpleDateFormat("hh:mm:ss a");
		if(lstarttime!=null&&lendtime!=null)
		{
			leaveStartTime = convertToHour.format(lstarttime);
			leaveEndTime = convertToHour.format(lendtime);
		}
		
		Long bidManagerId = rData.getBidManagerId();
		
		Optional<AddBidManager> managerData = managerDao.findById(bidManagerId);
		String submittedTo = managerData.get().getFname()+" "+managerData.get().getLname();
		
		String fromAddress = "noreplymercuriusinc@gmail.com";
		String senderName = "MercuriusInc";
		String subject = requestType+" "+" Request has been updated on"+" "+reqUpdatedDate+" "+" . Status is "+status;
		
		String content = null;

		if(rData.getDenialReason()==null)
		{
		if(requestType.equals("Sick Leave")||requestType.equals("Annual Leave"))
		{
		content =
				
		"<!DOCTYPE html>\r\n"
		+ "<html lang='en' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:v='urn:schemas-microsoft-com:vml'>\r\n"
		+ "  <head>\r\n"
		+ "    <title></title>\r\n"
		+ "    <meta content='text/html; charset=utf-8' http-equiv='Content-Type' />\r\n"
		+ "    <meta content='width=device-width, initial-scale=1.0' name='viewport' />\r\n"
		+ "    <style>\r\n"
		+ "      * {\r\n"
		+ "        box-sizing: border-box;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      body {\r\n"
		+ "        margin: 0;\r\n"
		+ "        padding: 0;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      a[x-apple-data-detectors] {\r\n"
		+ "        color: inherit !important;\r\n"
		+ "        text-decoration: inherit !important;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      #MessageViewBody a {\r\n"
		+ "        color: inherit;\r\n"
		+ "        text-decoration: none;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      p {\r\n"
		+ "        line-height: inherit\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      @media (max-width:520px) {\r\n"
		+ "        .icons-inner {\r\n"
		+ "          text-align: center;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .icons-inner td {\r\n"
		+ "          margin: 0 auto;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .row-content {\r\n"
		+ "          width: 100% !important;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .column .border {\r\n"
		+ "          display: none;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        table {\r\n"
		+ "          table-layout: fixed !important;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .stack .column {\r\n"
		+ "          width: 100%;\r\n"
		+ "          display: block;\r\n"
		+ "        }\r\n"
		+ "      }\r\n"
		+ "    </style>\r\n"
		+ "  </head>\r\n"
		+ "  <body style='background-color: #f5f5f5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;text-align:center;'>\r\n"
		+ "    <table border='0' cellpadding='0' cellspacing='0' class='nl-container' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "      <tbody>\r\n"
		+ "        <tr>\r\n"
		+ "          <td>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;' width='700'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr>\r\n"
		+ "                          <td align='center' class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: center; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td style='padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;padding-top:15px'>\r\n"
		+ "                                  <div align='center' style='line-height:10px'>\r\n"
		+ "                                    <img alt='' src='http://dev.straightlines.io/assets/img/mlog-email-template.png' style='display: inline-block; height: auto; border: 0; width: 110px; max-width: 100%;text-align:center;' align='center' title='' width='110' />\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                          </td>\r\n"
		+ "                        </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-2' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody align='center'>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;' width='600'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr>\r\n"
		+ "                          <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                  <div align='center' style='line-height:10px'>\r\n"
		+ "                                    <img align='center' alt='' src='http://dev.straightlines.io/assets/img/sl1.png' style='display: inline-block; height: auto; border: 0; width: 250px; max-width: 100%;text-align:center;' title='' width='300' />\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                            <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr align='center'>\r\n"
		+ "                                <td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                  <div align='center' style='text-align: left;'>"
		+ "                                    <span style='color:#000000; padding: 20px;'>Hello "+empFname+" "+empLname+" ("+empInitials+"),"
		//+ "                                      <br>\r\n"
		+ "                                      <div align='left' style='text-align: left;'>"
		+ "                                        <span style='color:#000000; padding: 10px 20px; margin:0px; display: block;'>Your "+requestType+" request has been updated on <b> "+reqUpdatedDate+"</b>. The Request is in <b>"+status+"</b> status.</span>"
		+ "                                      </div>"
		+ "                                      <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                        <td align='center' style='padding-bottom:15px;padding-top:7px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                          <div align='left' style='text-align: left; text-indent: 18px;'>\r\n"
		+ "                                            <span style='color:#000000'>Here are the Request Details:</span>\r\n"
		+ "                                          </div>\r\n"
		+ "                                        </td>\r\n"
		+ "                                      </table>\r\n"
		+ "                                      <table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                                        <tr>\r\n"
		+ "                                          <td>\r\n"
		+ "                                            <table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                                              <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='text-align:center;width:100%;'></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                              </table>\r\n"
		+ "                                              <table align='left' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Request Type: </span> <span style='width: 133px; display: block'>"+requestType+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Leave Start Date: </span> <span style='width: 133px; display: block'> "+leaveStartDate+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Leave End Date: </span> <span style='width: 133px; display: block'>"+leaveEndDate+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Status:  </span> <span style='width: 133px; display: block'>"+status+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Submitted To: </span> <span style='width: 200px; display: block'>"+submittedTo+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                              </table>\r\n"
		+ "                                          </td>\r\n"
		+ "                                        </tr>\r\n"
		+ "                                      </table>\r\n"
		+ "                                    </span>\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-3' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;' width='500'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr align='center'>\r\n"
		+ "                          <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' align='center' cellpadding='15' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td>\r\n"
		+ "                                  <div style='font-family: Tahoma, Verdana, sans-serif;text-align: center;text-align:center'>\r\n"
		+ "                                    <div class='txtTinyMce-wrapper' style='font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #393d47; line-height: 1.2;text-align:center'>\r\n"
		+ "                                      <p style='margin: 0; font-size: 14px; text-align: center;'>\r\n"
		+ "                                        <span style='font-size:10px;'>© 2021 Mercurius, Inc.® All Rights Reserved.</span>\r\n"
		+ "                                        <br />\r\n"
		+ "                                        <span style='font-size:10px;'>Privacy Policy | Terms and Conditions</span>\r\n"
		+ "                                      </p>\r\n"
		+ "                                      </p>\r\n"
		+ "                                      </span>\r\n"
		+ "                                      </p>\r\n"
		+ "                                    </div>\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                          </td>\r\n"
		+ "                        </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "          </td>\r\n"
		+ "        </tr>\r\n"
		+ "      </tbody>\r\n"
		+ "    </table>\r\n"
		+ "  </body>\r\n"
		+ "</html>";
		}
		
			
		else if(requestType.equals("Shift Change"))
		{
		content =
				
		"<!DOCTYPE html>\r\n"
		+ "<html lang='en' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:v='urn:schemas-microsoft-com:vml'>\r\n"
		+ "  <head>\r\n"
		+ "    <title></title>\r\n"
		+ "    <meta content='text/html; charset=utf-8' http-equiv='Content-Type' />\r\n"
		+ "    <meta content='width=device-width, initial-scale=1.0' name='viewport' />\r\n"
		+ "    <style>\r\n"
		+ "      * {\r\n"
		+ "        box-sizing: border-box;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      body {\r\n"
		+ "        margin: 0;\r\n"
		+ "        padding: 0;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      a[x-apple-data-detectors] {\r\n"
		+ "        color: inherit !important;\r\n"
		+ "        text-decoration: inherit !important;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      #MessageViewBody a {\r\n"
		+ "        color: inherit;\r\n"
		+ "        text-decoration: none;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      p {\r\n"
		+ "        line-height: inherit\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      @media (max-width:520px) {\r\n"
		+ "        .icons-inner {\r\n"
		+ "          text-align: center;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .icons-inner td {\r\n"
		+ "          margin: 0 auto;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .row-content {\r\n"
		+ "          width: 100% !important;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .column .border {\r\n"
		+ "          display: none;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        table {\r\n"
		+ "          table-layout: fixed !important;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .stack .column {\r\n"
		+ "          width: 100%;\r\n"
		+ "          display: block;\r\n"
		+ "        }\r\n"
		+ "      }\r\n"
		+ "    </style>\r\n"
		+ "  </head>\r\n"
		+ "  <body style='background-color: #f5f5f5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;text-align:center;'>\r\n"
		+ "    <table border='0' cellpadding='0' cellspacing='0' class='nl-container' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "      <tbody>\r\n"
		+ "        <tr>\r\n"
		+ "          <td>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;' width='700'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr>\r\n"
		+ "                          <td align='center' class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: center; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td style='padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;padding-top:15px'>\r\n"
		+ "                                  <div align='center' style='line-height:10px'>\r\n"
		+ "                                    <img alt='' src='http://dev.straightlines.io/assets/img/mlog-email-template.png' style='display: inline-block; height: auto; border: 0; width: 110px; max-width: 100%;text-align:center;' align='center' title='' width='110' />\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                          </td>\r\n"
		+ "                        </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-2' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody align='center'>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;' width='600'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr>\r\n"
		+ "                          <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                  <div align='center' style='line-height:10px'>\r\n"
		+ "                                    <img align='center' alt='' src='http://dev.straightlines.io/assets/img/sl1.png' style='display: inline-block; height: auto; border: 0; width: 250px; max-width: 100%;text-align:center;' title='' width='300' />\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                            <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr align='center'>\r\n"
		+ "                                <td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                  <div align='center' style='text-align: left;'>"
		+ "                                    <span style='color:#000000; padding: 20px;'>Hello "+empFname+" "+empLname+" ("+empInitials+"),"
		//+ "                                      <br>\r\n"
		+ "                                      <div align='left' style='text-align: left;'>"
		+ "                                        <span style='color:#000000; padding: 10px 20px; margin:0px; display: block;'>Your "+requestType+" request has been updated on <b>"+reqUpdatedDate+"</b>. The Request is in <b>"+status+"</b> status.</span>"
		+ "                                      </div>"
		+ "                                      <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                        <td align='center' style='padding-bottom:15px;padding-top:7px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                          <div align='left' style='text-align: left; text-indent: 18px;'>\r\n"
		+ "                                            <span style='color:#000000'>Here are the Request Details:</span>\r\n"
		+ "                                          </div>\r\n"
		+ "                                        </td>\r\n"
		+ "                                      </table>\r\n"
		+ "                                      <table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                                        <tr>\r\n"
		+ "                                          <td>\r\n"
		+ "                                            <table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                                              <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='text-align:center;width:100%;'></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                              </table>\r\n"
		+ "                                              <table align='left' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Request Type: </span> <span style='width: 133px; display: block'>"+requestType+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Shift Change From: </span> <span style='width: 133px; display: block'> "+shiftChangeFrom+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Shift Change To: </span> <span style='width: 133px; display: block'>"+shiftChangeTo+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Shift Time From: </span> <span style='width: 133px; display: block'>"+TimeFrom+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Shift Time To: </span> <span style='width: 133px; display: block'>"+TimeTo+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Status:  </span> <span style='width: 133px; display: block'>"+status+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Submitted To: </span> <span style='width: 200px; display: block'>"+submittedTo+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                              </table>\r\n"
		+ "                                          </td>\r\n"
		+ "                                        </tr>\r\n"
		+ "                                      </table>\r\n"
		+ "                                    </span>\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-3' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;' width='500'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr align='center'>\r\n"
		+ "                          <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' align='center' cellpadding='15' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td>\r\n"
		+ "                                  <div style='font-family: Tahoma, Verdana, sans-serif;text-align: center;text-align:center'>\r\n"
		+ "                                    <div class='txtTinyMce-wrapper' style='font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #393d47; line-height: 1.2;text-align:center'>\r\n"
		+ "                                      <p style='margin: 0; font-size: 14px; text-align: center;'>\r\n"
		+ "                                        <span style='font-size:10px;'>© 2021 Mercurius, Inc.® All Rights Reserved.</span>\r\n"
		+ "                                        <br />\r\n"
		+ "                                        <span style='font-size:10px;'>Privacy Policy | Terms and Conditions</span>\r\n"
		+ "                                      </p>\r\n"
		+ "                                      </p>\r\n"
		+ "                                      </span>\r\n"
		+ "                                      </p>\r\n"
		+ "                                    </div>\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                          </td>\r\n"
		+ "                        </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "          </td>\r\n"
		+ "        </tr>\r\n"
		+ "      </tbody>\r\n"
		+ "    </table>\r\n"
		+ "  </body>\r\n"
		+ "</html>";
		}
		
		}
		
		
		/**/
		
		
		if(rData.getDenialReason()!=null)
		{
		if(requestType.equals("Sick Leave")||requestType.equals("Annual Leave"))
		{
			if(requestType.equals("Sick Leave")||requestType.equals("Annual Leave"))
			{
			if(rData.getStatus().equals("Approve")||rData.getStatus().equals("Approved"))
			{
				System.out.println("status approved");
				
				List<EmployeeBasicWatchSchedule> bwsData = bwsShiftDao.getShiftDetailsForTheBidScheduleIdEmpIdDatePassed( requestData.get().getBidschIdRef(),requestData.get().getEmpId(), leaveStartDate,leaveEndDate);
				if(!bwsData.isEmpty())
				{
					for(int i=0;i<bwsData.size();i++)
					{
					System.out.println(bwsData.get(i).getEmpinitials());
					//should delete records
					} 
					
				}
			  }
			}
		
		content =
				
		"<!DOCTYPE html>\r\n"
		+ "<html lang='en' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:v='urn:schemas-microsoft-com:vml'>\r\n"
		+ "  <head>\r\n"
		+ "    <title></title>\r\n"
		+ "    <meta content='text/html; charset=utf-8' http-equiv='Content-Type' />\r\n"
		+ "    <meta content='width=device-width, initial-scale=1.0' name='viewport' />\r\n"
		+ "    <style>\r\n"
		+ "      * {\r\n"
		+ "        box-sizing: border-box;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      body {\r\n"
		+ "        margin: 0;\r\n"
		+ "        padding: 0;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      a[x-apple-data-detectors] {\r\n"
		+ "        color: inherit !important;\r\n"
		+ "        text-decoration: inherit !important;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      #MessageViewBody a {\r\n"
		+ "        color: inherit;\r\n"
		+ "        text-decoration: none;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      p {\r\n"
		+ "        line-height: inherit\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      @media (max-width:520px) {\r\n"
		+ "        .icons-inner {\r\n"
		+ "          text-align: center;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .icons-inner td {\r\n"
		+ "          margin: 0 auto;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .row-content {\r\n"
		+ "          width: 100% !important;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .column .border {\r\n"
		+ "          display: none;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        table {\r\n"
		+ "          table-layout: fixed !important;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .stack .column {\r\n"
		+ "          width: 100%;\r\n"
		+ "          display: block;\r\n"
		+ "        }\r\n"
		+ "      }\r\n"
		+ "    </style>\r\n"
		+ "  </head>\r\n"
		+ "  <body style='background-color: #f5f5f5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;text-align:center;'>\r\n"
		+ "    <table border='0' cellpadding='0' cellspacing='0' class='nl-container' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "      <tbody>\r\n"
		+ "        <tr>\r\n"
		+ "          <td>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;' width='700'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr>\r\n"
		+ "                          <td align='center' class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: center; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td style='padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;padding-top:15px'>\r\n"
		+ "                                  <div align='center' style='line-height:10px'>\r\n"
		+ "                                    <img alt='' src='http://dev.straightlines.io/assets/img/mlog-email-template.png' style='display: inline-block; height: auto; border: 0; width: 110px; max-width: 100%;text-align:center;' align='center' title='' width='110' />\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                          </td>\r\n"
		+ "                        </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-2' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody align='center'>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;' width='600'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr>\r\n"
		+ "                          <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                  <div align='center' style='line-height:10px'>\r\n"
		+ "                                    <img align='center' alt='' src='http://dev.straightlines.io/assets/img/sl1.png' style='display: inline-block; height: auto; border: 0; width: 250px; max-width: 100%;text-align:center;' title='' width='300' />\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                            <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr align='center'>\r\n"
		+ "                                <td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                  <div align='center' style='text-align: left;'>"
		+ "                                    <span style='color:#000000; padding: 20px;'>Hello "+empFname+" "+empLname+" ("+empInitials+"),"
		//+ "                                      <br>\r\n"
		+ "                                      <div align='left' style='text-align: left;'>"
		+ "                                        <span style='color:#000000; padding: 10px 20px; margin:0px; display: block;'>Your "+requestType+" request has been updated on <b>"+reqUpdatedDate+"</b>. The Request is in <b>"+status+"</b> status.</span>"
		+ "                                      </div>"
		+ "                                      <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                        <td align='center' style='padding-bottom:15px;padding-top:7px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                          <div align='left' style='text-align: left; text-indent: 18px;'>\r\n"
		+ "                                            <span style='color:#000000'>Here are the Request Details:</span>\r\n"
		+ "                                          </div>\r\n"
		+ "                                        </td>\r\n"
		+ "                                      </table>\r\n"
		+ "                                      <table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                                        <tr>\r\n"
		+ "                                          <td>\r\n"
		+ "                                            <table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                                              <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='text-align:center;width:100%;'></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                              </table>\r\n"
		+ "                                              <table align='left' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Request Type: </span> <span style='width: 133px; display: block'>"+requestType+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Leave Start Date: </span> <span style='width: 133px; display: block'> "+leaveStartDate+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Leave End Date: </span> <span style='width: 133px; display: block'>"+leaveEndDate+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "													<tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Denial Reason: </span> <span style='width: 133px; display: block'> "+denialReason+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Status: </span> <span style='width: 133px; display: block'>"+status+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Submitted To: </span> <span style='width: 200px; display: block'>"+submittedTo+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                              </table>\r\n"
		+ "                                          </td>\r\n"
		+ "                                        </tr>\r\n"
		+ "                                      </table>\r\n"
		+ "                                    </span>\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-3' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;' width='500'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr align='center'>\r\n"
		+ "                          <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' align='center' cellpadding='15' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td>\r\n"
		+ "                                  <div style='font-family: Tahoma, Verdana, sans-serif;text-align: center;text-align:center'>\r\n"
		+ "                                    <div class='txtTinyMce-wrapper' style='font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #393d47; line-height: 1.2;text-align:center'>\r\n"
		+ "                                      <p style='margin: 0; font-size: 14px; text-align: center;'>\r\n"
		+ "                                        <span style='font-size:10px;'>© 2021 Mercurius, Inc.® All Rights Reserved.</span>\r\n"
		+ "                                        <br />\r\n"
		+ "                                        <span style='font-size:10px;'>Privacy Policy | Terms and Conditions</span>\r\n"
		+ "                                      </p>\r\n"
		+ "                                      </p>\r\n"
		+ "                                      </span>\r\n"
		+ "                                      </p>\r\n"
		+ "                                    </div>\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                          </td>\r\n"
		+ "                        </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "          </td>\r\n"
		+ "        </tr>\r\n"
		+ "      </tbody>\r\n"
		+ "    </table>\r\n"
		+ "  </body>\r\n"
		+ "</html>";
		}
		
			
		if(requestType.equals("Shift Change"))
		{
		content =
				
		"<!DOCTYPE html>\r\n"
		+ "<html lang='en' xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:v='urn:schemas-microsoft-com:vml'>\r\n"
		+ "  <head>\r\n"
		+ "    <title></title>\r\n"
		+ "    <meta content='text/html; charset=utf-8' http-equiv='Content-Type' />\r\n"
		+ "    <meta content='width=device-width, initial-scale=1.0' name='viewport' />\r\n"
		+ "    <style>\r\n"
		+ "      * {\r\n"
		+ "        box-sizing: border-box;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      body {\r\n"
		+ "        margin: 0;\r\n"
		+ "        padding: 0;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      a[x-apple-data-detectors] {\r\n"
		+ "        color: inherit !important;\r\n"
		+ "        text-decoration: inherit !important;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      #MessageViewBody a {\r\n"
		+ "        color: inherit;\r\n"
		+ "        text-decoration: none;\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      p {\r\n"
		+ "        line-height: inherit\r\n"
		+ "      }\r\n"
		+ "\r\n"
		+ "      @media (max-width:520px) {\r\n"
		+ "        .icons-inner {\r\n"
		+ "          text-align: center;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .icons-inner td {\r\n"
		+ "          margin: 0 auto;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .row-content {\r\n"
		+ "          width: 100% !important;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .column .border {\r\n"
		+ "          display: none;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        table {\r\n"
		+ "          table-layout: fixed !important;\r\n"
		+ "        }\r\n"
		+ "\r\n"
		+ "        .stack .column {\r\n"
		+ "          width: 100%;\r\n"
		+ "          display: block;\r\n"
		+ "        }\r\n"
		+ "      }\r\n"
		+ "    </style>\r\n"
		+ "  </head>\r\n"
		+ "  <body style='background-color: #f5f5f5; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;text-align:center;'>\r\n"
		+ "    <table border='0' cellpadding='0' cellspacing='0' class='nl-container' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "      <tbody>\r\n"
		+ "        <tr>\r\n"
		+ "          <td>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-1' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;' width='700'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr>\r\n"
		+ "                          <td align='center' class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: center; vertical-align: top; padding-top: 0px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td style='padding-bottom:10px;width:100%;padding-right:0px;padding-left:0px;padding-top:15px'>\r\n"
		+ "                                  <div align='center' style='line-height:10px'>\r\n"
		+ "                                    <img alt='' src='http://dev.straightlines.io/assets/img/mlog-email-template.png' style='display: inline-block; height: auto; border: 0; width: 110px; max-width: 100%;text-align:center;' align='center' title='' width='110' />\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                          </td>\r\n"
		+ "                        </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-2' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody align='center'>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;' width='600'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr>\r\n"
		+ "                          <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 15px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' align='center' cellpadding='0' cellspacing='0' class='image_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td align='center' style='padding-bottom:5px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                  <div align='center' style='line-height:10px'>\r\n"
		+ "                                    <img align='center' alt='' src='http://dev.straightlines.io/assets/img/sl1.png' style='display: inline-block; height: auto; border: 0; width: 250px; max-width: 100%;text-align:center;' title='' width='300' />\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                            <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                              <tr align='center'>\r\n"
		+ "                                <td align='center' style='padding-bottom:15px;padding-top:15px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                  <div align='center' style='text-align: left;'>"
		+ "                                    <span style='color:#000000; padding: 20px;'>Hello "+empFname+" "+empLname+" ("+empInitials+"),"
		//+ "                                      \r\n"
		+ "                                      <div align='left' style='text-align: left;'>"
		+ "                                        <span style='color:#000000; padding: 10px 20px; margin:0px; display: block;'>Your "+requestType+" request has been updated on <b>"+reqUpdatedDate+"</b>. The Request is in <b>"+status+"</b> status.</span>"
		+ "                                      </div>"
		+ "                                      <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                        <td align='center' style='padding-bottom:15px;padding-top:7px;padding-left:5px;padding-right:5px;width:100%;'>\r\n"
		+ "                                          <div align='left' style='text-align: left; text-indent: 18px;'>\r\n"
		+ "                                            <span style='color:#000000'>Here are the Request Details:</span>\r\n"
		+ "                                          </div>\r\n"
		+ "                                        </td>\r\n"
		+ "                                      </table>\r\n"
		+ "                                      <table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                                        <tr>\r\n"
		+ "                                          <td>\r\n"
		+ "                                            <table align='center' border='0' cellpadding='1' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                                              <table align='center' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='text-align:center;width:100%;'></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                              </table>\r\n"
		+ "                                              <table align='left' border='0' cellpadding='0' cellspacing='0' class='heading_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt;' width='100%'>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Request Type: </span> <span style='width: 133px; display: block'>"+requestType+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Shift Change From:</span> <span style='width: 133px; display: block'> "+shiftChangeFrom+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Shift Change To:</span> <span style='width: 133px; display: block'>"+shiftChangeTo+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Shift Time From: </span> <span style='width: 133px; display: block'>"+TimeFrom+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Shift Time To: </span> <span style='width: 133px; display: block'>"+TimeTo+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "													<tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Denial Reason: </span> <span style='width: 133px; display: block'> "+denialReason+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Status:  </span> <span style='width: 133px; display: block'>"+status+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                                <tr>\r\n"
		+ "                                                  <td style='width:100%;text-indent: 20px; display: flex ;'><span style='width: 133px; display: block'>Submitted To: </span> <span style='width: 200px; display: block'>"+submittedTo+"</span></td>\r\n"
		+ "                                                </tr>\r\n"
		+ "                                              </table>\r\n"
		+ "                                          </td>\r\n"
		+ "                                        </tr>\r\n"
		+ "                                      </table>\r\n"
		+ "                                    </span>\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "            <table align='center' border='0' cellpadding='0' cellspacing='0' class='row row-3' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5f5f5;' width='100%'>\r\n"
		+ "              <tbody>\r\n"
		+ "                <tr>\r\n"
		+ "                  <td>\r\n"
		+ "                    <table align='center' border='0' cellpadding='0' cellspacing='0' class='row-content stack' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;' width='500'>\r\n"
		+ "                      <tbody>\r\n"
		+ "                        <tr align='center'>\r\n"
		+ "                          <td class='column column-1' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;' width='100%'>\r\n"
		+ "                            <table border='0' align='center' cellpadding='15' cellspacing='0' class='text_block' role='presentation' style='mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;' width='100%'>\r\n"
		+ "                              <tr>\r\n"
		+ "                                <td>\r\n"
		+ "                                  <div style='font-family: Tahoma, Verdana, sans-serif;text-align: center;text-align:center'>\r\n"
		+ "                                    <div class='txtTinyMce-wrapper' style='font-size: 12px; font-family: Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #393d47; line-height: 1.2;text-align:center'>\r\n"
		+ "                                      <p style='margin: 0; font-size: 14px; text-align: center;'>\r\n"
		+ "                                        <span style='font-size:10px;'>© 2021 Mercurius, Inc.® All Rights Reserved.</span>\r\n"
		+ "                                        <br />\r\n"
		+ "                                        <span style='font-size:10px;'>Privacy Policy | Terms and Conditions</span>\r\n"
		+ "                                      </p>\r\n"
		+ "                                      </p>\r\n"
		+ "                                      </span>\r\n"
		+ "                                      </p>\r\n"
		+ "                                    </div>\r\n"
		+ "                                  </div>\r\n"
		+ "                                </td>\r\n"
		+ "                              </tr>\r\n"
		+ "                            </table>\r\n"
		+ "                          </td>\r\n"
		+ "                        </tr>\r\n"
		+ "                      </tbody>\r\n"
		+ "                    </table>\r\n"
		+ "                  </td>\r\n"
		+ "                </tr>\r\n"
		+ "              </tbody>\r\n"
		+ "            </table>\r\n"
		+ "          </td>\r\n"
		+ "        </tr>\r\n"
		+ "      </tbody>\r\n"
		+ "    </table>\r\n"
		+ "  </body>\r\n"
		+ "</html>";
		}
		
		}
		
		
		String email = toAddress;
		MimeMessage message1 = mailSender.createMimeMessage();
		MimeMessageHelper helper1 = new MimeMessageHelper(message1);
		
		helper1.setFrom(fromAddress, senderName);
		helper1.setTo(toAddress);
		helper1.setSubject(subject);
		
		content = content.replace("[[name]]", email);
		
		content = content.replace("[[URL]]", verifyURL);
		
		helper1.setText(content, true);
		
		mailSender.send(message1);
		
		System.out.println("Email has been sent");

		return null;	
			
	}
		
}
