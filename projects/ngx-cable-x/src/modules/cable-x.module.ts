import { NgModule, ModuleWithProviders } from '@angular/core';
import {
  NgCableXConfig,
  DataConfigService,
  CABLE_X_DEFAULT_CONFIG,
} from '../config';
import { CableXInterceptor } from '../interceptors/cable-x.interceptor';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class CableXModule {
  static forRoot(config?: NgCableXConfig): ModuleWithProviders<CableXModule> {
    return {
      ngModule: CableXModule,
      providers: [
        CableXInterceptor,
        {
          provide: DataConfigService,
          useValue: { ...CABLE_X_DEFAULT_CONFIG, ...config },
        },
      ],
    };
  }
}
