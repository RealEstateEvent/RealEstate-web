import { Injectable, OnDestroy } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AccountService } from '../../api/auth/account/account.service';
import { JwtStore } from './jwt.store';
import { StorageService } from '../data-storage/storage/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {

    private _jwtStore: JwtStore;
    public _refreshToken: string;

    private _initialData: string[] = ['token'];

    constructor(private _appStorage: StorageService,
        private accountService: AccountService,
        private _router: Router) {
        this._initialData.forEach((value) => {
            this[value] = this._getStoredItems(value);
        });
    }

    ngOnDestroy() { }

    public get token(): string {
        return this._jwtStore && this._jwtStore.token ? this._jwtStore.token : '';
    }

    public set token(token: string) {
        this._jwtStore = new JwtStore(token);
    }

    public isAuthenticated(): boolean {
        if (this.token && this.token.trim() != "") return true;
        return false;
    }

    public logIn(formValue: { email: string, password: string }) {
        return new Promise((resolve, reject) => {
            this.accountService.loginUser(formValue).subscribe((res: any) => {
                if (res.body.data.userType === 2) {
                    reject(res.body.data.userType);
                } else {
                    this._saveValue('token', res.headers.get('X-Auth'));

                    this.redirectLoginControl().then(() => {
                        resolve(res.body);
                    })
                }

            }, (err) => {
                reject(err.error);
            });
        });
    }

    redirectLoginControl() {
        return new Promise((resolve, reject) => {
            this._router.navigate(['/dashboard'])
                .then(() => {
                    resolve('');
                });
        });
    }

    getEmailFromToken() {
        return this._jwtStore.email;
    }

    getUserIDFromToken() {
        return this._jwtStore.userID;
    }

    getUserTypeFromToken() {
        return this._jwtStore.userType;
    }

    public clearData() {
        this._appStorage.removeItem('token');
        this.token = undefined;
    }

    public logOut() {
        this.clearData();
        this._redirectToLoginPage();
    }

    public isTokenValid(): Observable<boolean> {
        if (!this.isAuthenticated) {
            return of(false);
        }
        let decoded = this._jwtStore.decodedJwt;
        if (!decoded)
            return of(false);

        if (typeof decoded.exp !== 'undefined') {
            return of(((1000 * decoded.exp) - (new Date()).getTime()) < 5000)
        }
    }

    private _getStoredItems(key: string): any {
        return this._appStorage.getItem(key);
    }

    private _saveValue(key: string, value: any): void {
        // For saving auth token
        this._appStorage.setItem(key, value);
        if (key === 'token') {
            this.token = value;
        }
    }

    _redirectToLoginPage() {
        this._router.navigate(['/login']);
    }
}
