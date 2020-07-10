import { Component, OnInit } from '@angular/core';
import { EventService } from '../../shared/services/api/core/event/event.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-talks',
  templateUrl: './talks.component.html',
  styleUrls: ['./talks.component.scss']
})
export class TalksComponent implements OnInit {

  evt_id;
  evtDetails;

  constructor(private eventService: EventService,
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

}
