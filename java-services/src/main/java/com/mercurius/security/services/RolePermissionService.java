package com.mercurius.security.services;

import java.text.ParseException;

import com.mercurius.models.RolePermissionDetails;

public interface RolePermissionService {
	
	public RolePermissionDetails updateByPermissionId(RolePermissionDetails edata, Long eid) throws ParseException;

}
