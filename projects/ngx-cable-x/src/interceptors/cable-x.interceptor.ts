import { Injectable, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { DataConfigService, CableXConfig } from '../config';
import { CableXWsService } from '../services/cable-x-ws.service';

@Injectable({
  providedIn: 'root',
})
export class CableXInterceptor implements HttpInterceptor {
  constructor(
    @Inject(DataConfigService) private cableXConfig: CableXConfig,
    private cableXWsService: CableXWsService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    if (this.cableXConfig.enable) {
      this.checkConfig();
      return this.cableXWsService.handle(request).pipe(
        timeout(this.cableXConfig.timeout * 1000),
        catchError(() => {
          throw new Error(
            `Timeout waiting for response, CableX waited for atleast ${this.cableXConfig.timeout} seconds`
          );
        })
      );
    } else {
      return next.handle(request);
    }
  }
  checkConfig() {
    if (!this.isValidUrl(this.cableXConfig.host)) {
      throw new Error('CableXConfig has invalid host URL');
    }
    if (
      this.cableXConfig.cablePath === undefined ||
      this.cableXConfig.cablePath === null
    ) {
      throw new Error('CableXConfig has null cablePath');
    }
  }
  isValidUrl(url) {
    try {
      return new URL(url);
    } catch (_) {
      return false;
    }
  }
}
