export class CreateNewBidSchedule{

    bidschid
    bidschename
    bidmanagerid
    bidschstartdate
    bidschenddate
    schedulesavestatus
    leavesavestatus
    roundsavestatus
    totalbidleaves
    totalbidrounds
    timezone
    shiftdefmap: [
        {
          bidshiftmapid,
            bidschref,
            shiftdefref,
            shiftdefstartdate,
            shiftdefenddate,
        }
    ]
    employeemap: [
        {
          bidemployeemapid,
            bidschref,
            empidref,
        }
    ]
    leavemap: [
        {
            bidleaveid,
            bidschref,
            leavestartdate,
            leaveenddate,
            leaveslots,
            leaveseq_id
        }
    ]
    roundmap: [
        {
            bidroundid,
            bidschref,
            roundduration,
            roundstartdate,
            roundenddate,
            roundstarttime,
            roundendttime,
            bidleavereason
            roundseq_id
        }
    ]
}


