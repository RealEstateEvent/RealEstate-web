import { RouterModule, Routes } from '@angular/router';
import { TalksComponent } from './talks.component';

const talksRoutes: Routes = [
  {
    path: '',
    component: TalksComponent,   
  }
];

export const TalksRoutes = RouterModule.forChild(talksRoutes);

