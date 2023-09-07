import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-escape-room',
  templateUrl: './escape-room.component.html',
  styleUrls: ['./escape-room.component.scss']
})
export class EscapeRoomComponent {

  roomName = 'Test';

  sessionStarted = false;

  constructor (private _route: ActivatedRoute, private _store: Store) { }

  ngOnInit(): void {
    const roomID = this._route.snapshot.paramMap.get('room');

    this._store.dispatch
  }
}
