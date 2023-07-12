
  package com.mercurius.security.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.stereotype.Service;

import com.mercurius.models.Shiftlinescheduleparent;
import com.mercurius.repository.ShiftllinescheduleparentDao;
  
  @Service 
  public class ShiftlinescheduleparentServiceImpl implements ShiftlinescheduleparentService 
  {
  
  @Autowired 
  private ShiftllinescheduleparentDao shiftParent;
  
  @Override public Shiftlinescheduleparent addoneItem(Shiftlinescheduleparent pp) 
    { 
	  System.out.println("The shiftline schedule name saved is:"+pp.getSchedulename());
	  pp = shiftParent.save(pp); 
	  return pp; 
    }

	@Override
	public Shiftlinescheduleparent updateItem(Shiftlinescheduleparent sp, Long sId) {
		//Optional<Shiftlinescheduleparent> ss1 = shiftParent.findById(sId);
		//System.out.println(ss1);
		//sp.setSh_schedule_id(ss1.get().getSh_schedule_id());
		System.out.println("The updated shiftline schedule name saved is:"+sp.getSchedulename());
		shiftParent.save(sp);
		return sp;
	}

	@Override
	public Shiftlinescheduleparent deleteItem(Long sId) {
		Shiftlinescheduleparent entity = shiftParent.getOne(sId);
		shiftParent.delete(entity);
		return null;
	}

	@Override
	public Optional<Shiftlinescheduleparent> updateItemInternal(Shiftlinescheduleparent sp, Long sId) {
		Optional<Shiftlinescheduleparent> data = shiftParent.findById(sId);
		//System.out.println(ss1);
		//sp.setSh_schedule_id(ss1.get().getSh_schedule_id());
		//System.out.println("The updated shiftline schedule name saved is:"+sp.getSchedulename());
		shiftParent.save(data.get());
		return data;
	}
	
	
  
  }
 