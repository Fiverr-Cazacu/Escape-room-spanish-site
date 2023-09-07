import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-escape-room',
  templateUrl: './escape-room.component.html',
  styleUrls: ['./escape-room.component.scss']
})
export class EscapeRoomComponent {

  started: any = false;

  session: any;

  room: any = {name: ''};

  constructor (private _route: ActivatedRoute, private _http: HttpClient) { }

  ngOnInit(): void {
    const sessionID = this._route.snapshot.paramMap.get('session');

    this._http.get('https://escape-room-site.onrender.com/api/sessions/'+sessionID).subscribe({
      next: (val: any) => {
        this.session = val;
        console.log(val);
        this._http.get('https://escape-room-site.onrender.com/api/rooms/'+val.roomId).subscribe({
          next: (val2) => {
            this.room = val2;
          }
        });
      }
    })
    this._http.get('https://escape-room-site.onrender.com/api/sessions/'+sessionID+'/running').subscribe({
      next: (val) => {
        console.log('Running', val)
        this.started = val;
      }
    })
  }

  startSession() {
    this._http.put('https://escape-room-site.onrender.com/api/sessions/'+this.session._id+'/start', {}).subscribe({
      next: () => window.location.reload()
    });
  }

  stopSession() {
    this._http.put('https://escape-room-site.onrender.com/api/sessions/'+this.session._id+'/stop', {}).subscribe({
      next: () => window.location.reload()
    });
  }
}
