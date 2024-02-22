import { Component, OnInit , OnDestroy,} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as rootReducer from '../store/root.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-next',
  templateUrl: './next.component.html',
  styleUrl: './next.component.css'
})
export class NextComponent implements OnInit, OnDestroy {
 
  display                   :        any
  private subscriptions     :        Subscription[] = [];

  constructor(private router: Router, private store: Store<rootReducer.State>) {}

  ngOnInit() {
    this.subscriptions.push(
      this.store.select(rootReducer.getFormData)
        .subscribe((DisplayData) => {
          console.log("Response Data", DisplayData)
      this.display = DisplayData
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // Unsubscribe all
  }
  goToNext(){
    if (this.display.selectedOperation == "Cancellation"){
    this.router.navigate(['cancel']);
    }
    else{
      this.router.navigate(['bchange']);
    }
  }
  Back() {
    this.router.navigate(['home']);
  }
}

