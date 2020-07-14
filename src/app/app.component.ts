import { Component } from '@angular/core';
import { DataSharedService } from './shared/services/internal/data-shared/data-shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'real-estate';
  isAgoraOpen = false;

  constructor(private dataSharedService: DataSharedService) {
    this.dataSharedService.getAgoraStatus().subscribe( (res) => {
      console.log("app component res",res);
      this.isAgoraOpen = res;
    })
  }
}
