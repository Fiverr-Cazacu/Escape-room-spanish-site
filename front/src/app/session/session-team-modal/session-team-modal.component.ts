import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-session-team-modal',
  templateUrl: './session-team-modal.component.html',
})
export class SessionTeamModal {
  @Input() session: any;
  @Input() team: any;

  copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  constructor(private _modal: ModalController, private _fb: FormBuilder, private _http: HttpClient) { }

  ngOnInit() {
    console.log(this.team)
  }

  closeModal() {
    this._modal.dismiss();
  }

  locationOrigin() {
    return window.location.origin + '/escaperoom/#';
  }
}
