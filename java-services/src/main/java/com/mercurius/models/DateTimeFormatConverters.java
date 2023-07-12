package com.mercurius.models;

import java.text.DateFormat;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateTimeFormatConverters
{
	
	public String Conversion(Date dateWithTime, int switchCaseNo) throws ParseException
	{
		int num = switchCaseNo;
		String conversion;
		String result = null;
		
		switch (num)
		{
			case 1:
				
				DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd,hh:mm a");
				conversion = formatter.format(dateWithTime);
				String[] seperate = conversion.split(",");
				result = seperate[1];
				break;
					
			case 2:
				
				SimpleDateFormat formatterOne = new SimpleDateFormat("yyyy-MM-dd");  
				result = formatterOne.format(dateWithTime);
				break;
				
			case 3:
				
				Format formatterTwo = new SimpleDateFormat("EEE"); 
				result = formatterTwo.format(dateWithTime); 
				break;
				
			case 4:
				
				Format formatterThree = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				String todayDate = formatterThree.format(dateWithTime);
				result = formatterThree.format(todayDate);  
				break;
				
			case 5:
				
				SimpleDateFormat formatterFive = new SimpleDateFormat("MM/dd/yyyy");  
				result = formatterFive.format(dateWithTime);
				break;
				
		}
		return result;
		
	}

}
