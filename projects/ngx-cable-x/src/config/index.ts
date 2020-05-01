import { InjectionToken } from '@angular/core';
export interface NgCableXConfig {
  enable: boolean;
  cablePath: string;
  host: string;
  timeout?: number;
}
export const CABLE_X_DEFAULT_CONFIG: NgCableXConfig = {
  enable: true,
  cablePath: null,
  host: null,
  timeout: 30, // 30 Seconds Default
};
export const DataConfigService = new InjectionToken<NgCableXConfig>(
  'CableXConfig'
);
