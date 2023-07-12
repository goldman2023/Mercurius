export interface BidParamPost {
    bidschename: string,                //--> bidschedule name 
    bidmanagerid: number,			    //--> manager Id
    bidschstartdate: string,            //--> bidschedule start date
    bidschenddate: string,              //--> bidschedule end date
    schedulesavestatus: number,		    //--> for now keep them 0 
    leavesavestatus: number,		    //--> for now keep them 0 
    roundsavestatus: number,		    //--> for now keep them 0 
    totalbidleaves: number,		        //--> for now keep them 0 
    totalbidrounds: number,		        //--> for now keep them 0 
    timezone: string,		            //--> give a time zone( required for email purpose)
    weekendstatus: number,			    //--> for now keep them 0 
    summaryemail: string|null,		    //--> for now keep them null 
    intervalstarttime: string|null,	    //--> for now keep them null 
    intervalduration: string|null,		//--> for now keep them null 
    hasinterval: boolean,		        //--> for now keep them 0 
    bwsStatus: string|null,			    //--> for now keep them null 
    status: string|null,
    bidroundoption: string | number,    //--> for now keep them 0 
    shiftdefmap: ShiftDefMap[]
    employeemap: EmployeeMap[]
    leavemap: any[]
    roundmap:any[]
}

interface EmployeeMap {                      //  --> pass the employee id's who are assigned a shift line
    empidref: number                         //--> primary Id of the employee
    employeebidstatus:string|null
}
interface ShiftDefMap {
    shiftdefref: number
    shiftdefstartdate: string
    shiftdefenddate: string
}

export interface BiddingPostMore {
    bidstatus: string                       //--> as you save them keep as "Completed"
    windowstatus: string                    //--> provide "Completed" for Email purpose
    empwindowduration: string|null
    empwindowstartdateandtime: string
    bidschidref: number		                //--> primary id of Bid Schedule Id, which you get from above POST method
    bidschename: string                     //-> Bid Schedule Name, which was provided in the above POST method
    empidref: number			            //--> primary id of employee
    initials: string		                //--> employee initials
    roundseq_id: number	                    //--> keep as 1
    shiftidref: number		                //--> pass the shiftline schedule primary id( the primary id of Zob_area6_mar7_Trimester1 id "67")
    schedulename: string                    //--> shiftline schedule name
    shiftseq_id: number                     //--> start with 1 to no of shifts (eg 35 shifts, then 1,2,3...35)
    shiftname: string		                //--> shift assigned 
    pattern: string		                    //--> pattern of the shift
    shiftlineidref: number	                //--> the shift id of SS-1 (primary id of the shift)
}