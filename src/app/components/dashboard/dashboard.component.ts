import { Component, OnInit } from '@angular/core';
import { EventService } from '../../shared/services/api/core/event/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  upcomingEvts: any;
  pastEvts: any;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.getUpcomingEvents();
    this.getPastEvents();
  }

  getUpcomingEvents() {
    this.eventService.fetchMyEvents(false,1,5).subscribe((res : any) => {
      this.upcomingEvts = res.data.docs;
      console.log("upcoming event res",res);
      console.log("upcoming event@@@",this.upcomingEvts);
    }, (err) => {
      console.log("err",err);
    });
  }

  getPastEvents() {
    this.eventService.fetchMyEvents(true,1,5).subscribe((res: any) => {
      this.pastEvts = res.data.docs;
      console.log("past events res",res);
      console.log("past event@@@",this.pastEvts); 
    }, (err) => {
      console.log("err",err);
    });
  }

  navigateToAgenda() {

  }

}
