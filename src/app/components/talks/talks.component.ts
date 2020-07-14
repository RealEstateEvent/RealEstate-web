import { Component, OnInit } from '@angular/core';
import { EventService } from '../../shared/services/api/core/event/event.service';
import { DataSharedService } from '../../shared/services/internal/data-shared/data-shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-talks',
  templateUrl: './talks.component.html',
  styleUrls: ['./talks.component.scss']
})
export class TalksComponent implements OnInit {

  evt_id;
  evtDetails;
  isMoreSpeaker = false;

  constructor(private eventService: EventService,
    private dataSharedService: DataSharedService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.evt_id = this.route.snapshot.paramMap.get('id');
    if(this.evt_id) {
      this.eventService.fetchEventDetails(this.evt_id).subscribe(
        (res : any) => {
          console.log("res",res);
          this.evtDetails = res.data;
          console.log("this.eventDetails",this.evtDetails);
        }, (err) => {
          console.log("err",err);
        }
      )
    }
  }

  checkIn(agenda_id) {
    this.dataSharedService.setEventData(this.evtDetails);
    this.router.navigate(['/webinar-speaker'], { queryParams: { meetingid: agenda_id } });
  }

  toggleMoreSpeaker() {
    this.isMoreSpeaker = !this.isMoreSpeaker;
  }

}
