package com.mercurius.models;

public class FindUrlBasedOnRegion {
	
	public String findRegion(String s) {
		//System.out.println("Inside s:"+s);
        String result =null;
        
        
        if(s.equals("http://localhost:2020")||s.equals("192.168.1.8"))//run locally
        {
        	result = "dev";
        } 
        else if(s.equals("http://3.13.254.87:2020")||s.equals("3.13.254.87")||s.equals("https://3.13.254.87:2020"))//dev
        {
        	result = "dev";
        }
        else if(s.equals("http://52.14.8.217:2020")||s.equals("52.14.8.217")||s.equals("https://52.14.8.217:2020"))//test
        {
        	result = "test";
        }
        else if(s.equals("http://18.119.62.157:2020")||s.equals("18.119.62.157")||s.equals("https://18.119.62.157:2020"))//prod
        {
        	result ="prod";
        }
        else if(s.equals("http://3.140.109.198:2020")||s.equals("3.140.109.198")||s.equals("https://3.140.109.198:2020"))//staging
        {
        	result ="stage";
        }
        
		return result;
	}

}
