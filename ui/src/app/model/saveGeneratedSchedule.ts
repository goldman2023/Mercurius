
export class SaveGeneratedSchedule {
  seq_id
  mon
  tue
  wed
  thu
  fri
  sat
  sun
  schedulename: any
  shiftname
  areaid
  userid
  pattern
  shiftdurationp
  sh_schedule_id
  schild:[{
    sh_line_id,
    shidref,
    sun,
    mon,
    tue,
    wed,
    thu,
    fri,
    sat,
    pattern,
    shiftdurationc,
    seq_id,
    shiftname
  }]
}
