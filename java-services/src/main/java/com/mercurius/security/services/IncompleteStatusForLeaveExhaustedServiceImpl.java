package com.mercurius.security.services;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;
import java.util.Optional;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.BidScheduleParamParent;
import com.mercurius.models.BidWindowDuration;
import com.mercurius.repository.BidScheduleParamParentDao;
import com.mercurius.repository.BidWindowDurationDao;

@Service
public class IncompleteStatusForLeaveExhaustedServiceImpl implements IncompleteStatusForLeaveExhaustedService {
	
	@Autowired
	private BidWindowDurationDao window;
	
	@Autowired
	private BidScheduleParamParentDao parent;

	@Override
	public List<Object> IncompleteStatusUpdate(Long BidscheduleId, Long Empid, int Roundid, String siteURL,
			String status) throws UnsupportedEncodingException, MessagingException, ParseException {
		
		BidScheduleParamParent bp = parent.getbyNoOfRoundsBasedonBidschId(BidscheduleId);
		Long tr = bp.getTotalbidrounds();
		System.out.println("Total rounds:"+tr);
		
		for(int i=Roundid;i<=tr;i++)
		{
			
		Optional<BidWindowDuration> data2 = window.findByBidschIdandEmpIdandReoundId(BidscheduleId, Empid, i);
		BidWindowDuration result = data2.get();
		Long durationid = result.getDuid();
		window.updateIncompleteStatus(status, status, durationid);
		
		}
		return null;
	}

}
