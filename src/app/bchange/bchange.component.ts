import { Component } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';


@Component({
  selector: 'app-bchange',
  templateUrl: './bchange.component.html',
  styleUrl: './bchange.component.css'
})
export class BchangeComponent {
  isConfirmed = false;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

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
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
    
  }
  
  resetConfirmation() {
    this.isConfirmed = false;
  }
}


