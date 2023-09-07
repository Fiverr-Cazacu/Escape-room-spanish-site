import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-escape-room',
  templateUrl: './escape-room.component.html',
  styleUrls: ['./escape-room.component.scss']
})
export class EscapeRoomComponent {

  session: any;

  room: any = {name: ''};

  sessionStarted = false;

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
      }
    })
  }
}
