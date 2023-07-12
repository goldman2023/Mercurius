package com.mercurius.models;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name="employee_notes")
public class EmployeeNotes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="notes_id")
    private Long id;
    
    @Column(name="notes_title")
    private String title;

    @Column(name="notes_description")
    private String description;

    @Column(name="submitted_for")
    private Long submittedfor;

    @Column(name="submitted_by")
    private Long submittedby;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name="submitted_date")
    private Date submitteddate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name="submitted_for_date")
    private Date submittedForDate;
    
    public EmployeeNotes() {
        super();
    }

	public EmployeeNotes(Long id, String title, String description, Long submittedfor, Long submittedby,
			Date submitteddate, Date submittedForDate) {
		super();
		this.id = id;
		this.title = title;
		this.description = description;
		this.submittedfor = submittedfor;
		this.submittedby = submittedby;
		this.submitteddate = submitteddate;
		this.submittedForDate = submittedForDate;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    public Long getSubmittedfor() {
        return submittedfor;
    }

    public void setSubmittedfor(Long submittedfor) {
        this.submittedfor = submittedfor;
    }
    public Long getSubmittedby() {
        return submittedby;
    }

    public void setSubmittedby(Long submittedby) {
        this.submittedby = submittedby;
    }

	public Date getSubmitteddate() {
		return submitteddate;
	}

	public void setSubmitteddate(Date submitteddate) {
		this.submitteddate = submitteddate;
	}

	public Date getSubmittedForDate() {
		return submittedForDate;
	}

	public void setSubmittedForDate(Date submittedForDate) {
		this.submittedForDate = submittedForDate;
	}

	@Override
	public String toString() {
		return "EmployeeNotes [id=" + id + ", title=" + title + ", description=" + description + ", submittedfor="
				+ submittedfor + ", submittedby=" + submittedby + ", submitteddate=" + submitteddate
				+ ", submittedForDate=" + submittedForDate + "]";
	}

}
