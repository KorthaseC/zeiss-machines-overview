import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Subject, firstValueFrom } from 'rxjs';
import { Socket } from 'phoenix';
import { isPlatformBrowser } from '@angular/common';

export interface MachineListResponse {
  data: MachineApi[];
}

export interface MachineApi {
  floor: number;
  id: string;
  install_date: Date;
  last_maintenance: Date;
  latitude: number;
  longitude: number;
  machine_type: string;
  status: string;
  events?: MachineEvent[];
}

export interface Machine {
  floor: number;
  id: string;
  installDate: Date;
  lastMaintenance: Date;
  latitude: number;
  longitude: number;
  machineType: string;
  status: string;
  events?: MachineEvent[];
}

export interface MachineEvent {
  timestamp: Date;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  public machines: Machine[] = [];
  public machinesUpdated = new Subject<void>();
  public machinesUpdated$ = this.machinesUpdated.asObservable();

  private machinesBaseUrl =
    'https://codingcase.bluesky-ff1656b7.westeurope.azurecontainerapps.io/api/v1/machines';

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public initService(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupWebSocket();
      this.getMachineList();
    }
  }

  public async getMachineList(): Promise<void> {
    return firstValueFrom(
      this.http.get<MachineListResponse>(this.machinesBaseUrl)
    ).then((response) => {
      this.machines = response.data.map(this.mapToMachine);
      this.machinesUpdated.next();
    });
  }

  public async getMachineDetails(machineId: string): Promise<Machine> {
    const url = `${this.machinesBaseUrl}/${machineId}`;
    return firstValueFrom(this.http.get<{ data: MachineApi }>(url)).then(
      (response) => this.mapToMachineWithEvents(response.data)
    );
  }

  private mapToMachineWithEvents(machineData: MachineApi): Machine {
    const machine: Machine = this.mapToMachine(machineData);
    const sortedEvents = machineData.events.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const lastTenEvents: any[] = sortedEvents.slice(0, 10);

    machine.events = lastTenEvents.map((event) => ({
      timestamp: new Date(event.timestamp),
      status: event.status,
    }));
    return machine;
  }

  private mapToMachine(machineApi: MachineApi): Machine {
    return {
      floor: machineApi.floor,
      id: machineApi.id,
      installDate: new Date(machineApi.install_date),
      lastMaintenance: new Date(machineApi.last_maintenance),
      latitude: machineApi.latitude,
      longitude: machineApi.longitude,
      machineType: machineApi.machine_type,
      status: machineApi.status,
    };
  }

  private setupWebSocket(): void {
    const socket: Socket = new Socket(
      'wss://codingcase.bluesky-ff1656b7.westeurope.azurecontainerapps.io/socket/'
    );

    socket.connect();

    const channel: any = socket.channel('events', {});
    channel
      .join()
      .receive('ok', (resp) => {
        console.log('Joined successfully', resp);
      })
      .receive('error', (resp) => {
        console.log('Unable to join', resp);
      });

    channel.on('new', (msg) => this.handleNewEvent(msg));
  }

  private handleNewEvent(event: any): void {
    this.updateMachineFromEvent(event);
    this.machinesUpdated.next();
  }

  private updateMachineFromEvent(event: any): void {
    const eventMachine: Partial<Machine> = this.mapEventToMachine(event);

    const index: number = this.machines.findIndex(
      (machine) => machine.id === eventMachine.id
    );
    if (index !== -1) {
      this.machines[index] = { ...this.machines[index], ...eventMachine };
      this.machines = [...this.machines];
      this.machinesUpdated.next();
    }
  }

  private mapEventToMachine(event: any): Partial<Machine> {
    return {
      id: event.machine_id,
      status: event.status,
    };
  }
}
