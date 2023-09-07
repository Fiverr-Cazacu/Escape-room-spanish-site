import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EscapeRoomModalComponent } from '../admin/escape-room-modal/escape-room-modal.component';
import { QuestionModalComponent } from '../admin/question-modal/question-modal.component';
import { Room } from '../state-management/models';
import { GetRooms, AddRoom, GetSessions, AddSession } from '../state-management/actions';
import { RoomState } from '../state-management/room.state';
import { SessionState } from '../state-management/session.state';
import { HttpClient } from '@angular/common/http';
import { SessionModalComponent } from './session-modal/session-modal.component';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html'
})
export class SessionComponent {
  stringf = JSON.stringify

  selectedRoom: string | undefined = '';

  currentTeam = this._fb.group({
    name: ['', Validators.required]
  });

  currentSession: any = {
    formGroup: this._fb.group({
      duration: ['', Validators.required]
    })
  };

  data: any = [];
  sessions: any = [];
  @ViewChild('newQuestion') newQuestion: any;
  @ViewChild('createModal') createModal: any;
  erTitleToast: boolean = false;
  erQuestionToast: boolean = false;
  qQuestionToast: boolean = false;
  qAnswerToast: boolean = false;
  qClueToast: boolean = false;
  protected readonly document = document;
  protected readonly console = console;

  constructor(private _modal: ModalController, private _fb: FormBuilder, private _http: HttpClient) { }

  ngOnInit() {
    this._http.get('https://escape-room-site.onrender.com/api/rooms').subscribe({
      next: (val) => this.data = val
    })
    this._http.get('https://escape-room-site.onrender.com/api/sessions').subscribe({
      next: (val) => this.sessions = val
    })
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  async openQuestionModal(question: any) {
    const modal = await this._modal.create({
      component: QuestionModalComponent,
      componentProps: {
        questionTitle: question.statement,
        questionAnswer: question.answer,
        questionClue: question.clue,
      },
      presentingElement: document.querySelector('ion-modal')!,
    });
    modal.onDidDismiss().then((modalData) => {
      if (modalData.data === 'delete') {
        this.currentSession.questions.splice(this.currentSession.teams.indexOf(question), 1);
      }
    });
    return await modal.present();
  }

  async openSessionModal(session: any) {
    const modal = await this._modal.create({
      component: SessionModalComponent,
      componentProps: {
        session: session,
        roomName: this.getName(session.roomId)
      },
      presentingElement: document.querySelector('ion-router-outlet')!,
    });
    return await modal.present();
  }

  createTeam() {
    if (this.currentTeam.valid) {
      this.currentSession.teams.push(this.currentTeam.value);
      this.currentTeam.reset();
      this.newQuestion.dismiss();
    } else if (this.currentTeam.value.name?.length === 0) {
      this.qQuestionToast = true;
    }
  }

  createSession() {
    if (this.currentSession.formGroup.valid) {
      this._http.post('https://escape-room-site.onrender.com/api/sessions', {
        duration: this.currentSession.formGroup.controls.duration.value * 60 * 1000,
        roomId: this.selectedRoom
      }).subscribe({
        next: (val) => this.console.log(val),
        error: (err) => this.console.log(err)
      })
      console.log({
        duration: this.currentSession.formGroup.controls.duration.value * 60 * 1000,
        roomId: this.selectedRoom
      })
      
      this.currentSession.formGroup.reset();
      this.currentSession.questions = [];
      this.createModal.dismiss();
    } else if (this.currentSession.teams.length === 0) {
      this.erQuestionToast = true;
    }
  }

  getName(id: string) {
    return this.data.filter((item: any) => item._id == id)[0].name;
  }
}
