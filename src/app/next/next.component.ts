import { Component, OnInit , OnDestroy,} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as rootReducer from '../store/root.reducer';
import { Subscription } from 'rxjs';
import { WebService } from '../service/web.service';
import { log } from 'console';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as appAction from "../store/app.action";

@Component({
  selector: 'app-next',
  templateUrl: './next.component.html',
  styleUrl: './next.component.css'
})
export class NextComponent implements OnInit, OnDestroy {
 
  otp                       :        any
  display                   :        any
  private subscriptions     :        Subscription[] = [];
  requestData               :        any;
  navigateCheck             :        any;
  constructor(private confirmationService: ConfirmationService,private router: Router, private store: Store<rootReducer.State>,private webService: WebService,private messageService: MessageService) {}

  ngAfterViewInit() {
    this.messageService.add({ severity: 'success', summary: 'OTP sent', detail: 'OTP has been sent to your number' });
  }

  ngOnInit() {

    //Getting Form Data from Store to display

    this.subscriptions.push(
      this.store.select(rootReducer.getFormData)
        .subscribe((DisplayData) => {
          console.log("Response Data", DisplayData)
          this.display = DisplayData;
        })
    );
  }

  
  goToNext() {
    //Taking Entered OTP for verification from backend

    var enteredOTPElement = document.getElementById("EnterOTP") as HTMLInputElement;
    var enteredOTP = enteredOTPElement.value


    let serviceType = this.display.serviceType == "Cancellation" ? 1 : 2;
    this.requestData = {
        systktCanOtpId : this.display.systktCanOtpId,
        captcha: this.display.captcha,
        serviceType: serviceType,
        pnrNumber: this.display.pnrNumber,
        trainNo: this.display.trainNo,
        generatedOTP: enteredOTP
      }
    
    //Sending OTP and other data to backend and database
    
    this.webService.post("api/text/verifyOTP", this.requestData).subscribe((resp: any) => {
      let navigateCheck = resp;
      console.log(navigateCheck)
      let routeCheck = this.display.serviceType;
      if (navigateCheck.pnrEnquiryResponseDTO && !navigateCheck.pnrEnquiryResponseDTO.errorMessage){
        if (navigateCheck.message == "Valid") {
          this.store.dispatch(appAction.saveFormData({ payload: resp }));
          if (routeCheck == "Cancellation"){
          this.router.navigate(['cancel']);
          }
          else{
            this.router.navigate(['bchange']);
          }
        }
        else {
          this.messageService.add({ severity: 'Error', summary: 'Rejected', detail: 'OTP entered is invalid', life: 3000 });
        }
      }
      else if (navigateCheck.pnrEnquiryResponseDTO && navigateCheck.pnrEnquiryResponseDTO.errorMessage){
        this.confirmationService.confirm({
          message: `${navigateCheck.pnrEnquiryResponseDTO.errorMessage}`,
          header: 'Error',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon: "none",
          acceptLabel: "Go to Home",
          acceptVisible: true,
          rejectVisible: false,
          acceptButtonStyleClass: "p-button-text",
          accept: () => {
            this.router.navigate(['home']);
            }
          });
          
        }
      else {
        this.confirmationService.confirm({
          message: `${navigateCheck.error}`,
          header: 'Error',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon: "none",
          acceptLabel: "Go to Home",
          acceptVisible: true,
          rejectVisible: false,
          acceptButtonStyleClass: "p-button-text",
          accept: () => {
            this.router.navigate(['home']);
          }
        });

      }
      });
    }




  Back() {
    this.router.navigate(['home']);
  }
  ResendOTP() {

    //Sending the same OTP from the backend to the user

    let serviceType = this.display.serviceType == "Cancellation" ? 1 : 2;
    this.requestData = {
        systktCanOtpId : this.display.systktCanOtpId,
        resendOTP : true,
        captcha: this.display.captcha,
        serviceType: serviceType,
        pnrNumber: this.display.pnrNumber,
        trainNo: this.display.trainNo,
    }
  
    this.webService.post("api/text/resendOTP", this.requestData).subscribe((resp: any) => {
      console.log(resp);
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

