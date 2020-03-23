import { Component, OnInit} from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  // admin: boolean = false;
  admin: boolean = true;
  options: number[] = (this.admin ? [0,1,2,3,4] : [0,6,1,6,4]);
  dni: string = "12345678X"
  pages= {0:'home', 1:'listadoVotaciones', 2: 'nuevaVotacion', 3: 'users'};
  page: number = 0;

  constructor(private router: Router) {
    router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        var pagina = router.url;
        if (pagina == "/home") {
          this.page = 0;
        } else if (pagina == "/nuevaVotacion") {
          this.page = 2;
        } else if (pagina.startsWith("/user") && pagina.includes("profile=true") ||
                   pagina.startsWith("/modifyUser") && pagina.includes("profile=true")
        ) {
          this.page = 4;
        } else if (pagina.startsWith("/user") || 
                   pagina.startsWith("/modifyUser") || 
                   pagina.startsWith("/users") || 
                   pagina == "/nuevoUser") {
          this.page = 3;
        } else {
          this.page = 1;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  alterna() {
    this.admin = !this.admin;
    this.options = (this.admin ? [0,1,2,3,4] : [0,6,1,6,4]);
    this.page = 0;
  }
}
