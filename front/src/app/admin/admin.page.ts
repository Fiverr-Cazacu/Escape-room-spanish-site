import { Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QuestionModalComponent } from './question-modal/question-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { EscapeRoomModalComponent } from './escape-room-modal/escape-room-modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
})
export class AdminPage {
  currentQuestion = this._fb.group({
    question: ['', [Validators.required]],
    answer: ['', [Validators.required]],
    clue: ['', [Validators.required]]
  });

  currentEscapeRoom: any = {
    questions: [],
    formGroup: this._fb.group({
      title: ['', Validators.required]
    })
  };

  data: any = [
    {
      title: 'Ceva',
      questions: [
        {
          question: 'Cine este Iohannis?',
          answer: 'jmecher',
          clue: 'barosan',
          correctAnswers: 10,
          wrongAnswers: 3
        },
        {
          question: 'Cine este Iohannis?',
          answer: 'jmecher',
          clue: 'barosan',
          correctAnswers: 10,
          wrongAnswers: 3
        },
        {
          question: 'Cine este Iohannis?',
          answer: 'jmecher',
          clue: 'barosan',
          correctAnswers: 10,
          wrongAnswers: 3
        },
      ],
      peopleAnswered: 3
    },
    {
      title: 'Cineva',
      questions: [
        {
          question: 'Cine este Iohannis?',
          answer: 'jmecher',
          clue: 'barosan',
          correctAnswers: 10,
          wrongAnswers: 3
        },
        {
          question: 'Cine este Iohannis?',
          answer: 'jmecher',
          clue: 'barosan',
          correctAnswers: 10,
          wrongAnswers: 3
        },
        {
          question: 'Cine este Iohannis?',
          answer: 'jmecher',
          clue: 'barosan',
          correctAnswers: 10,
          wrongAnswers: 3
        },
      ],
      peopleAnswered: 3
    },
    {
      title: 'wow',
      questions: [
        {
          question: 'Cine este Iohannis?',
          answer: 'jmecher',
          clue: 'barosan',
          correctAnswers: 10,
          wrongAnswers: 3

        },
        {
          question: 'Cine este Iohannis?',
          answer: 'jmecher',
          clue: 'barosan',
          correctAnswers: 10,
          wrongAnswers: 3
        },
        {
          question: 'Cine este Iohannis?',
          answer: 'jmecher',
          clue: 'barosan',
          correctAnswers: 10,
          wrongAnswers: 3
        },
      ],
      peopleAnswered: 3
    },

  ];
  @ViewChild('newQuestion') newQuestion: any;
  @ViewChild('createModal') createModal: any;
  erTitleToast: boolean = false;
  erQuestionToast: boolean = false;
  qQuestionToast: boolean = false;
  qAnswerToast: boolean = false;
  qClueToast: boolean = false;
  protected readonly document = document;
  protected readonly console = console;

  constructor(private _modal: ModalController, private _fb: FormBuilder) {
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  async openQuestionModal(question: any) {
    const modal = await this._modal.create({
      component: QuestionModalComponent,
      componentProps: {
        questionTitle: question.question,
        questionAnswer: question.answer,
        questionClue: question.clue,
        correctAnswers: question.correctAnswers,
        wrongAnswers: question.wrongAnswers
      },
      presentingElement: document.querySelector('ion-modal')!,
    });
    modal.onDidDismiss().then((modalData) => {
      if (modalData.data === 'delete') {
        this.currentEscapeRoom.questions.splice(this.currentEscapeRoom.questions.indexOf(question), 1);
      }
    });
    return await modal.present();
  }

  async openEscapeRoomModal(escapeRoom: any) {
    const modal = await this._modal.create({
      component: EscapeRoomModalComponent,
      componentProps: {
        title: escapeRoom.title,
        questions: escapeRoom.questions,
        peopleAnswered: escapeRoom.peopleAnswered
      },
      presentingElement: document.querySelector('ion-router-outlet')!,
    });
    return await modal.present();
  }

  createQuestion() {
    if (this.currentQuestion.valid) {
      this.currentEscapeRoom.questions.push(this.currentQuestion.value);
      this.currentEscapeRoom.questions[this.currentEscapeRoom.questions.length - 1].correctAnswers = 0;
      this.currentEscapeRoom.questions[this.currentEscapeRoom.questions.length - 1].wrongAnswers = 0;
      this.currentQuestion.reset();
      this.newQuestion.dismiss();
    } else if (this.currentQuestion.value.question?.length === 0) {
      this.qQuestionToast = true;
    } else if (this.currentQuestion.value.answer?.length === 0) {
      this.qAnswerToast = true;
    } else if (this.currentQuestion.value.clue?.length === 0) {
      this.qClueToast = true;
    }
  }

  createEscapeRoom() {
    if (this.currentEscapeRoom.formGroup.valid && this.currentEscapeRoom.questions.length > 0) {
      this.data.push({
        title: this.currentEscapeRoom.formGroup.controls.title.value,
        questions: this.currentEscapeRoom.questions,
        peopleAnswered: 0
      });
      this.currentEscapeRoom.formGroup.reset();
      this.currentEscapeRoom.questions = [];
      this.createModal.dismiss();
    } else if (!this.currentEscapeRoom.formGroup.valid) {
      this.erTitleToast = true;
    } else if (this.currentEscapeRoom.questions.length === 0) {
      this.erQuestionToast = true;
    }
  }
}
