package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.BidScheduleMapShiftlineSchedule;
import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.Shiftlinescheduleparent;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.ShiftllinescheduleparentDao;

@Service
public class BidScheduleParamParentServiceImpl implements BidScheduleParamParentService{

	@Autowired 
	private BidScheduleParamParentDao bidParent;
	
	@Autowired
	private ShiftllinescheduleparentDao shiftlineParent;
	
	@Autowired
	private ShiftlinescheduleparentService shiftlineService;
	
	@Override
	public BidScheduleParamParent addoneItem(BidScheduleParamParent bp) {
		bp = bidParent.save(bp);
		for(int i=0;i<bp.getShiftdefmap().size();i++)
		{
		long shiftlineScheduleIdRef = bp.getShiftdefmap().get(i).getShiftdefref();
		Optional<Shiftlinescheduleparent> shiftData = shiftlineParent.findById(shiftlineScheduleIdRef);
		shiftData.get().setStatus(true);
		shiftlineService.updateItemInternal(shiftData.get(),shiftlineScheduleIdRef);
		}
		return bp;
	}


	@Override
	public BidScheduleParamParent getbyId(long pId) {
		Optional<BidScheduleParamParent> s1 = bidParent.findById(pId);
		BidScheduleParamParent s2 = s1.get();
		return s2;
	}


	@Override
	public BidScheduleParamParent updateItem(BidScheduleParamParent bp, long pId) {
		bidParent.save(bp);
		return bp;
	}


	@Override
	public BidScheduleParamParent deleteItem(long pId) {
		BidScheduleParamParent entity = bidParent.getOne(pId);
		bidParent.delete(entity);
		return null;
	}


	@Override
	public List<BidScheduleParamParent> updateItemMore(List<BidScheduleParamParent> bp) {
		bidParent.saveAll(bp);
		return bp;
	}

}
