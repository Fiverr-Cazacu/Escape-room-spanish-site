import {State, Action, StateContext, Selector} from '@ngxs/store';
import { Room } from './models';
import {AddRoom, DeleteRoom, GetRooms, UpdateRoom} from './room.action';
import { RoomService } from './room.service';
import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';

export class RoomStateModel {
    rooms!: Room[];
}

@State<RoomStateModel>({
    name: 'rooms',
    defaults: {
        rooms: []
    }
})
@Injectable()
export class RoomState {

    constructor(private roomService: RoomService) {
    }

    @Selector()
    static getRoomList(state: RoomStateModel) {
        return state.rooms;
    }

    @Action(GetRooms)
    getRooms({getState, setState}: StateContext<RoomStateModel>) {
        return this.roomService.fetchRooms().pipe(tap((result) => {
            const state = getState();
            setState({
                ...state,
                rooms: result,
            });
        }));
    }

    @Action(AddRoom)
    addRoom({getState, patchState}: StateContext<RoomStateModel>, {payload}: AddRoom) {
        return this.roomService.addRoom(payload).pipe(tap((result) => {
            const state = getState();
            patchState({
                rooms: [...state.rooms, result]
            });
        }));
    }

    @Action(UpdateRoom)
    updateRoom({getState, setState}: StateContext<RoomStateModel>, {payload, id}: UpdateRoom) {
        return this.roomService.updateRoom(payload, id).pipe(tap((result) => {
            const state = getState();
            const roomList = [...state.rooms];
            const roomIndex = roomList.findIndex(item => item.id === id);
            roomList[roomIndex] = result;
            setState({
                ...state,
                rooms: roomList,
            });
        }));
    }


    @Action(DeleteRoom)
    deleteRoom({getState, setState}: StateContext<RoomStateModel>, {id}: DeleteRoom) {
        return this.roomService.deleteRoom(id).pipe(tap(() => {
            const state = getState();
            const filteredArray = state.rooms.filter(item => item.id !== id);
            setState({
                ...state,
                rooms: filteredArray,
            });
        }));
    }
}