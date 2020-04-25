import { NgModule, ModuleWithProviders } from '@angular/core';
import {
  CableXConfig,
  DataConfigService,
  CABLE_X_DEFAULT_CONFIG,
} from '../config';
import { CableXWsService } from '../services/cable-x-ws.service';
import { CableXInterceptor } from '../interceptors/cable-x.interceptor';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class CableXModule {
  static forRoot(config?: CableXConfig): ModuleWithProviders<CableXModule> {
    return {
      ngModule: CableXModule,
      providers: [
        CableXWsService,
        CableXInterceptor,
        {
          provide: DataConfigService,
          useValue: { ...CABLE_X_DEFAULT_CONFIG, ...config },
        },
      ],
    };
  }
}
