import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscapeRoomComponent } from './escape-room.component';

const routes: Routes = [
  {
    path: ':room',
    component: EscapeRoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscapeRoomRoutingModule {}
