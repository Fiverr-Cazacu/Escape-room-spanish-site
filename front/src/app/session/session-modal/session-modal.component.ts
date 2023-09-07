import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SessionTeamModal } from '../session-team-modal/session-team-modal.component';

@Component({
  selector: 'app-session-modal',
  templateUrl: './session-modal.component.html',
})
export class SessionModalComponent {
  @Input() session: any;
  @Input() roomName!: string;

  teamForm: any = this._fb.group({
    name: ['', Validators.required]
  });

  constructor(private _modal: ModalController, private _fb: FormBuilder, private _http: HttpClient) {
  }

  closeModal() {
    this._modal.dismiss();
  }

  submit() {
    if (this.teamForm.valid) {
      this._http.post('https://escape-room-site.onrender.com/api/teams?sessionId=' + this.session._id, this.teamForm.getRawValue()).subscribe({
        next: (val) => {console.log(val); window.location.reload()},
        error: (err) => console.log(err)
      })
    }
  }

  async openTeamModal(team: any, session: any) {
    const modal = await this._modal.create({
      component: SessionTeamModal,
      componentProps: {
        session: session,
        team: team
      },
      presentingElement: document.querySelector('ion-router-outlet')!,
    });
    return await modal.present();
  }
}
