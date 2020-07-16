import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgoraRoutes } from './agora.routing';
import { AgoraComponent } from './agora.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AgoraComponent],
  imports: [
    CommonModule,
    AgoraRoutes,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AgoraModule { }
