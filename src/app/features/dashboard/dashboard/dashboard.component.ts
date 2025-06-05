import { Component } from '@angular/core';
import { PopularInstructor } from 'src/app/core/models/PopularInstructor.model';
import { DashboardService } from './service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  totalUsers!: number;
  totalCourses!: number;
  completionRate!: number;
  monthlyRegistrations: { [period: string]: number } = {};
  topInstructors: PopularInstructor[] = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadUserCount();
    this.loadCourseCount();
    this.loadCompletionRate();
    this.loadMonthlyRegistrations();
    this.loadTopInstructors();
  }

  private loadUserCount(): void {
    this.dashboardService.getUserCount()
      .subscribe(count => this.totalUsers = count, err => console.error(err));
      console.log(this.totalUsers);
  }

  private loadCourseCount(): void {
    this.dashboardService.getCourseCount()
      .subscribe(count => this.totalCourses = count, err => console.error(err));
  }

  private loadCompletionRate(): void {
    this.dashboardService.getCompletionRate()
      .subscribe(rate => this.completionRate = rate, err => console.error(err));
      console.log(this.completionRate);
  }

  private loadMonthlyRegistrations(): void {
    this.dashboardService.getMonthlyRegistrations()
      .subscribe(data => this.monthlyRegistrations = data, err => console.error(err));
      console.log(this.monthlyRegistrations);
  }

  private loadTopInstructors(limit: number = 3): void {
    this.dashboardService.getTopInstructors(limit)
      .subscribe(list => this.topInstructors = list, err => console.error(err));
      console.log(this.topInstructors);
  }
}
