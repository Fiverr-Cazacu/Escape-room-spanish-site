import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room, Session } from './models';

@Injectable({
    providedIn: 'root'
})
export class RoomService {

    private baseURL: string = 'https://escape-room-site.onrender.com/api/';

    constructor(private http: HttpClient) { }

    fetchRooms() {
        return this.http.get<Room[]>(this.baseURL + 'rooms');
    }

    deleteRoom(id: string) {
        return this.http.delete(this.baseURL + 'rooms/' + id);
    }

    addRoom(payload: Room) {
        console.log("room added")
        return this.http.post<Room>(this.baseURL + 'rooms', payload);
    }

    updateRoom(payload: Room, id: string) {
        return this.http.put<Room>(this.baseURL + 'rooms/' + id, payload);
    }

    fetchSessions() {
        return this.http.get<Session[]>(this.baseURL + 'sessions');
    }
    
    addSession(payload: Session) {
        console.log('madeHTTP request')
        return this.http.post<Session>(this.baseURL + 'sessions', payload);
    }
}