import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  footer:boolean = true;

  constructor(private router: Router ) {
  }
  
  cambiaRuta() {
    var pagina = this.router.url;
    if (pagina == "/login") {
      this.footer = false;
    } else if (pagina == "/changePasswd") {
      this.footer = false;
    } else if (pagina.includes("/votar")) {
      this.footer = false;
    } else {
      this.footer = true;
    }
  }

  
}
