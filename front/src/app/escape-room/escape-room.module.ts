import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HttpClientModule } from '@angular/common/http';

import { EscapeRoomComponent } from './escape-room.component';
import { EscapeRoomRoutingModule } from './escape-room-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    EscapeRoomRoutingModule
  ],
  declarations: [EscapeRoomComponent]
})
export class EscapeRoomModule {
}
