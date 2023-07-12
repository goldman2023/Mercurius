package com.mercurius.models;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DifferenceBetweenTwoTime {
	
	public Date TimeDifference(Date time1, Date time2) throws ParseException
	{
	
	DateFormat dateFormat = new SimpleDateFormat("hh:mm:ss");  
    String t1 = dateFormat.format(time1);  
    String t2 = dateFormat.format(time2);
		
	SimpleDateFormat simpleDateFormat = new SimpleDateFormat("hh:mm:ss");

	// Parsing the Time Period
	Date date1 = simpleDateFormat.parse(t1);
	Date date2 = simpleDateFormat.parse(t2);

	// Calculating the difference in milliseconds
	long differenceInMilliSeconds = 0;
	if(date1.getTime()>date2.getTime())
	{
		differenceInMilliSeconds = Math.abs(date1.getTime() - date2.getTime());
	}
	if(date2.getTime()>date2.getTime())
	{
		differenceInMilliSeconds = Math.abs(date2.getTime() - date1.getTime());
	}

	// Calculating the difference in Hours
	long differenceInHours
	    = (differenceInMilliSeconds / (60 * 60 * 1000))
	      % 24;

	// Calculating the difference in Minutes
	long differenceInMinutes
	    = (differenceInMilliSeconds / (60 * 1000)) % 60;

	// Calculating the difference in Seconds
	long differenceInSeconds
	    = (differenceInMilliSeconds / 1000) % 60;

	// Printing the answer
	System.out.println(
	    "Difference is " + differenceInHours + " hours "
	    + differenceInMinutes + " minutes "
	    + differenceInSeconds + " Seconds. ");
	
	
	String output =  differenceInHours + " : "
		    + differenceInMinutes + " : "
		    + differenceInSeconds ;
	
	Date time3 = simpleDateFormat.parse(output);
	return time3;
	}

}
