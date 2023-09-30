import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndedComponent } from './ended/ended.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminPageModule)
  },
  {
    path: 'play',
    loadChildren: () => import('./user/user.module').then(m => m.UserPageModule)
  },
  {
    path: 'escape-room',
    loadChildren: () => import('./escape-room/escape-room.module').then(m => m.EscapeRoomModule)
  },
  {
    path: 'session',
    loadChildren: () => import('./session/session.module').then(m => m.SessionModule)
  },
  {
    path: 'ended',
    component: EndedComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
