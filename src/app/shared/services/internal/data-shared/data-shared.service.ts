import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharedService {

  constructor() { }

  private eventData: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  private isAgoraOpen: BehaviorSubject<any> = new BehaviorSubject<any>(false);
 
  public getEventData(): Observable<any> {
    return this.eventData.asObservable();
  }

  public setEventData(event: any): void {
    this.eventData.next(event);
  }

  public getAgoraStatus(): Observable<any> {
    return this.isAgoraOpen.asObservable();
  }

  public setAgoraStatus(status: boolean): void {
    this.isAgoraOpen.next(status);
  }
}
