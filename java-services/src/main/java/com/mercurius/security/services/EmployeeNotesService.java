package com.mercurius.security.services;

import java.util.List;

import com.mercurius.models.EmployeeNotes;

public interface EmployeeNotesService {
	
    public List<EmployeeNotes> getEmployeeNotesByEmpidandManageId(Long empid, Long manageid);

    public boolean updateEmployeeById(Long id, EmployeeNotes updateEmployee);
    
	public EmployeeNotes deleteByNotesId(Long noteid);

}
