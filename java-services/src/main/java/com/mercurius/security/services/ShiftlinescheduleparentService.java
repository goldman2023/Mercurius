
  package com.mercurius.security.services;
  
 import java.util.Optional;

import com.mercurius.models.Shiftlinescheduleparent;
  
  public interface ShiftlinescheduleparentService {
  
  public Shiftlinescheduleparent addoneItem(Shiftlinescheduleparent pp);
  
  public Shiftlinescheduleparent updateItem(Shiftlinescheduleparent sp, Long sId);
  
  public Optional<Shiftlinescheduleparent> updateItemInternal(Shiftlinescheduleparent sp, Long sId);
	
  //public String deleteItem(long sId);
  
  public Shiftlinescheduleparent deleteItem(Long sId);
  
  }
 