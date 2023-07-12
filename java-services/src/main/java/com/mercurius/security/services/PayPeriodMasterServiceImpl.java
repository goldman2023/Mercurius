package com.mercurius.security.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.PayPeriodMaster;
import com.mercurius.repository.PayPeriodDao;

@Service
public class PayPeriodMasterServiceImpl implements PayPeriodMasterService{
	
	@Autowired
	private PayPeriodDao payDao;
	
	@Override
	public PayPeriodMaster addOneData(PayPeriodMaster payData) {
		PayPeriodMaster pData = new PayPeriodMaster();
		pData = payDao.save(payData);
		return pData;
	}

	@Override
	public PayPeriodMaster getByID(long uuid) {
		Optional<PayPeriodMaster> pData = payDao.findById(uuid);
		return pData.get();
	}

	@Override
	public PayPeriodMaster updateOneData(PayPeriodMaster payData, long uuid) {
		return payDao.save(payData);
	}

	@Override
	public List<PayPeriodMaster> updateMoreData(List<PayPeriodMaster> payData) {
		List<PayPeriodMaster>  output = new ArrayList<PayPeriodMaster>();
		for(int i=0;i<payData.size();i++)
		{
			PayPeriodMaster pData = payData.get(i);
			//Optional<PayPeriodMaster> dataExist = payDao.getPayPeriodDetailsBasedOnAllDetails(pData.getStart_date(), pData.getEnd_date(), pData.getName(), pData.getYear());
			Optional<PayPeriodMaster> dataExist = payDao.findById(pData.getUuid());
			if(!dataExist.isEmpty())
			{
				payDao.save(pData);
				output.add(pData);
			}
		}
		return output;
	}

}
