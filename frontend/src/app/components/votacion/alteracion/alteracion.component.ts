import { Component, OnInit } from '@angular/core';
import { SessionControllerService } from 'src/app/services/authentication/session-controller.service';

@Component({
  selector: 'app-alteracion',
  templateUrl: './alteracion.component.html',
  styleUrls: ['./alteracion.component.css']
})
export class AlteracionComponent implements OnInit {

  admin: boolean;

  constructor(private sessionController: SessionControllerService) {
    this.admin = sessionController.getAdminSession();
  }

  ngOnInit(): void {
  }

}
