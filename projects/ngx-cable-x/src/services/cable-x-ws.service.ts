import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler } from '@angular/common/http';
import { of, AsyncSubject, fromEvent, Subject, from } from 'rxjs';
import { DataConfigService, CableXConfig } from '../config';
import { v5 as uuidv5 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { switchMap, map } from 'rxjs/operators';

const ActionCable = require('actioncable');

@Injectable({
  providedIn: 'root',
})
export class CableXWsService {
  cable: any;
  subscription: any;
  cableEvent = new AsyncSubject<any>();
  eventEmitters: { request_id: string; eventEmitter: EventEmitter<any> }[];
  constructor(@Inject(DataConfigService) private cableXConfig: CableXConfig) {
    this.eventEmitters = [];
  }

  handle(request: HttpRequest<any>) {
    const dataToSend = this.getDataToSend({ request });

    const eventEmitter = new EventEmitter();
    this.eventEmitters.push({
      eventEmitter,
      request_id: dataToSend.request_id,
    });

    return of({}).pipe(
      switchMap(() => this.setCable()),
      switchMap(() => this.cableEvent),
      switchMap(() => this.perform(dataToSend)),
      switchMap(() => eventEmitter),
      map((response: any) => {
        return new HttpResponse({
          body: JSON.parse(response.body),
          headers: response.headers,
          status: response.code,
        });
      })
    );
  }
  setCable() {
    if (this.cable && this.cable.connection.isOpen()) {
      this.cableEvent.next(this.cable);
      this.cableEvent.complete();
    } else {
      this.cable = ActionCable.createConsumer(
        `${this.cableXConfig.host}${this.cableXConfig.cablePath}`
      );
      this.subscription = this.cable.subscriptions.create(
        'CableX::Channel::CableXChannel',
        {
          // tslint:disable-next-line
          cmd: function (data: any) {
            this.perform('cmd', data);
          },
          connected: () => {
            this.cableEvent.next(this.cable);
            this.cableEvent.complete();
          },
          received: (receivedData) => {
            this.broadcastReceivedData(receivedData);
          },
        }
      );
    }
    return of({});
  }
  perform(data) {
    this.subscription.cmd(data);
    return of(data);
  }
  getPathFromUrl(url) {
    return `/${url.split('//')[1].split('/').splice(1).join('/')}`;
  }
  broadcastReceivedData(receivedData) {
    const eventEmitterObjectIndex = this.eventEmitters.findIndex(
      (obj) => obj.request_id === receivedData.request_id
    );
    /* istanbul ignore else  */
    if (eventEmitterObjectIndex >= 0) {
      const eventEmitterObject = this.eventEmitters.splice(
        eventEmitterObjectIndex
      )[0];
      eventEmitterObject.eventEmitter.emit(receivedData);
    }
  }
  getDataToSend({ request }) {
    const requestId = uuidv5(`${request.method}${request.url}`, `${uuidv4()}`);
    const path = this.getPathFromUrl(request.url);
    return {
      request_id: requestId,
      method: request.method,
      path,
      data: request.body,
      params: request.params,
    };
  }
  stop() {
    if (this.cable) {
      this.cable.disconnect();
    }
  }
}
