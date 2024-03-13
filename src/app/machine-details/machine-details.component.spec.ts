import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MachineDetailsComponent } from './machine-details.component';
import { OverviewService } from '../overview/overview.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('MachineDetailsComponent', () => {
  let component: MachineDetailsComponent;
  let fixture: ComponentFixture<MachineDetailsComponent>;
  let overviewService: OverviewService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: OverviewService, useClass: MockOverviewService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MachineDetailsComponent);
    component = fixture.componentInstance;
    overviewService = TestBed.inject(OverviewService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a machine', async () => {
    await fixture.whenStable();
    expect(component.machine).toEqual(mockMachineDetails);
    expect(overviewService.getMachineDetails).toHaveBeenCalled();
  });
});

class MockOverviewService {
  getMachineDetails = jasmine
    .createSpy('getMachineDetails')
    .and.returnValue(Promise.resolve(mockMachineDetails));
}

const mockMachineId = 'test-machine-id';
const mockMachineDetails = {
  id: mockMachineId,
  floor: 1,
  installDate: new Date(),
  lastMaintenance: new Date(),
  latitude: 0,
  longitude: 0,
  machineType: 'Type A',
  status: 'Active',
  events: [],
};
