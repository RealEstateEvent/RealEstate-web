import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  loginUser(payload: any) {
    return this.http.post(environment.apiUrl + 'user/login', payload, {observe: 'response'});
  }
}
