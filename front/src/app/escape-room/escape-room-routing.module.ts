import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscapeRoomComponent } from './escape-room.component';

const routes: Routes = [
  {
    path: ':session',
    component: EscapeRoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscapeRoomRoutingModule {}
