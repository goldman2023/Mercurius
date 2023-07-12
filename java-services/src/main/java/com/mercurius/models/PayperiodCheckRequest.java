package com.mercurius.models;

import java.util.Date;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

// import com.fasterxml.jackson.annotation.JsonFormat;

public class PayperiodCheckRequest {
    // @DateTimeFormat(pattern = "yyyy-MM-dd")
    private String date;

    private Long bidscheduleid;

    private Long empid;

    private int time;

    private List<String> shift_line;

    private Long shift_length;

    public PayperiodCheckRequest() {
        super();
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Long getBidscheduleid() {
        return bidscheduleid;
    }

    public void setBidscheduleid(Long bidscheduleid) {
        this.bidscheduleid = bidscheduleid;
    }
    public Long getEmpid() {
        return empid;
    }
    
    public void setEmpid(Long empid) {
        this.empid = empid;
    }

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }

    public Long getShift_length() {
        return shift_length;
    }

    public void setShift_length(Long shift_length) {
        this.shift_length = shift_length;
    }

    public List<String> getShift_line() {
        return shift_line;
    }
}
