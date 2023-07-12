package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.BidWindowDuration;
import com.mercurius.models.ShiftlineBidding;
import com.mercurius.repository.BidWindowDurationDao;
import com.mercurius.repository.ShiftlineBiddingDao;

@Service
public class ShiftlineBiddingServiceImpl implements ShiftlineBiddingService {
	
	@Autowired
	private ShiftlineBiddingDao bidding;
	

	@Override
	public ShiftlineBidding getbyId(long bId) {
		Optional<ShiftlineBidding> sb = bidding.findById(bId);
		ShiftlineBidding result = sb.get();
		return result;
	}

	@Override
	public ShiftlineBidding addoneItem(ShiftlineBidding bdata) {
		
//		Long bidschidref = bdata.getBidschidref();
//		Long empidref = bdata.getEmpidref();
//		int roundseq_id = bdata.getRoundseq_id();
//		String a1 = "Completed";
//		String a2 = "System Completed";
//		//List<BidWindowDuration> bd = duration.getEmployeeIsAllocatedorNot(bidschidref, empidref, roundseq_id, shiftlinebidstatus, vacationbidstatus);
//		List<ShiftlineBidding> sb1 = bidding.basedOnShiftStatus(bidschidref,empidref,roundseq_id,a1);
//		List<ShiftlineBidding> sb2 = bidding.basedOnShiftStatus(bidschidref,empidref,roundseq_id,a2);
//		if(sb1.isEmpty()&&sb2.isEmpty())
//		{
//			System.out.println("save one record only if the records return empty for:"+bdata.getBidschename()+","+bidschidref+","+empidref+","+roundseq_id);
//			bidding.save(bdata);
//		}
		bidding.save(bdata);
		return bdata;
	}

	@Override
	public List<ShiftlineBidding> addmoreItem(List<ShiftlineBidding> bdata) {
		
//		ShiftlineBidding data = bdata.get(0);
//		String bidschname = data.getBidschename();
//		Long bidschidref = data.getBidschidref();
//		Long empidref = data.getEmpidref();
//		int roundseq_id = data.getRoundseq_id();
//		String a1 = "Completed";
//		String a2 = "System Completed";
//		//List<BidWindowDuration> bd = duration.getEmployeeIsAllocatedorNot(bidschidref, empidref, roundseq_id, shiftlinebidstatus, vacationbidstatus);
//		List<ShiftlineBidding> sb1 = bidding.basedOnShiftStatus(bidschidref,empidref,roundseq_id,a1);
//		List<ShiftlineBidding> sb2 = bidding.basedOnShiftStatus(bidschidref,empidref,roundseq_id,a2);
//		if(sb1.isEmpty()&&sb2.isEmpty())
//		{
//			System.out.println("save more record shiftline only if the records return empty for:"+bidschname+","+bidschidref+","+empidref+","+roundseq_id);
//			bidding.saveAll(bdata);
//		}
		bidding.saveAll(bdata);
		return bdata;
	}

	@Override
	public ShiftlineBidding updateByEmployeeId(ShiftlineBidding bdata, long empId) {
		bidding.save(bdata);
		return bdata;
	}

	@Override
	public ShiftlineBidding updateById(ShiftlineBidding bdata, long bidId) {
		bidding.save(bdata);
		return bdata;
	}

	@Override
	public List<ShiftlineBidding> updateItemMore(List<ShiftlineBidding> bdata) {
		bidding.saveAll(bdata);
		return bdata;
	}

	

}
