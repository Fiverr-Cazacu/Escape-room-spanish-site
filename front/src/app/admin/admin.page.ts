import { Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QuestionModalComponent } from './question-modal/question-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { EscapeRoomModalComponent } from './escape-room-modal/escape-room-modal.component';
import { HttpClient } from '@angular/common/http';
import { link } from '../link';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
})
export class AdminPage {
  currentQuestion = this._fb.group({
    statement: ['', [Validators.required]],
    answer: ['', [Validators.required]],
    clue: ['', [Validators.required]],
    answerImage: [''],
    clueImage: ['']
  });

  currentEscapeRoom: any = {
    questions: [],
    formGroup: this._fb.group({
      title: ['', Validators.required],
      link: [''],
      link2: ['']
    })
  };

  data: any = [];
  @ViewChild('newQuestion') newQuestion: any;
  @ViewChild('createModal') createModal: any;
  erTitleToast: boolean = false;
  erQuestionToast: boolean = false;
  qQuestionToast: boolean = false;
  qAnswerToast: boolean = false;
  qClueToast: boolean = false;
  protected readonly document = document;
  protected readonly console = console;

  constructor(private _modal: ModalController, private _fb: FormBuilder, private _http: HttpClient, private _authService: AuthService) { }

  ngOnInit() {
    this._http.get(link+'rooms').subscribe({
      next: (val) => {
        this.data = val;
      }
    });
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  async openQuestionModal(question: any) {
    console.log(question)
    const modal = await this._modal.create({
      component: QuestionModalComponent,
      componentProps: {
        question: question
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
        title: escapeRoom.name,
        questions: escapeRoom.questions,
        currentQuestionID: escapeRoom._id,
        link: escapeRoom.description
      },
      presentingElement: document.querySelector('ion-router-outlet')!,
    });
    return await modal.present();
  }

  createQuestion() {
    if (this.currentQuestion.valid) {
      this.currentEscapeRoom.questions.push(this.currentQuestion.value);
      this.currentQuestion.reset();
      this.newQuestion.dismiss();
    } else if (this.currentQuestion.value.statement?.length === 0) {
      this.qQuestionToast = true;
    } else if (this.currentQuestion.value.answer?.length === 0) {
      this.qAnswerToast = true;
    } else if (this.currentQuestion.value.clue?.length === 0) {
      this.qClueToast = true;
    }
  }

  createEscapeRoom() {
    if (this.currentEscapeRoom.formGroup.valid && this.currentEscapeRoom.questions.length > 0) {
      this._http.post(link+'rooms', {
        name: this.currentEscapeRoom.formGroup.controls.title.value,
        description: this.currentEscapeRoom.formGroup.controls.link.value + ' ' + this.currentEscapeRoom.formGroup.controls.link2.value,
        questions: this.currentEscapeRoom.questions
      }).subscribe({
        next: (val) => {
          console.log("Room created");
          window.location.reload();
        },
        error: (err) => {
          console.log("Room not created");
          console.log(err);
        }
      });
      console.log({
        name: this.currentEscapeRoom.formGroup.controls.title.value,
        description: "description",
        questions: this.currentEscapeRoom.questions
      })
      
      this.currentEscapeRoom.formGroup.reset();
      this.currentEscapeRoom.questions = [];
      this.createModal.dismiss();
    } else if (!this.currentEscapeRoom.formGroup.valid) {
      this.erTitleToast = true;
    } else if (this.currentEscapeRoom.questions.length === 0) {
      this.erQuestionToast = true;
    }
  }

  isAuthentificated(): boolean {
    return this._authService.getAuthState();
  }

  authentificate(pass: string | null | undefined | number): void {
    this._authService.authentificate(pass);
  }
}
