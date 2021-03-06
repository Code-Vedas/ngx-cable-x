import { CableXInterceptor } from './../src/interceptors/cable-x.interceptor';
import { getMockServer } from './cable-x.spec.mocks';
import { WebSocket as MockWebSocket } from 'mock-socket';
import { TestBed } from '@angular/core/testing';
import { CableXModule } from '../src/public-api';
import * as ActionCable from 'actioncable';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpClientModule,
} from '@angular/common/http';
import { of } from 'rxjs';
let mockServer;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
describe('CableXInterceptor', () => {
  let interceptor: CableXInterceptor;
  let httpClient: HttpClient;
  beforeAll(() => {
    ActionCable.WebSocket = MockWebSocket;
    mockServer = getMockServer();
    mockServer.start();
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        CableXModule.forRoot({
          enable: true,
          host: 'ws://ws.example.com',
          cablePath: '',
          timeout: 8,
        }),
      ],
      providers: [
        { provide: 'CableXConfig', useValue: {} },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CableXInterceptor,
          multi: true,
        },
      ],
    });
    interceptor = TestBed.inject(CableXInterceptor);
    httpClient = TestBed.inject(HttpClient);
  });
  afterAll(() => {
    mockServer.stop();
  });
  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
  it('should intercept http get request and return response by websocket', (done: DoneFn) => {
    const httpRequest = httpClient.get('http://example.com/hi');
    httpRequest.subscribe((response: any) => {
      expect(response.message).toBe('HELLO');
      done();
    });
  });
  it('should intercept http post request and return response by websocket', (done: DoneFn) => {
    const httpRequest = httpClient.post('http://example.com/message', {
      message: 'Hi',
    });
    httpRequest.subscribe((response: any) => {
      expect(response.message).toBe('HELLO');
      expect(response.data.message).toBe('Hi');
      done();
    });
  });
});
