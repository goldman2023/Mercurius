import { ModuleWithProviders } from '@angular/core';

export declare class FlatpickrModule {
  static forRoot(userDefaults?: FlatpickrDefaultsInterface): ModuleWithProviders<any>;
}
import { InjectionToken } from '@angular/core';
import { FlatpickrDefaults, FlatpickrDefaultsInterface } from 'angularx-flatpickr/flatpickr-defaults.service';
export declare const USER_DEFAULTS: InjectionToken<{}>;
export declare function defaultsFactory(userDefaults: FlatpickrDefaultsInterface): FlatpickrDefaults;
