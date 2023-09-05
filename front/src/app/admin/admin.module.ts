import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { QuestionModalComponent } from './question-modal/question-modal.component';
import { EscapeRoomModalComponent } from './escape-room-modal/escape-room-modal.component';
import { QuestionNotEditableModalComponent } from './question-not-editable-modal/question-not-editable-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AdminPage, QuestionModalComponent, EscapeRoomModalComponent, QuestionNotEditableModalComponent]
})
export class AdminPageModule {
}
