package com.mercurius.security.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.AddEmployee;
import com.mercurius.models.EmployeeBasicWatchSchedule;
import com.mercurius.models.EmployeeBasicWatchScheduleImposter;
import com.mercurius.models.EmployeeVacationSchedule;
import com.mercurius.models.WorkSheetChildForShift;
import com.mercurius.models.WorkSheetChildForVacation;
import com.mercurius.models.WorkSheetParent;
import com.mercurius.repository.EmployeeBasicWatchScheduleDao;
import com.mercurius.repository.EmployeeVacationScheduleDao;

@Service
public class WorkSheetParentServiceImpl implements WorkSheetParentService{
	
	@Autowired
	private EmployeeBasicWatchScheduleDao bwsShift;
	
	@Autowired
	private EmployeeVacationScheduleDao bwsVacation;
	
	@Autowired
	private AddNewEmployeeService findEmployeeName;

	@Override
	public WorkSheetParent getEmployeeShiftAndVacation(Long bidscheduleid, Long empid) {
		
		WorkSheetParent worksheetData = new WorkSheetParent();
		
		List<EmployeeBasicWatchSchedule> bwsShiftData = bwsShift.getShiftDetailsForTheEmpIdPassed(bidscheduleid, empid);
		List<EmployeeVacationSchedule> bwsVacationData = bwsVacation.getVacationDetailsForTheEmpIdPassed(bidscheduleid, empid);
		
		List<WorkSheetChildForShift> shiftI = new ArrayList<WorkSheetChildForShift>();
		WorkSheetChildForShift shiftData = new WorkSheetChildForShift();
		ArrayList<WorkSheetChildForVacation> vacationI = new ArrayList<WorkSheetChildForVacation>();
		WorkSheetChildForVacation vacationData = new WorkSheetChildForVacation();
		
		AddEmployee employeeData = findEmployeeName.getbyId(empid);
		
		worksheetData.setBidscheduleid(bwsShiftData.get(0).getBidscheduleid());
		worksheetData.setEmpid(bwsShiftData.get(0).getEmpid());
		worksheetData.setEmpFirstName(employeeData.getFname());
		worksheetData.setEmpLastName(employeeData.getLname());
		worksheetData.setEmpinitials(bwsShiftData.get(0).getEmpinitials());
		worksheetData.setManagerid(bwsShiftData.get(0).getManagerid());
		worksheetData.setAreaid(bwsShiftData.get(0).getAreaid());
		worksheetData.setYear(bwsShiftData.get(0).getYear());
	
		System.out.println("shiftsize:"+bwsShiftData.size());
		for(int i=0;i<bwsShiftData.size();i++)
		{
			shiftData = new WorkSheetChildForShift();
			shiftData.setDate(bwsShiftData.get(i).getDate());
			shiftData.setTime(bwsShiftData.get(i).getTime());
			shiftData.setDuration(bwsShiftData.get(i).getDuration());
			shiftData.setRdoDayOff(bwsShiftData.get(i).getRdoDayOff());
			shiftI.add(shiftData);	
		}
		
		System.out.println("vacationsize:"+bwsVacationData.size());
		
		for(int j=0;j<bwsVacationData.size();j++)
		{
			vacationData=new WorkSheetChildForVacation();
			vacationData.setVacationStartDate(bwsVacationData.get(j).getVacationStartDate());
			vacationData.setVacationEndDate(bwsVacationData.get(j).getVacationEndDate());
			vacationData.setVacationHours(bwsVacationData.get(j).getVacationHours());
			vacationI.add(vacationData);
		}
		
		worksheetData.setShiftInfo(shiftI);
		worksheetData.setVacationInfo(vacationI);
		
		return worksheetData;
	}

}
