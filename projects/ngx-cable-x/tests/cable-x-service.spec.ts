import { getMockServer } from './cable-x.spec.mocks';
import { WebSocket as MockWebSocket } from 'mock-socket';
import { TestBed } from '@angular/core/testing';
import { CableXWsService } from '../src/services/cable-x-ws.service';
import { CableXModule } from '../src/public-api';
import * as ActionCable from 'actioncable';
let mockServer;
describe('CableXService', () => {
  let service: CableXWsService;
  beforeAll(() => {
    mockServer = getMockServer();
    mockServer.start();
    TestBed.configureTestingModule({
      imports: [
        CableXModule.forRoot({
          enable: true,
          host: 'ws://ws.example.com',
          cablePath: '',
        }),
      ],
      providers: [{ provide: 'CableXConfig', useValue: {} }],
    });
    service = TestBed.inject(CableXWsService);
    ActionCable.WebSocket = MockWebSocket;
  });
  afterAll(() => {
    service.stop();
    mockServer.stop();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be able to connect', (done: DoneFn) => {
    service.setCable().subscribe((r) => {
      service.cableEvent.subscribe((response) => {
        expect(response).toBeTruthy();
        done();
      });
    });
  });
  it('should be able to get path from url correctly', () => {
    const path = service.getPathFromUrl(
      'https://ws.example.com/api/v1/resource'
    );
    expect(path).toEqual('/api/v1/resource');
  });
  it('should be able to get path from root url correctly', () => {
    const path = service.getPathFromUrl('https://ws.example.com');
    expect(path).toEqual('/');
  });
});
