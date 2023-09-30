import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    _isAuhentificated: boolean = (localStorage.getItem('auth') ?? false) === 'true';

    authentificate(pass: string | null | undefined | number): void {
        if (pass === 'Y9KMDezF7V8C') {
            localStorage.setItem('auth', 'true');
            this._isAuhentificated = true;
        }
    }

    getAuthState(): boolean {
        return this._isAuhentificated;
    }
}