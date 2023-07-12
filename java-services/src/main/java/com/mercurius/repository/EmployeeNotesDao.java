package com.mercurius.repository;

import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Repository;
import com.mercurius.models.EmployeeNotes;

@Repository
public interface EmployeeNotesDao extends JpaRepository<EmployeeNotes,Long> {
	
    @Query("select s from EmployeeNotes s where s.submittedfor =:empid and s.submittedby=:manageid")
	List<EmployeeNotes> getEmployeeNotesByEmpIdAndManageId(Long empid,Long manageid);
    
    @Query("select s from EmployeeNotes s where s.submittedfor =:empid and s.submittedForDate=:submittedForDate")
	List<EmployeeNotes> getEmployeeNotesByEmpIdAndSubmittedForDate(@Param("empid") Long empid, @Param("submittedForDate") @DateTimeFormat(pattern="yyyy-MM-dd") Date submittedForDate);
    
    @Query("select s from EmployeeNotes s where s.submittedfor =:empid")
	List<EmployeeNotes> getEmployeeNotesByEmpId(Long empid);
}
