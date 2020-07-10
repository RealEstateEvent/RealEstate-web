import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  fetchUpcomingEvents(page_no, limit) {
    return this.http.get(environment.apiUrl + `event/all?isPast=false&page=${page_no}&limit=${limit}`);
  }

  fetchPastEvents(page_no, limit) {
    return this.http.get(environment.apiUrl + `event/all?isPast=true&page=${page_no}&limit=${limit}`);
  }

  fetchEventDetails(id) {
    return this.http.get(environment.apiUrl + `event?id=${id}`);
  }

  fetchMyEvents(isPast, page_no, limit) {
    return this.http.get(environment.apiUrl + `event/my?isPast=${isPast}&page=${page_no}&limit=${limit}`);
  }
}
