import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { link } from '../link';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-escape-room',
  templateUrl: './escape-room.component.html',
  styleUrls: ['./escape-room.component.scss']
})
export class EscapeRoomComponent {

  watched: boolean = localStorage.getItem('watched')=='true'?true:false;

  started: any = false;

  session: any = {teams: []};

  room: any = {name: ''};

  sId: any;

  hours: string = '';
  minutes: string = '';
  seconds: string = '';
  distance: number = 1;

  deadline: number = new Date().getTime();

  calcTime = setInterval(() => {
    var now = new Date().getTime();
    var distance = this.deadline - now;
    this.distance = distance;

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.hours = hours.toString();
    this.minutes = minutes.toString().padStart(2, '0');
    this.seconds = seconds.toString().padStart(2, '0');
  }, 1000);

  constructor (private _route: ActivatedRoute, private _http: HttpClient, private alertController: AlertController) { }

  ngOnInit(): void {
    const sessionID = this._route.snapshot.paramMap.get('session');

    this.sId = sessionID;

    if (localStorage.getItem(this.sId) === null) {
      localStorage.setItem(this.sId, 'false');
    }

    this._http.get(link+'sessions/'+sessionID).subscribe({
      next: (val: any) => {
        this.session = val;
        this.deadline = new Date(val.startedAt).getTime() + val.duration;
        this.started = (val.startedAt !== undefined);
        console.log(val);
        this._http.get(link+'rooms/'+val.roomId).subscribe({
          next: (val2) => {
            this.room = val2;
            console.log(this.room.description.split(' '));
            (<HTMLIFrameElement>document.getElementById('iframe2')).src = this.room.description.split(' ')[1];
            (<HTMLIFrameElement>document.getElementById('iframe')).src = this.room.description.split(' ')[0];
          }
        });
      }
    });
  }

  startSession() {
    localStorage.setItem('watched', 'true');
    this._http.put(link+'sessions/'+this.session._id+'/start', {}).subscribe({
      next: () => window.location.reload()
    });
  }

  endSession() {
    this._http.put(link+'sessions/'+this.session._id+'/end', {}).subscribe({
      next: () => window.location.reload()
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: `¿Estás seguro/a de que deseas iniciar/detener este Escape Room?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.started?0:this.startSession();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  localStorage = localStorage;

  reload = window.location.reload;

  showBeginButton(): boolean {
    return localStorage.getItem(this.sId) === 'false';
  }

  showStartVideo(): boolean {
    console.log(!(localStorage.getItem(this.sId) === 'false') && !this.started)
    return !(localStorage.getItem(this.sId) === 'false') && !this.started;
  }

  showStartButton(): boolean {
    return !(localStorage.getItem(this.sId) === 'false') && !this.started && this.distance >= 0;
  }

  showTimer(): boolean {
    return !(localStorage.getItem(this.sId) === 'false') && this.started && this.distance >= 0;
  }

  showEndScreen(): boolean {
    return !(localStorage.getItem(this.sId) === 'false')  && this.started && this.distance < 0;
  }
}
