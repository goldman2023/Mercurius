package com.mercurius.security.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mercurius.models.BidRoundChild;
import com.mercurius.repository.BidRoundChildDao;

@Service
public class BidRoundChildServiceImpl implements BidRoundChildService {
	
	@Autowired 
	private BidRoundChildDao round;
	
	@Override
	public BidRoundChild addoneItem(BidRoundChild data) {
		data = round.save(data);
		return data;
	}

	@Override
	public BidRoundChild getbyId(long id) {
		Optional<BidRoundChild> s1 = round.findById(id);
		BidRoundChild s2 = s1.get();
		return s2;
	}

	@Override
	public BidRoundChild updateItem(BidRoundChild data, long id) {
		data = round.save(data);
		/*Long a = null;
		a = data.getBidschref();
		System.out.println(a);
		long b = data.getBidroundid(); // long b = id;
		System.out.println(b);
		if(a!=null)
		{
			System.out.println("ccc");
		}
		else
		{
			System.out.println("ddd");
			BidRoundChild entity = round.getOne(b);
			round.delete(entity);
		}*/
		return data;
	}

	@Override
	public BidRoundChild deleteItem(long id) {
		BidRoundChild entity = round.getOne(id);
		round.delete(entity);
		return null;
	}

	@Override
	public List<BidRoundChild> addmoreItem(List<BidRoundChild> data) {
		data = round.saveAll(data);
		return data;
	}

	@Override
	public List<BidRoundChild> updatemoreItem(List<BidRoundChild> data) {
		data = round.saveAll(data);
		System.out.println("happened");
		ArrayList<BidRoundChild> s1 = new ArrayList<BidRoundChild>();
		ArrayList<BidRoundChild> s2 = new ArrayList<BidRoundChild>(data);
		s1.addAll(s2);
		for(int counter = 0; counter < s1.size(); counter++) 
		{
			System.out.println("entered");
			BidRoundChild b1 = s1.get(counter);
			Long a = null;
			a = b1.getBidschref();
			System.out.println(a);
			long b = b1.getBidroundid(); // long b = id;
			b1.getBidroundid();
			System.out.println(b);
			if(a!=null)
			{
				System.out.println("ccc");
			}
			else
			{
				System.out.println("ddd");
				BidRoundChild entity = round.getOne(b);
				round.delete(entity);
			}

		}
				return null;
	}

}
