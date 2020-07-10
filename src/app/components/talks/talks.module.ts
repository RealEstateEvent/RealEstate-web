import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalksComponent } from './talks.component';
import { TalksRoutes } from './talks.routing';

@NgModule({
  declarations: [TalksComponent],
  imports: [
    CommonModule,
    TalksRoutes,
  ]
})
export class TalksModule { }
