import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkLoadDataFnService {
  constructor() {}

  countShifts(allShiftDataInclude: any[]): any {
    let countMid = 0;
    let countSysMid = 0;
    let countEve = 0;
    let countSysEve = 0;
    let countDay = 0;
    let countSysDay = 0;

    allShiftDataInclude.forEach((shiftData) => {
      const shiftCategory = Number(shiftData.shiftCategory);
      const isCreatedBySystem = shiftData.shift_created_by === 'system';

      if (shiftCategory === 1) {
        countMid++;
        if (isCreatedBySystem) {
          countSysMid++;
        }
      } else if (shiftCategory === 2) {
        countEve++;
        if (isCreatedBySystem) {
          countSysEve++;
        }
      } else if (shiftCategory === 3) {
        countDay++;
        if (isCreatedBySystem) {
          countSysDay++;
        }
      }
    });

    return {
      countMid,
      countSysMid,
      countEve,
      countSysEve,
      countDay,
      countSysDay,
    };
  }
}
