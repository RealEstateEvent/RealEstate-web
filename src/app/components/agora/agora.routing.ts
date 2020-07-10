import { RouterModule, Routes } from '@angular/router';
import { AgoraComponent } from './agora.component';

const agoraRoutes: Routes = [
  {
    path: '',
    component: AgoraComponent,   
  }
];

export const AgoraRoutes = RouterModule.forChild(agoraRoutes);

