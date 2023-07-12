package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.ShiftLineWorkForceDetails;

public interface ShiftLineWorkForceDetailsService {
	
	public ShiftLineWorkForceDetails getbyId(long workId);
	
	public ShiftLineWorkForceDetails addoneItem(ShiftLineWorkForceDetails workdata);
	
	public List<ShiftLineWorkForceDetails> addmoreItem(List<ShiftLineWorkForceDetails> worklist);

}
