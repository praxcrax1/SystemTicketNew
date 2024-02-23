import { Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { FormValidator } from './FormValidator';
import { Router } from '@angular/router';
import * as appAction from "../store/app.action";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { WebService } from '../service/web.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  formGroup: FormGroup;
  selectedProcedure: string = 'Cancellation';
  base64 : any;
  captcha : any;

  constructor(private router: Router, private store: Store<fromApp.State>,
    private webService: WebService) {}

  ngAfterViewInit(){
    this.webService.get("api/text/helloWorld").subscribe((resp: any) =>{
      console.log(resp);
      this.captcha = resp.captcha;
      this.base64 = resp.base64Value;
      
    });
  }
  ngOnInit() {
    this.formGroup = new FormGroup({
      selectedOperation: new FormControl('Cancellation', Validators.required),
      pnr: new FormControl('',[FormValidator.validatePNR]),
      trainNo: new FormControl('', [FormValidator.validateTrainNo]),
      captcha: new FormControl('', Validators.required),
      checked: new FormControl(false, Validators.requiredTrue),
    });
    
  }
  submitForm() {
      var form = this.formGroup.value;
      console.log(form)
      if (form.pnr =="" ){
        alert('Please fill PNR');
      }
      else if (form.pnr[0] !== "2" && form.pnr[0] !== "4" && form.pnr[0] !== "6" && form.pnr[0] !== "8"){
        alert('PNR should start with 2 or 4 or 6 or 8');
      }
      else if (form.pnr.length != 10){
        alert('PNR should be a 10 digit number')
      }
      else if (form.trainNo == ""){
        alert('Please fill in Train Number');
      }
      else if (form.trainNo.length != 5){
        alert('Train Number should be a 5 digit number');
      } 
      else if (form.captcha == ''){
        alert('Please fill in the captcha');
      }
      else if (form.captcha != this.captcha){
        alert('Please Enter Valid Captcha')
      }
      else if (form.checked == false){
        alert('Please read cancellation/boarding point change procedure and its rule and check the box');
      }
      else{
      this.store.dispatch(appAction.saveFormData({ payload: form }));
      console.log('Form Data after dispatch:', form);
      console.log('State after dispatch:', this.store.select(fromApp.selectFormData));
      this.router.navigate(["next"]);
       }
  }
  audioRequest(){
      this.playBase64Audio();
    };
  
  playBase64Audio() {
    const audio = new Audio();
    audio.src = 'data:audio/mp3;base64,' + this.base64; // Adjust the type if needed
    audio.load();
    audio.play();
  }
  toggleProcedure(value: string) {
    this.selectedProcedure = value;
  }
  
  resetCaptcha(){
    this.webService.get("api/text/helloWorld").subscribe((resp: any) =>{
      console.log(resp);
      this.captcha = resp.captcha;
      this.base64 = resp.base64Value;
      
    });
  }
}
