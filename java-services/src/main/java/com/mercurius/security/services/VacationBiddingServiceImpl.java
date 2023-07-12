package com.mercurius.security.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.BidWindowDuration;
import com.mercurius.models.VacationBidding;
import com.mercurius.repository.VacationBiddingDao;

@Service
public class VacationBiddingServiceImpl implements VacationBiddingService{

	
	@Autowired
	private VacationBiddingDao vacation;
	
	@Override
	public VacationBidding addoneItem(VacationBidding vadata) {
		
//		VacationBidding data = vadata;
//		String bidschname = data.getBidschename();
//		Long bidschidref = data.getBidschidref();
//		Long empidref = data.getEmpidref();
//		int roundseq_id =data.getRoundseq_id();
//		 String a3 = "Completed";
//		 String a4 = "Manager Completed";
//		 List<VacationBidding> vb1 = vacation.basedOnVacationStatus(bidschidref,empidref,roundseq_id,a3);
//		 List<VacationBidding> vb2 = vacation.basedOnVacationStatus(bidschidref,empidref,roundseq_id,a4);
//		 
//		 if(vb1.isEmpty()&&vb2.isEmpty())
//		 {
//			 System.out.println("save one record vacation only if the records return empty for:"+bidschname+","+bidschidref+","+empidref+","+roundseq_id);
//			 vacation.save(vadata);
//		 }
		vacation.save(vadata);
		return vadata;
	}

	@Override
	public VacationBidding getbyId(long vacId) {
		Optional<VacationBidding> s1 = vacation.findById(vacId);
		VacationBidding s2 = s1.get();
		return s2;
	}

	@Override
	public List<VacationBidding> addmoreItem(List<VacationBidding> vadata) {
		vacation.saveAll(vadata);
		return vadata;
	}

	

}
