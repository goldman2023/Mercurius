package com.mercurius.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.mercurius.models.ShiftCategoryChild;
import com.mercurius.models.ShiftCategoryMaster;

@Repository
public interface ShiftCategoryMasterDao extends JpaRepository<ShiftCategoryMaster,Long>{
	
	@Query("select new com.mercurius.models.ShiftCategoryChild(s.shcategory_id, s.shcategory_name) from ShiftCategoryMaster s")
    List<ShiftCategoryChild> getShiftCategoryNames();

}
