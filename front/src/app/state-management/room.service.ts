import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room } from './models';

@Injectable({
    providedIn: 'root'
})
export class RoomService {

    private baseURL: string = 'https://escape-zwgf.onrender.com/api/';

    constructor(private http: HttpClient) { }

    fetchRooms() {
        console.log(666, this.baseURL + 'rooms')
        return this.http.get<Room[]>(this.baseURL + 'rooms');
    }

    deleteRoom(id: string) {
        return this.http.delete(this.baseURL + 'rooms/' + id);
    }

    addRoom(payload: Room) {
        return this.http.post<Room>(this.baseURL + 'rooms', payload);
    }

    updateRoom(payload: Room, id: string) {
        return this.http.put<Room>(this.baseURL + 'rooms/' + id, payload);
    }
}