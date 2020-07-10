import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgoraRoutes } from './agora.routing';
import { AgoraComponent } from './agora.component';

@NgModule({
  declarations: [AgoraComponent],
  imports: [
    CommonModule,
    AgoraRoutes,
  ]
})
export class AgoraModule { }
