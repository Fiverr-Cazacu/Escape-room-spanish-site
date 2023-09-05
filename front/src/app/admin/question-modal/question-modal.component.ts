import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-question-modal',
  templateUrl: './question-modal.component.html',
})
export class QuestionModalComponent {
  @Input() questionTitle: string | undefined;
  @Input() questionAnswer: string | undefined;
  @Input() questionClue: string | undefined;

  constructor(private _modal: ModalController) {
  }

  closeModal() {
    this._modal.dismiss();
  }

  deleteQuestion() {
    this._modal.dismiss('delete');
  }
}
