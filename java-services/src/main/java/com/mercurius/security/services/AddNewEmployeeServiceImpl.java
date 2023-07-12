package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.AddEmployee;
import com.mercurius.repository.AddEmployeeDao;

@Service
public class AddNewEmployeeServiceImpl implements AddNewEmployeeService{
	
	@Autowired
	private AddEmployeeDao addEmployeeDao;
	
	@Override
	public AddEmployee getbyId(long id) {
		Optional<AddEmployee> s1 = addEmployeeDao.findById(id);
		AddEmployee s2 = s1.get();
		return s2;
	}

	@Override
	public List<AddEmployee> getAllEmployeeInfo() {
		return addEmployeeDao.findAll();
	}
	
	@Override
	public AddEmployee addoneItem(AddEmployee emp) {
		AddEmployee data = emp;
		data.setStatus((short) 1);
		addEmployeeDao.save(data);
		return emp;
	}

	@Override
	public AddEmployee getbyEmail(String email) {
		Optional<AddEmployee> output = addEmployeeDao.findByEmail(email);
		AddEmployee ed = output.get();
		return ed;
	}

	@Override
	public List<AddEmployee> updateListOfEmployees(List<AddEmployee> edata) {
		addEmployeeDao.saveAll(edata);
		return edata;
	}

	@Override
	public AddEmployee updateByEmpid(AddEmployee edata, Long eid) {
		addEmployeeDao.save(edata);
		return edata;
	}

	@Override
	public AddEmployee updateByManagerid(AddEmployee edata, Long mid) {
		addEmployeeDao.save(edata);
		return edata;
	}

	@Override
	public AddEmployee deleteByEmpid(Long eid) {
		AddEmployee entity = addEmployeeDao.getOne(eid);
		addEmployeeDao.delete(entity);
		return null;
	}

}
