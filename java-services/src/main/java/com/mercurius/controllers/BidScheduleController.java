package com.mercurius.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.BidScheduleMapEmployeeDetails;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.payload.response.MessageResponse;
import com.mercurius.repository.BidScheduleMapEmployeeDetailsDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.security.services.BidScheduleParamParentService;

@RestController
public class BidScheduleController {
	
	/*** Table - Bid_Schedule  <--->  class - BidScheduleParamParent ***/
	
	  
	  @Autowired 
	  private BidScheduleParamParentService bidparamService;
	  
	  @Autowired
	  private BidScheduleParamParentDao bidparamDao;
	  
	  @Autowired
	  private BidScheduleMapEmployeeDetailsDao empMapDao;
	  
	  @GetMapping("/bidparamget/{pId}")
		public BidScheduleParamParent getbyId(@PathVariable long pId)
		{
			return this.bidparamService.getbyId(pId);
		}
	  
	  @PostMapping("/bidparampost") 
	  public BidScheduleParamParent savedata(@RequestBody BidScheduleParamParent parent)
	  { 
		  BidScheduleParamParent s1 = bidparamService.addoneItem(parent);
		  return s1; 
	  }
	  
	  @GetMapping("/bidparambasedonloggeduserid/{userid}")
	  public List<Object> DisplayBasedonMangerId(@PathVariable Long userid)
		{
			List<Object> result = bidparamDao.getBasedOnUserId(userid);
			return result;
		}
	  
	  @GetMapping("/bidschedulesbyuseridandschedulestatus/{userid}/{status}")
	  public List<Object> getBidSchedulesByUserIdAndStatus(@PathVariable Long userid, @PathVariable String status)
		{
			return bidparamDao.getBidSchedulesByUserIdAndScheduleStatus(userid, status);
		}
	  
	  @RequestMapping(method = RequestMethod.PUT, value = "/bidparamput/{pId}")
		public BidScheduleParamParent updateItem(@RequestBody BidScheduleParamParent pd, @PathVariable("pId") Long pId) 
	  {
			return this.bidparamService.updateItem(pd,pId);
	  }
	  
	  @RequestMapping(method = RequestMethod.PUT, value = "/bidparamputmore")
		public List<BidScheduleParamParent> updateItem(@RequestBody List<BidScheduleParamParent> bdata) 
		{
			return this.bidparamService.updateItemMore(bdata);
		}
		
		@RequestMapping(method = RequestMethod.DELETE, value = "/bidparamdelete/{pId}",produces = MediaType.APPLICATION_JSON_VALUE)
		public ResponseEntity<?> deleteItem(@PathVariable("pId") Long pId) 
	  {
			Long id = pId;
			bidparamService.deleteItem(pId);
			Optional<BidScheduleParamParent> param =bidparamDao.findById(id);
			if(param.isEmpty())
			{
				return ResponseEntity.ok(new MessageResponse("successfully deleted"));
			}
			else
			{
				return ResponseEntity.ok(new MessageResponse("failed"));
			}
			
    }
		
	@RequestMapping(method = RequestMethod.GET, value = "/bidschedulenamecheck",produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?>  checkBidScheduleName( @RequestParam String bidschedulename, @RequestParam Long managerid)//
		{
			 String sname = bidschedulename;
			 Boolean m = bidparamDao.getData(managerid).contains(sname);
			 if(!m.booleanValue())
			 {
				  
					return ResponseEntity.ok(new MessageResponse("unique bidschedule name"));
			 }
			 else
			 {
					return ResponseEntity.ok(new MessageResponse("duplicate bidschedule name"));
			 } 
		}
		
	
	@GetMapping("/bidschedulidandmanageridcombo")
	public List<Object> getbidschidandmanageridcombo(@RequestParam Long bidschid, @RequestParam Long bidmanagerid)
	{
		return bidparamDao.getbyBidschidandManagerid(bidschid, bidmanagerid);
		
	}
	
	@RequestMapping(method = RequestMethod.PUT, value = "/baiscwatchschedulestatuschange/{pId}")
	public void updateBasicWatchScheduleStatus(@PathVariable("pId") Long pId) 
	{
		bidparamDao.updateBasicWatchScheduleStatus("Posted",pId);
		return;
	}
	
	@GetMapping("/getscheduledbidschedulesbasedonloggeduserid/{userid}")
	public List<Object> getScheduledBidSchedules(@PathVariable Long userid)
	{
			List<Object> result = bidparamDao.getScheduledBidSchedulesBasedOnUserId("Bidding Scheduled","Bidding Completed","Shift Only Posted","Shift and Vacation Posted",userid);
			return result;
	}
	
	@GetMapping("/getassignedbidschedulesbasedonloggeduserid/{userid}")
	public List<Object> getAssignedBidschedules(@PathVariable Long userid)
	{
			List<Object> result = bidparamDao.getAssignedBidSchedulesBasedOnUserId("Shifts Assigned","Shift Assigned and Posted",userid);
			return result;
	}
	
	@GetMapping("/getbidscheduledetailsbasedonempid/{empid}")
	public List<BidScheduleParamParent> getBidScheduleNamesForEmployee(@PathVariable Long empid)
	{
			List<BidScheduleMapEmployeeDetails> empData = empMapDao.getBidSchedulesBasedOnEmpId(empid);
			List<BidScheduleParamParent> result = new ArrayList<BidScheduleParamParent>();
			BidScheduleParamParent parentData = new BidScheduleParamParent();
			for(int i=0;i<empData.size();i++)
			{
				parentData = bidparamDao.getBidScheduleDeatils(empData.get(i).getBidschref());
				result.add(parentData);
			}
			return result;
	}

}
