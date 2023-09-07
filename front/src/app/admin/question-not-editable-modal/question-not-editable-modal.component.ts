import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-question-not-editable-modal',
  templateUrl: './question-not-editable-modal.component.html',
})
export class QuestionNotEditableModalComponent {
  @Input() questionTitle: string | undefined;
  @Input() questionAnswer: string | undefined;
  @Input() questionClue: string | undefined;

  constructor(private _modal: ModalController) {
  }

  closeModal() {
    this._modal.dismiss();
  }
}
