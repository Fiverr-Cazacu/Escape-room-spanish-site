import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SessionComponent } from './session.component';
import { SessionRoutingModule } from './session-routing.module';
import { SessionModalComponent } from './session-modal/session-modal.component';
import { SessionTeamModal } from './session-team-modal/session-team-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [SessionComponent, SessionModalComponent, SessionTeamModal]
})
export class SessionModule { }
