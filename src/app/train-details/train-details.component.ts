import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from 'express';
import { WebService } from '../service/web.service';
import * as rootReducer from '../store/root.reducer';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-train-details',
  templateUrl: './train-details.component.html',
  styleUrl: './train-details.component.css'
})
export class TrainDetailsComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  display: any;
  formattedDateOfJourney: any;
  formattedDepartureTime: any;
  formattedArrivalTimeDestination: any;
  journeyDuration: any;

  constructor(private store: Store<rootReducer.State>, private webService: WebService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select(rootReducer.getFormData)
        .subscribe((DisplayData) => {
          console.log("Response Data", DisplayData)
          this.display = DisplayData;
        })
    );
    
}
}
