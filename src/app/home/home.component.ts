import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidator } from './FormValidator';
import { Router } from '@angular/router';
import * as appAction from "../store/app.action";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { WebService } from '../service/web.service';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api'
import { stationNamePipe } from '../pipes/station-pipe';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  formGroup: FormGroup;
  base64: any;
  captcha: any;
  requestData: any;
  systktCanOtpId: any;
  stationHashMap: any;
  filteredTrains: any[];
  trainListHashMap: { [key: string]: string };
  selectTrainNo: any;
  selectedProcedure: string = 'Cancellation';
  allCancelled: boolean = false;
  errorMessage: any;

  constructor(private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig, 
    private router: Router, private store: Store<fromApp.State>, private webService: WebService,
    private stationNamePipe: stationNamePipe) { }

  createForm() {
    this.formGroup = new FormGroup({
      serviceType: new FormControl('Cancellation', Validators.required),
      pnrNumber: new FormControl('', [FormValidator.validatePNR]),
      trainNo: new FormControl('', [Validators.required]),
      captcha: new FormControl('', Validators.required),
      checked: new FormControl(false, Validators.requiredTrue),
    });
  }

  ngOnInit() {

    //Calling Station Data API and converting it to Hash Map

    this.webService.get("stationData").subscribe((resp: any) => {
      this.stationHashMap = arrayToHashMap(resp, 'sc');
      this.store.dispatch(appAction.saveStationData({ payload: this.stationHashMap }));
    });

    //Calling Train List API and converting it to Hash Map

    this.webService.getString("trainList").subscribe((resp: any) => {
      const data: string = `${resp}`;
      const entries: string[] = data.split('","');
      this.trainListHashMap = {};
      entries.forEach(entry => {
        const trimmedEntry = entry.replace(/^"|"$/g, '');
        const [key, value] = trimmedEntry.split(' - ');
        this.trainListHashMap[key.trim()] = value.trim();
      });
      this.store.dispatch(appAction.saveTrainList({ payload: resp }));
    });

    //Creating New Form

    
    this.createForm();

    //Calling Captcha API

    this.webService.get("api/text/generateCaptcha").subscribe((resp: any) => {
      this.captcha = resp.captcha;
      this.base64 = resp.base64Value;
    });

  }
  submitForm() {


    //Alerts for Invalid inputs

    var form = this.formGroup.value;
    console.log(form.trainNo);
    if (form.pnrNumber == "") {
      alert('Please fill PNR Number');
    }
    else if (form.pnrNumber[0] !== "2" && form.pnrNumber[0] !== "4" && form.pnrNumber[0] !== "6" && form.pnrNumber[0] !== "8") {
      alert('pnrNumber should start with 2 or 4 or 6 or 8');
    }
    else if (form.pnrNumber.length != 10) {
      alert('pnrNumber should be a 10 digit number')
    }
    else if (form.trainNo == undefined || form.trainNo == '') {
      alert('Please fill in Train Number');
    }
    else if (form.captcha == '') {
      alert('Please fill in the captcha');
    }
    else if (form.captcha != this.captcha) {
      alert('Please Enter Valid Captcha')
    }
    else if (form.checked == false) {
      alert('Please read cancellation/boarding point change procedure and its rule and check the box');
    }
    else {
      let serviceType = this.formGroup.value.serviceType === "Cancellation" ? 1 : 2;
      let trainNumber = this.formGroup.value.trainNo.slice(0, 5);
      console.log(trainNumber);
      let requestData: any = {
        resendOTP: false,
        pnrNumber: this.formGroup.value.pnrNumber,
        serviceType: serviceType,
        trainNo: trainNumber,
        captcha: this.formGroup.value.captcha
      }

      //Sending entered data to backend, storing it in the database and generating OTP

      this.webService.post("api/text/generateOTP", requestData).subscribe((resp: any) => {
        requestData.systktCanOtpId = resp.systktCanOtpId;
        form.systktCanOtpId = resp.systktCanOtpId;
        this.store.dispatch(appAction.saveFormData({ payload: form }));
        this.allCancelled = true;
        for (const passenger of resp.pnrEnquiryResponseDTO.passengerList) {
          if (passenger.currentStatus !== "CAN") {
            this.allCancelled = false;
            break;
          }
        }
        console.log('Form Data after dispatch:', form);
        if ((this.formGroup.value.serviceType == "Boarding Point Change" && this.allCancelled == false) || this.formGroup.value.serviceType == "Cancellation")
        {
          this.router.navigate(["next"]);
        }
      })
    }

  }
  audioRequest() {
    this.playBase64Audio();
  };

  playBase64Audio() {
    const audio = new Audio();
    audio.src = 'data:audio/mp3;base64,' + this.base64; // Adjust the type if needed
    audio.load();
    audio.play();
  }

  //Displaying procedure according to service type

  toggleProcedure(value: string) {
    this.selectedProcedure = value;
  }


  resetCaptcha() {

    //Calling Resend OTP service

    this.webService.get("api/text/generateCaptcha").subscribe((resp: any) => {
      this.captcha = resp.captcha;
      this.base64 = resp.base64Value;
    });
  }

  filterTrains(event) {
    let filtered: any[] = [];
    let query = event.query;

    for (let key in this.trainListHashMap) {
      const trainName = this.trainListHashMap[key];
      const trainDisplayName = `${key} - ${trainName}`;

      if (key.startsWith(query) || trainName.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(trainDisplayName);
      }
    }

    this.filteredTrains = filtered;
  }

  Reset() {
  window.location.reload();
   this.allCancelled = false;
  }
}
  


//Changing Station Data array to Hash Map

function arrayToHashMap(arr, keyProperty) {
  const hashMap = {};
  for (const obj of arr) {
    const key = obj[keyProperty];
    hashMap[key] = obj;
  }
  return hashMap;
}

