package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.TransactionTable;

public interface TransactionTableService {
	
	public List<TransactionTable> addmoreItem(List<TransactionTable> uList);
	
	public TransactionTable addoneItem(TransactionTable td);
	
	public TransactionTable updateItem(TransactionTable td, long tId);

}
