import { Injectable, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DataConfigService, NgCableXConfig } from '../config';
import { cablexConfigure, cablex, CableXResponse } from 'cable-x-js';
@Injectable({
  providedIn: 'root',
})
export class CableXInterceptor implements HttpInterceptor {
  constructor(
    @Inject(DataConfigService) private cableXConfig: NgCableXConfig
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    if (this.cableXConfig.enable) {
      this.checkConfig();
      const dataToSend = this.getDataToSend({ request });
      return cablex(dataToSend.method, dataToSend.path, {
        body: dataToSend.data,
        params: dataToSend.params,
      }).pipe(
        map((response: CableXResponse) => {
          return new HttpResponse({
            body: response.body,
            headers: <any>response.headers,
            status: response.status,
          });
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
    cablexConfigure({
      cablePath: this.cableXConfig.cablePath,
      host: this.cableXConfig.host,
      timeout: this.cableXConfig.timeout,
    });
  }
  isValidUrl(url) {
    try {
      return new URL(url);
    } catch (_) {
      return false;
    }
  }
  getDataToSend({ request }) {
    const path = this.getPathFromUrl(request.url);
    return {
      method: request.method,
      path,
      data: request.body,
      params: request.params,
    };
  }
  getPathFromUrl(url) {
    return `/${url.split('//')[1].split('/').splice(1).join('/')}`;
  }
}
