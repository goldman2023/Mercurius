package com.mercurius.models;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.TimeZone;

public class GetTimeBasedonTimeZone {
	
	public String getTime(String s) {
		//System.out.println("Inside s:"+s);
        String result =null;
        
        if(s.equals("US/Eastern"))//run locally
        {
        	Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(s));
 		   //SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy h:mm:ss a '-' zzzz");
 		   SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		   df.setTimeZone(cal.getTimeZone());
 		   result = df.format(cal.getTime());
        }
        else if(s.equals("US/Central"))//run locally
        {
        	Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(s));
 		   //SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy h:mm:ss a '-' zzzz");
 		   SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		   df.setTimeZone(cal.getTimeZone());
 		   result = df.format(cal.getTime());
        }
        else if(s.equals("US/Mountain"))//run locally
        {
        	Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(s));
 		   //SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy h:mm:ss a '-' zzzz");
 		   SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		   df.setTimeZone(cal.getTimeZone());
 		   result = df.format(cal.getTime());
        }
        else if(s.equals("US/Alaska"))//run locally
        {
        	Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(s));
 		   //SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy h:mm:ss a '-' zzzz");
 		   SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		   df.setTimeZone(cal.getTimeZone());
 		   result = df.format(cal.getTime());
        }
        else if(s.equals("Pacific/Honolulu"))//run locally
        {
        	Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(s));
 		   //SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy h:mm:ss a '-' zzzz");
 		   SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		   df.setTimeZone(cal.getTimeZone());
 		   result = df.format(cal.getTime());
        }
        else if(s.equals("America/Los_Angeles"))//run locally
        {
        	Calendar cal = Calendar.getInstance(TimeZone.getTimeZone(s));
 		   //SimpleDateFormat df = new SimpleDateFormat("dd.MM.yyyy h:mm:ss a '-' zzzz");
 		   SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		   df.setTimeZone(cal.getTimeZone());
 		   result = df.format(cal.getTime());
        }
        
		return result;
	}

}
