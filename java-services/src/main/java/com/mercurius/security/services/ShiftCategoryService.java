package com.mercurius.security.services;

import java.text.ParseException;
import java.util.List;
import java.util.Optional;

import com.mercurius.models.ShiftCategoryMaster;
import com.mercurius.models.Shiftlinechild;

public interface ShiftCategoryService {
	
	public Optional<ShiftCategoryMaster> getbyId(long sId);
	
	public List<ShiftCategoryMaster> getAll() throws ParseException;

	public ShiftCategoryMaster updateByShiftcategory(ShiftCategoryMaster edata, Long eid) throws ParseException;

	public ShiftCategoryMaster addoneItem(ShiftCategoryMaster edata) throws ParseException;

}
