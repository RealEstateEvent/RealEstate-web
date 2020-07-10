import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'dashboard/:id/talks',
    loadChildren: () => import('./components/talks/talks.module').then(m => m.TalksModule),
  },
  {
    path: '',
    children: [
      {
        path: 'webinar-speaker',
        loadChildren: () => import('./components/agora/agora.module').then(m => m.AgoraModule),
      },
      {
        path: 'join-webinar-attendee',
        loadChildren: () => import('./components/agora/agora.module').then(m => m.AgoraModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
