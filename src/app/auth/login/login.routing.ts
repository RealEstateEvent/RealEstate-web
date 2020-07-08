import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';

const loginRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,   
  }
];

export const LoginRoutes = RouterModule.forChild(loginRoutes);

