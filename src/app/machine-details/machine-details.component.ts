import { Component, Inject, OnInit } from '@angular/core';
import { Machine, OverviewService } from '../overview/overview.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-machine-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './machine-details.component.html',
  styleUrl: './machine-details.component.scss',
})
export class MachineDetailsComponent implements OnInit {
  public machine?: Machine;

  constructor(
    private overviewService: OverviewService,
    @Inject(MAT_DIALOG_DATA) public machineId: string
  ) {}

  ngOnInit() {
    this.overviewService
      .getMachineDetails(this.machineId)
      .then((machine: Machine) => {
        this.machine = machine;
      });
  }
}
