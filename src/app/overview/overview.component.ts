import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatTableModule,
  MatTableDataSource,
  MatTable,
} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Machine, OverviewService } from './overview.service';
import { Subscription } from 'rxjs';
import { MachineDetailsComponent } from '../machine-details/machine-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    DatePipe,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * ViewChild for sorting the table.
   * Initialized in ngAfterViewInit.
   */
  @ViewChild(MatSort) sort: MatSort;

  /**
   * ViewChild for the MatTable to access and update it.
   */
  @ViewChild('machineList') table: MatTable<Machine>;

  public dataSource: MatTableDataSource<Machine> =
    new MatTableDataSource<Machine>();
  public displayedColumns: string[] = [
    'machineType',
    'status',
    'position',
    'installDate',
    'lastMaintenance',
  ];

  private machinesUpdatedSub: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private overviewService: OverviewService
  ) {}

  /**
   * Initializes the data source with machines when the component starts.
   * Fetches the machine list from the OverviewService and sets it into the data source.
   */
  public ngOnInit(): void {
    this.machinesUpdatedSub.add(
      this.overviewService.machinesUpdated$.subscribe(() => {
        this.dataSource.data = this.overviewService.machines;
      })
    );

    this.overviewService.initService();
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  public ngOnDestroy(): void {
    this.machinesUpdatedSub.unsubscribe();
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public formatPosition(machine: Machine): string {
    return `lat: ${machine.latitude}; long: ${machine.longitude}; Floor: ${machine.floor}`;
  }

  public openMachineDetails(machineId: string): void {
    this.dialog.open(MachineDetailsComponent, {
      width: '600px',
      data: machineId,
    });
  }
}
