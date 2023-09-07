import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QuestionNotEditableModalComponent } from '../question-not-editable-modal/question-not-editable-modal.component';
import { Store } from '@ngxs/store';
import { DeleteRoom } from 'src/app/state-management/actions';

@Component({
  selector: 'app-escape-room-modal',
  templateUrl: './escape-room-modal.component.html',
})
export class EscapeRoomModalComponent {
  @Input() title: string | undefined;
  @Input() questions: any;
  @Input() peopleAnswered: string | undefined;

  @Input() currentQuestionID!: string;

  constructor(private _modal: ModalController, private _store: Store) {
  }

  closeModal() {
    this._modal.dismiss();
  }

  deleteRoom() {
    this._store.dispatch(new DeleteRoom(this.currentQuestionID)).subscribe({
      next: () => window.location.reload()
    });
  }

  async openQuestionModal(question: any) {
    const modal = await this._modal.create({
      component: QuestionNotEditableModalComponent,
      componentProps: {
        questionTitle: question.statement,
        questionAnswer: question.answer,
        questionClue: question.clue,
      },
      presentingElement: document.querySelector('ion-modal')!,
    });
    return await modal.present();
  }
}
