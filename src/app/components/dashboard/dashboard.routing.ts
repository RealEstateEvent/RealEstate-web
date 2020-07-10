import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,   
  }
];

export const DashboardRoutes = RouterModule.forChild(dashboardRoutes);

