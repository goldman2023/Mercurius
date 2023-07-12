package com.mercurius.repository;

import java.sql.Time;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mercurius.models.SystemDefinedShiftDefinitions;
import com.mercurius.models.SystemdefinedshiftdefchildThree;


@Repository 
public interface SystemDefinedShiftDefinitionsDao extends JpaRepository<SystemDefinedShiftDefinitions,Long>{
	
	@Query("select s from SystemDefinedShiftDefinitions s where s.shift_duration =:shift_duration")
    List<SystemDefinedShiftDefinitions> getshiftbasedonShiftDuration(@Param("shift_duration") Integer shift_duration);

	@Query("select s from SystemDefinedShiftDefinitions s where s.startTime=:startTime and s.shift_duration=:shift_duration")
    List<SystemDefinedShiftDefinitions> getBasedOnStartTimeDurationAreaidCreatedby(@Param("startTime") Time startTime,@Param("shift_duration") int shift_duration);
	
	@Query("select s from SystemDefinedShiftDefinitions s where s.id =:id")
	Optional<SystemDefinedShiftDefinitions> getshiftbasedonShiftID(@Param("id") long id);
	
	@Query("select new com.mercurius.models.SystemdefinedshiftdefchildThree(s.id, s.shiftName, s.shiftCategory, s.shift_duration, s.startTime, s.sh_include_exclude,s.shift_category_name) from SystemDefinedShiftDefinitions s")
    List<SystemdefinedshiftdefchildThree> getAllSystemDefinitions();
	
	@Query("select DISTINCT s.shift_duration from SystemDefinedShiftDefinitions s")
    List<Object> getallduration();

}
