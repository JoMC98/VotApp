import { Injectable } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionControllerService {

  isConnected = true;

  constructor(private connectionService: ConnectionService) {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    })
  }

  getIsConected() {
    return this.isConnected;
  }
}
