package com.mercurius.security.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.EmployeeNotes;
import com.mercurius.repository.EmployeeNotesDao;

@Service
public class EmployeeNotesServiceImpl implements EmployeeNotesService {
    @Autowired
    private EmployeeNotesDao employeeNotesDao;

    @Override
    public List<EmployeeNotes> getEmployeeNotesByEmpidandManageId(Long empid, Long manageid) {
        List<EmployeeNotes> result = employeeNotesDao.getEmployeeNotesByEmpIdAndManageId(empid, manageid);
        return result;
    }

    public boolean updateEmployeeById(Long id, EmployeeNotes updateEmployee) {
        if (employeeNotesDao.existsById(id)) {
            updateEmployee.setId(id);
            employeeNotesDao.save(updateEmployee);
            return true;
        } else {
            return false;
        }
    }

	@Override
	public EmployeeNotes deleteByNotesId(Long noteid) {
		EmployeeNotes entity = employeeNotesDao.getOne(noteid);
		employeeNotesDao.delete(entity);
		return null;
	}
    		
}
