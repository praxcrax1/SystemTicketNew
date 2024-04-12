import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { WebService } from '../service/web.service';
import * as rootReducer from '../store/root.reducer';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.css'
})
export class CancelComponent implements OnInit{
  isConfirmed = false;
  selectedPassengers: boolean[] = [];
  totalPassengersSelected: any;
  private subscriptions: Subscription[] = [];
  token: string = 'NNNNNN';
  display: any;
  cancellationResponse: any;
  changeToCan: string[];
  totalDeductedAmount: any;
  totalRefundedAmount : any;


  constructor(private webservice: WebService,private router: Router,private store: Store<rootReducer.State>,private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit() {

    //Getting form data from the store

    this.subscriptions.push(
      this.store.select(rootReducer.getFormData)
        .subscribe((DisplayData) => {
          this.display = DisplayData;
        })
    );
  }
  confirmCancellation() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      acceptLabel:"OK",
      rejectLabel:"Cancel",
      acceptVisible: true,
      rejectVisible: true,
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'You have accepted' });
        this.isConfirmed = true;
        let numberOfPassengers = this.totalPassengersSelected;
        let requestData = {
          pnrEnquiryResponseDTO: this.display.pnrEnquiryResponseDTO,
          noOfCanPsng: numberOfPassengers,
          systktCanOtpId: this.display.systktCanOtpId,
          cancelToken: this.token
        }
        this.webservice.post("api/text/confirmation", requestData).subscribe((resp: any) => {
          console.log(resp);
          this.cancellationResponse = JSON.parse(resp.cancellationResponse);
          console.log(this.cancellationResponse);
          console.log(this.display);
          if(this.cancellationResponse.success){
          this.totalDeductedAmount = Array.isArray(this.cancellationResponse.psgnAmountDeducted)
            ? this.cancellationResponse.psgnAmountDeducted.reduce((acc, curr) => acc + parseInt(curr), 0)
            : this.cancellationResponse.psgnAmountDeducted;
          this.totalRefundedAmount = Array.isArray(this.cancellationResponse.psgnAmountRefunded)
            ? this.cancellationResponse.psgnAmountRefunded.reduce((acc, curr) => acc + parseInt(curr), 0)
            : this.cancellationResponse.psgnAmountRefunded;
          }
          else{
            this.confirmationService.confirm({
              message: `Something went wrong! Please be patient while we fix it.`,
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
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
    
  }
  
  toggleSelected(index: number) {
    this.selectedPassengers[index] = !this.selectedPassengers[index];
    this.totalPassengersSelected = this.selectedPassengers.filter(selected => selected).length;
    this.updateToken();
  }
  updateToken() {
    this.token = 'NNNNNN';
    for (let i = 0; i < this.selectedPassengers.length; i++) {
      if (this.selectedPassengers[i]) {
        this.token = this.token.substring(0, i) + 'Y' + this.token.substring(i + 1);
      }
    }
  }

  resetConfirmation() {
    this.isConfirmed = false;
  }
  goBack() {
    this.router.navigate(['home']);
  }
  allTicketsCancelled(){
    return this.display.pnrEnquiryResponseDTO.passengerList.every(passenger => passenger.currentStatus === 'CAN');
  }
  isAnyPassengerSelected(): boolean {
    return this.selectedPassengers.some(selected => selected);
  }
  printPage() {
    window.print()
  } 

}

