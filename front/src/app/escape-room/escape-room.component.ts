import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { link } from '../link';

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

  constructor (private _route: ActivatedRoute, private _http: HttpClient) { }

  ngOnInit(): void {
    const sessionID = this._route.snapshot.paramMap.get('session');

    this._http.get(link+'sessions/'+sessionID).subscribe({
      next: (val: any) => {
        this.session = val;
        this.deadline = new Date(val.startedAt).getTime() + val.duration;
        this.started = (val.startedAt !== undefined);
        console.log(val);
        this._http.get(link+'rooms/'+val.roomId).subscribe({
          next: (val2) => {
            this.room = val2;
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

  stopSession() {
    localStorage.setItem('watched', 'false');
    this._http.put(link+'sessions/'+this.session._id+'/stop', {}).subscribe({
      next: () => window.location.reload()
    });
  }
}
