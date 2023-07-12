package com.mercurius.controllers;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.LeaveRequest;
import com.mercurius.models.PayPeriodMaster;
import com.mercurius.repository.PayPeriodDao;
import com.mercurius.security.services.PayPeriodMasterService;

@RestController
public class PayPeriodController {

	@Autowired
	private PayPeriodMasterService payService;
	
	@Autowired
	private PayPeriodDao payDao;
	
	@RequestMapping(method = RequestMethod.GET, path = "/payperiod/{uuid}")
	public Optional<PayPeriodMaster> getpayperiodbyuuid(@PathVariable("uuid") long uuid) 
	{
		return Optional.of(this.payService.getByID(uuid));
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/payperiodupdate/{uuid}")
	public PayPeriodMaster updatepayperiodbyuuid(@RequestBody PayPeriodMaster paydata, @PathVariable("uuid") Long uuid) throws ParseException, UnsupportedEncodingException, MessagingException 
	{
		PayPeriodMaster pData = payService.updateOneData(paydata,uuid);
		return pData;	
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/payperiodpost")
	public PayPeriodMaster postpayperiod(@RequestBody PayPeriodMaster paydata) throws ParseException, UnsupportedEncodingException, MessagingException 
	{
		PayPeriodMaster pData = payService.addOneData(paydata);
		return pData;	
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/payperiodbyyear/{year}")
	public List<PayPeriodMaster> getpayperiodbyyear(@PathVariable("year") long year) 
	{
		return payDao.getPayPeriodDetailsBasedOnYear(year);
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/payperiodupdatemore")
	public List<PayPeriodMaster> postpayperiod(@RequestBody List<PayPeriodMaster> paydata) throws ParseException, UnsupportedEncodingException, MessagingException 
	{
		return payService.updateMoreData(paydata);
	}
}
