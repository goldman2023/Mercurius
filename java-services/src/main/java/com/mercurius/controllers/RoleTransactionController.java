package com.mercurius.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mercurius.models.AddBidManager;
import com.mercurius.models.AddEmployee;
import com.mercurius.models.AreaReferenceForEmployee;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.EmployeeRole;
import com.mercurius.models.FacilityReferenceForEmployee;
import com.mercurius.models.PermissionChild;
import com.mercurius.models.RolePermissionDetails;
import com.mercurius.models.TransactionTable;
import com.mercurius.models.TransactionTableChild;
import com.mercurius.models.UserToLogin;
import com.mercurius.models.UserWithAllDetails;
import com.mercurius.models.UserWithAllPermissions;
import com.mercurius.repository.AddBidManagerDao;
import com.mercurius.repository.AddEmployeeDao;
import com.mercurius.repository.AreaRefForEmpDao;
import com.mercurius.repository.BidScheduleMapEmployeeDetailsDao;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.EmpRoleDao;
import com.mercurius.repository.FacilityRefForEmpDao;
import com.mercurius.repository.RolePermissionDetailsDao;
import com.mercurius.repository.TransactionTableDao;
import com.mercurius.repository.UserRepository;
import com.mercurius.security.services.TransactionTableService;

@RestController
public class RoleTransactionController {
	
	/*** Table - transactiontable  <---> class - transactiontable ***/

	@Autowired
	private TransactionTableService tts;
	
	@Autowired
	private TransactionTableDao ttd;
	
	@Autowired
	private RolePermissionDetailsDao permissionDao;
	
	List<TransactionTable> tdList = new ArrayList<TransactionTable>();
	
	@RequestMapping(method = RequestMethod.POST, path = "/addroleswithmodule")
	public List<TransactionTable> addmanyItem1(@RequestBody List<TransactionTable> uList)
	{
		tdList.clear();
		TransactionTable data = new TransactionTable();
		for(int i=0;i<uList.size();i++)
		{
			
			data = uList.get(i);
			boolean status = data.isStatus();
			long roleid = data.getRole_id();
			long permissionid = data.getPermission_id();
		
			TransactionTable record = ttd.checkifroleidpermissionidcomboexists(roleid,permissionid);
			
			if(record==null)
			{
				TransactionTable tdata = tts.addoneItem(data);
				System.err.println(tdata);
				tdList.add(tdata);
			}
			else if (record!=null)
			{
				Long transactionId = record.getT_id();
				Optional<TransactionTable> tdata = ttd.findById(transactionId);
				System.out.println(tdata);
				ttd.statusupdate(status,transactionId);
				tdList.add(tdata.get());
			}
		}
		
		return tdList;
	}
	
	@RequestMapping(method = RequestMethod.GET, path = "/getactionbasedonroleid/{rId}")
	  public List<TransactionTableChild> getActions(@PathVariable Long rId)
	  { 
		  List<TransactionTableChild> tChild = new ArrayList<TransactionTableChild>();
		  
		  List<TransactionTable> tdata = ttd.getActionsBasedOnRoleId(rId);
		  for(int i=0;i<tdata.size();i++)
		  {
			  TransactionTable transtable = new TransactionTable();
			  TransactionTableChild transactionChild = new TransactionTableChild();
			  
			  transtable = tdata.get(i);
			  transactionChild.setT_id(transtable.getT_id());
			  transactionChild.setRole_id(transtable.getRole_id());
			  transactionChild.setPermission_id(transtable.getPermission_id());
			  transactionChild.setStatus(transtable.isStatus());
			  Optional<RolePermissionDetails> rpData = permissionDao.findById(transtable.getPermission_id());
			  transactionChild.setModu_name(rpData.get().getModu_name());
			  transactionChild.setAct_name(rpData.get().getAct_name());
			  tChild.add(transactionChild);
		  }
		  return tChild;
	  }	

	
	@RequestMapping(method = RequestMethod.GET, path = "/getactivepermissionsforroleid/{rId}")
	  public List<PermissionChild> getActivePermissionsForRoleIdPassed(@PathVariable Long rId)
	  { 

		List<PermissionChild> rData = new ArrayList<PermissionChild>();
		List<TransactionTable> transactionData=	ttd.getActionsBasedOnRoleIdAndStatus(rId, true);
		for(int i=0;i<transactionData.size();i++)
		{
			long permissionId = transactionData.get(i).getPermission_id();
			Optional<RolePermissionDetails> permissionData = permissionDao.findById(permissionId);
			PermissionChild childData = new PermissionChild();
			childData.setP_id(transactionData.get(i).getT_id());
			childData.setModu_name(permissionData.get().getModu_name());
			childData.setFunc_name(permissionData.get().getFunc_name());
			childData.setAct_name((permissionData.get().getAct_name()));
			rData.add(childData);
		}
		  return rData; 
	  }		
}
