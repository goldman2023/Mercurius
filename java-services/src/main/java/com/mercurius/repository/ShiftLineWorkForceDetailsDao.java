package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mercurius.models.ShiftLineWorkForceDetails;

@Repository
public interface ShiftLineWorkForceDetailsDao extends JpaRepository <ShiftLineWorkForceDetails,Long> {
	
	@Query("select s from ShiftLineWorkForceDetails s where s.shiftLineScheduleIdRef=:shiftLineScheduleIdRef")
	List<ShiftLineWorkForceDetails> getbyShiftLineScheduleIdRef(@Param("shiftLineScheduleIdRef") Long shiftLineScheduleIdRef);
	
	@Query("select s from ShiftLineWorkForceDetails s where s.shiftDay=:shiftDay and s.shiftLineScheduleIdRef=:shiftLineScheduleIdRef")
	List<ShiftLineWorkForceDetails> getbyShiftBasedOnDay(String shiftDay, Long shiftLineScheduleIdRef);

}
