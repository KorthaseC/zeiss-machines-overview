import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewComponent } from './overview.component';
import { OverviewService } from './overview.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let overviewService: OverviewService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OverviewComponent,
        MatSortModule,
        MatTableModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: OverviewService, useClass: MockOverviewService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    overviewService = TestBed.inject(OverviewService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class MockOverviewService {
  machinesUpdated$ = of();
  initService = jasmine.createSpy();
}
