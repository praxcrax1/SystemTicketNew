import { Component, OnInit , OnDestroy,} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as rootReducer from '../store/root.reducer';
import { Subscription } from 'rxjs';
import { WebService } from '../service/web.service';
import { log } from 'console';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-next',
  templateUrl: './next.component.html',
  styleUrl: './next.component.css'
})
export class NextComponent implements OnInit, OnDestroy {
 
  otp                       :        any
  display                   :        any
  private subscriptions     :        Subscription[] = [];

  constructor(private router: Router, private store: Store<rootReducer.State>,private webService: WebService,private messageService: MessageService) {}

  ngAfterViewInit() {
    this.messageService.add({ severity: 'success', summary: 'OTP sent', detail: 'OTP has been sent to your number' });
  }
  ngOnInit() {
    this.subscriptions.push(
      this.store.select(rootReducer.getFormData)
        .subscribe((DisplayData) => {
          console.log("Response Data", DisplayData)
      this.display = DisplayData
        })
    );
    
    this.webService.get("api/text/otp").subscribe((resp: any) =>{
      console.log(resp);
      this.otp = resp.value;
    });

    
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  goToNext(){
    var enteredOTPElement = document.getElementById("EnterOTP") as HTMLInputElement;
    var enteredOTP = enteredOTPElement.value
    console.log(enteredOTP);
    if (enteredOTP === this.otp) {
      if (this.display.selectedOperation == "Cancellation"){
      this.router.navigate(['cancel']);
      }
      else{
        this.router.navigate(['bchange']);
      }
    }
    else{
      this.messageService.add({ severity: 'Error', summary: 'Rejected', detail: 'OTP entered is invalid', life: 3000 });
    }
  }
  Back() {
    this.router.navigate(['home']);
  }
  ResendOTP(){
    this.messageService.add({ severity: 'success', summary: 'OTP sent', detail: 'OTP has been sent to your number' });
    this.webService.get("api/text/otp").subscribe((resp: any) =>{
      console.log(resp);
      this.otp = resp.value;
    });
  }
}

