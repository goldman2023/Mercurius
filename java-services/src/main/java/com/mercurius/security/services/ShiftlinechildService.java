package com.mercurius.security.services;

import com.mercurius.models.Shiftlinechild;

public interface ShiftlinechildService {
	
	public Shiftlinechild getbyId(long sId);
	
	public Shiftlinechild addoneItem(Shiftlinechild sd);
	
	public Shiftlinechild updateItem(Shiftlinechild sd, long sId);
	
	public Shiftlinechild deleteItem(long sId);

}
