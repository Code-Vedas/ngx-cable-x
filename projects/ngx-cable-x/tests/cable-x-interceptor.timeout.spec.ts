import { catchError } from 'rxjs/operators';
import { CableXInterceptor } from '../src/interceptors/cable-x.interceptor';
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
describe('CableXInterceptorTimeOut', () => {
  let interceptor: CableXInterceptor;
  let httpClient: HttpClient;
  beforeAll(() => {
    mockServer = getMockServer();
    mockServer.start();
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        CableXModule.forRoot({
          enable: true,
          host: 'ws://ws.example.com',
          cablePath: '',
          timeout: 3,
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
    ActionCable.WebSocket = MockWebSocket;
  });
  afterAll(() => {
    mockServer.stop();
  });
  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
  it('should intercept http get request and catch timeout error', (done: DoneFn) => {
    const httpRequest = httpClient.get('http://exaple.com/timeout');
    httpRequest
      .pipe(
        catchError((error) => {
          return of({ message: error.message });
        })
      )
      .subscribe((response: any) => {
        expect(response.message).toBe(
          'Timeout waiting for response, CableX waited for atleast 3 seconds'
        );
        done();
      });
  });
});
