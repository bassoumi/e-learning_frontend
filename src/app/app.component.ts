import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  title = 'e-learning';
  showLayout = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        const url = e.urlAfterRedirects;
        this.showLayout = !['/login', '/login/register'].includes(url);
      });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
