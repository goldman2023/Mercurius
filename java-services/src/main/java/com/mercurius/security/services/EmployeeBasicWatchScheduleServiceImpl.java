package com.mercurius.security.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.AddEmployee;
import com.mercurius.models.EmployeeBasicWatchSchedule;
import com.mercurius.models.EmployeeBasicWatchScheduleImposter;
import com.mercurius.repository.EmployeeBasicWatchScheduleDao;

@Service
public class EmployeeBasicWatchScheduleServiceImpl implements EmployeeBasicWatchScheduleService{
	
	@Autowired
	private EmployeeBasicWatchScheduleDao basicshiftDao;
	
	@Autowired
	private AddNewEmployeeService findEmployeeName;

	@Override
	public EmployeeBasicWatchSchedule addoneItem(EmployeeBasicWatchSchedule shiftBid) {
		basicshiftDao.save(shiftBid);
		return shiftBid;
	}

	@Override
	public List<EmployeeBasicWatchScheduleImposter> getBasicWatchShiftBasedOnDateAndBidScheduleId(Long bidscheduleid,
			String shiftdate) {
		List<Object> data = basicshiftDao.getBasicWatchScheduleByScheduleIdAndDate(bidscheduleid, shiftdate);
		List<EmployeeBasicWatchScheduleImposter> imposterData = new ArrayList<EmployeeBasicWatchScheduleImposter>();
		imposterData.clear();
		for(int i=0;i<data.size();i++)
		{
			EmployeeBasicWatchSchedule edata = (EmployeeBasicWatchSchedule) data.get(i);
			EmployeeBasicWatchScheduleImposter pdata = new EmployeeBasicWatchScheduleImposter();
			
			pdata.setId(edata.getId());
			pdata.setBidscheduleid(edata.getBidscheduleid());
			pdata.setManagerid(edata.getManagerid());
			pdata.setAreaid(edata.getAreaid());
			pdata.setYear(edata.getYear());
			pdata.setDate(edata.getDate());
			pdata.setTime(edata.getTime());
			pdata.setDuration(edata.getDuration());
			pdata.setRdoDayOff(edata.getRdoDayOff());
			
			pdata.setEmpid(edata.getEmpid());
			pdata.setEmpinitials(edata.getEmpinitials());
			AddEmployee employeeData = findEmployeeName.getbyId(edata.getEmpid());
			pdata.setEmpFirstName(employeeData.getFname());
			pdata.setEmpLastName(employeeData.getLname());
			
			imposterData.add(pdata);
		}
	
		return imposterData;
	}

	@Override
	public List<EmployeeBasicWatchScheduleImposter> getBasicWatchShiftBasedOnDateRangeAndBidScheduleId(Long bidscheduleid,
			String from, String to) {
		
		List<Object> data = basicshiftDao.getBasicWatchScheduleByScheduleIdAndDateRange(bidscheduleid, from, to);
		List<EmployeeBasicWatchScheduleImposter> imposterData = new ArrayList<EmployeeBasicWatchScheduleImposter>();
		imposterData.clear();
		for(int i=0;i<data.size();i++)
		{
			EmployeeBasicWatchSchedule edata = (EmployeeBasicWatchSchedule) data.get(i);
			EmployeeBasicWatchScheduleImposter pdata = new EmployeeBasicWatchScheduleImposter();
			
			pdata.setId(edata.getId());
			pdata.setBidscheduleid(edata.getBidscheduleid());
			pdata.setManagerid(edata.getManagerid());
			pdata.setAreaid(edata.getAreaid());
			pdata.setYear(edata.getYear());
			pdata.setDate(edata.getDate());
			pdata.setTime(edata.getTime());
			pdata.setDuration(edata.getDuration());
			pdata.setRdoDayOff(edata.getRdoDayOff());
			
			pdata.setEmpid(edata.getEmpid());
			pdata.setEmpinitials(edata.getEmpinitials());
			AddEmployee employeeData = findEmployeeName.getbyId(edata.getEmpid());
			pdata.setEmpFirstName(employeeData.getFname());
			pdata.setEmpLastName(employeeData.getLname());
			
			imposterData.add(pdata);
			//System.out.println(pdata);
		}
		return imposterData;
	}
	
	@Override
	public List<EmployeeBasicWatchScheduleImposter> getBasicWatchShiftBasedOnDateRangeAndBidScheduleIdAndEmpid(Long bidscheduleid, Long empid,
			String from, String to) {
		
		List<Object> data = basicshiftDao.getBasicWatchScheduleByScheduleIdAndDateRangeAndEmpId(bidscheduleid, empid,from, to);
		List<EmployeeBasicWatchScheduleImposter> imposterData = new ArrayList<EmployeeBasicWatchScheduleImposter>();
		imposterData.clear();
		for(int i=0;i<data.size();i++)
		{
			EmployeeBasicWatchSchedule edata = (EmployeeBasicWatchSchedule) data.get(i);
			EmployeeBasicWatchScheduleImposter pdata = new EmployeeBasicWatchScheduleImposter();
			
			pdata.setId(edata.getId());
			pdata.setBidscheduleid(edata.getBidscheduleid());
			pdata.setManagerid(edata.getManagerid());
			pdata.setAreaid(edata.getAreaid());
			pdata.setYear(edata.getYear());
			pdata.setDate(edata.getDate());
			pdata.setTime(edata.getTime());
			pdata.setDuration(edata.getDuration());
			pdata.setRdoDayOff(edata.getRdoDayOff());
			
			pdata.setEmpid(edata.getEmpid());
			pdata.setEmpinitials(edata.getEmpinitials());
			AddEmployee employeeData = findEmployeeName.getbyId(edata.getEmpid());
			pdata.setEmpFirstName(employeeData.getFname());
			pdata.setEmpLastName(employeeData.getLname());
			
			imposterData.add(pdata);
			//System.out.println(pdata);
		}
		return imposterData;
	}
}
