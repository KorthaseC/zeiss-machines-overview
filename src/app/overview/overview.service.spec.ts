import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OverviewService, MachineListResponse } from './overview.service';
import { Socket } from 'phoenix';

describe('OverviewService', () => {
  let service: OverviewService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OverviewService, { provide: Socket, useValue: {} }],
    });

    service = TestBed.inject(OverviewService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and process machine list correctly', async () => {
    const mockResponse: MachineListResponse = {
      data: [
        {
          floor: 1,
          id: 'machine1',
          install_date: new Date(),
          last_maintenance: new Date(),
          latitude: 0,
          longitude: 0,
          machine_type: 'measure',
          status: 'running',
        },
      ],
    };

    service.getMachineList().then(() => {
      expect(service.machines.length).toBe(1);
      expect(service.machines[0].id).toEqual('machine1');
    });

    const req = httpTestingController.expectOne(service['machinesBaseUrl']);
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);
  });

  it('should fetch and process machine details correctly', async () => {
    const machineId = 'machine1';
    const mockMachineDetails = {
      data: {
        floor: 1,
        id: machineId,
        install_date: new Date().toISOString(),
        last_maintenance: new Date().toISOString(),
        latitude: 0,
        longitude: 0,
        machine_type: 'micro',
        status: 'errored',
        events: [],
      },
    };

    service.getMachineDetails(machineId).then((machine) => {
      expect(machine.id).toEqual(machineId);
    });

    const req = httpTestingController.expectOne(
      `${service['machinesBaseUrl']}/${machineId}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush({ data: mockMachineDetails });
  });
});
