import {State, Action, StateContext, Selector} from '@ngxs/store';
import { Room, Session } from './models';
import {AddRoom, AddSession, DeleteRoom, GetRooms, GetSessions, UpdateRoom} from './actions';
import { RoomService } from './http.service';
import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';

export class SessionStateModel {
    sessions!: Session[];
}

@State<SessionStateModel>({
    name: 'sessions',
    defaults: {
        sessions: []
    }
})
@Injectable()
export class SessionState {

    constructor(private httpService: RoomService) {
    }

    @Selector()
    static getSessionList(state: SessionStateModel) {
        return state.sessions;
    }

    @Action(GetSessions)
    getSessions({getState, setState}: StateContext<SessionStateModel>) {
        return this.httpService.fetchSessions().pipe(tap((result) => {
            const state = getState();
            setState({
                ...state,
                sessions: result,
            });
        }));
    }

    @Action(AddSession)
    addSession({getState, patchState}: StateContext<SessionStateModel>, {payload}: AddSession) {
        return this.httpService.addSession(payload).pipe(tap((result) => {
            const state = getState();
            patchState({
                sessions: [...state.sessions, result]
            });
        }));
    }
}