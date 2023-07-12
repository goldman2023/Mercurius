import { ActionReducerMap } from '@ngrx/store';
import * as adminReducerData from '../dashboard/admin/store/admin.reducer';

export interface AppState {
 adminStore: adminReducerData.adminState
}

export const appReducers: ActionReducerMap<AppState> = {
  //@ts-ignore
  adminStore: adminReducerData.adminReducer
}
