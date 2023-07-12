package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.PayPeriodMaster;

public interface PayPeriodMasterService {
	
	public PayPeriodMaster addOneData(PayPeriodMaster payData);
	
	public PayPeriodMaster getByID(long uuid);
	
	public PayPeriodMaster updateOneData(PayPeriodMaster payData,long uuid);
	
	public List<PayPeriodMaster> updateMoreData(List<PayPeriodMaster> payData);

}
