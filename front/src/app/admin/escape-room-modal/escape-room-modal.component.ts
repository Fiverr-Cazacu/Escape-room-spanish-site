import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QuestionNotEditableModalComponent } from '../question-not-editable-modal/question-not-editable-modal.component';

@Component({
  selector: 'app-escape-room-modal',
  templateUrl: './escape-room-modal.component.html',
})
export class EscapeRoomModalComponent {
  @Input() title: string | undefined;
  @Input() questions: any;
  @Input() peopleAnswered: string | undefined;

  constructor(private _modal: ModalController) {
  }

  closeModal() {
    this._modal.dismiss();
  }

  async openQuestionModal(question: any) {
    const modal = await this._modal.create({
      component: QuestionNotEditableModalComponent,
      componentProps: {
        questionTitle: question.question,
        questionAnswer: question.answer,
        questionClue: question.clue,
        correctAnswers: question.correctAnswers,
        wrongAnswers: question.wrongAnswers
      },
      presentingElement: document.querySelector('ion-modal')!,
    });
    return await modal.present();
  }
}
