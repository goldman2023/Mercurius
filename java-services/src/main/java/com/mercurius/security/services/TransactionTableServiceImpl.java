package com.mercurius.security.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.AddBidManager;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.SystemDefinedShiftDefinitions;
import com.mercurius.models.TransactionTable;
import com.mercurius.repository.TransactionTableDao;

@Service
public class TransactionTableServiceImpl implements TransactionTableService {
	
	@Autowired
	private TransactionTableDao ttd;
	
	
	@Override
	public TransactionTable addoneItem(TransactionTable td) {
		ttd.save(td);
		return td;
	}

	@Override
	public List<TransactionTable> addmoreItem(List<TransactionTable> uList) {
		ttd.saveAll(uList);
		// TODO Auto-generated method stub
		return uList;
	}

	@Override
	public TransactionTable updateItem(TransactionTable td, long tId) {
		// TODO Auto-generated method stub
		ttd.save(td);
		return td;
	}
}
