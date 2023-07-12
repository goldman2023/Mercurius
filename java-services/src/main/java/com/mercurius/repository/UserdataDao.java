package com.mercurius.repository;

import java.sql.Time;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mercurius.models.UserDefinedShiftDefinitions;

@Repository
public interface UserdataDao extends JpaRepository<UserDefinedShiftDefinitions, Long>
{

	@Query("select s from UserDefinedShiftDefinitions s where s.sh_created_by =:sh_created_by")
    List<Object> getshiftbyuserId(@Param("sh_created_by") Long sh_created_by);

	@Query("select s from UserDefinedShiftDefinitions s where s.sh_created_by =:sh_created_by")
    List<Object> getshiftbyIds(@Param("sh_created_by") Long sh_created_by);
	
	@Query("select s from UserDefinedShiftDefinitions s where s.sh_created_by=:sh_created_by and sh_area_id=:sh_area_id and s.sh_name=:sh_name")
	List<UserDefinedShiftDefinitions> checkIfShiftAliasExists(@Param("sh_created_by") long sh_created_by,@Param("sh_area_id") int sh_area_id, @Param("sh_name") String sh_name);
	
	@Query("select s from UserDefinedShiftDefinitions s where s.sh_created_by =:sh_created_by and s.status =:status")
	List<Object> getshiftbyuserIdandActiveStatus(@Param("sh_created_by") Long sh_created_by , @Param("status") String status);
	
	@Query("select s from UserDefinedShiftDefinitions s where  s.status =:status")
	List<UserDefinedShiftDefinitions> getshiftbyStatus(String status);
	
	@Query("select s from UserDefinedShiftDefinitions s where s.sh_starttime=:sh_starttime and s.sh_duration=:sh_duration and s.sh_created_by=:sh_created_by and sh_area_id=:sh_area_id")
	List<UserDefinedShiftDefinitions> getBasedOnStartTimeDurationAreaidCreatedby(@Param("sh_starttime") Time sh_starttime, @Param("sh_duration") Integer sh_duration,@Param("sh_created_by") long sh_created_by, @Param("sh_area_id") int sh_area_id);
	
	@Query("select s.sh_name from UserDefinedShiftDefinitions s where s.sh_created_by =:sh_created_by")
    List<Object> getshiftaliasname(@Param("sh_created_by") Long sh_created_by);
	
}
