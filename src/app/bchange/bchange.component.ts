import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Router } from '@angular/router';
import * as rootReducer from '../store/root.reducer';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { WebService } from '../service/web.service';


@Component({
  selector: 'app-bchange',
  templateUrl: './bchange.component.html',
  styleUrl: './bchange.component.css'
})
export class BchangeComponent implements OnInit, AfterViewInit {
  filteredStations: any;
  isConfirmed = false;
  private subscriptions: Subscription[] = [];
  display: any;
  staionArray: string[];
  stationCode: any;
  selectedStation: string;
  bChangeResponse: any;

  constructor(private webservice: WebService, private store: Store<rootReducer.State>, private route: Router, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select(rootReducer.getFormData)
        .subscribe((DisplayData) => {
          this.display = DisplayData;
          console.log(this.display);
        })
    );
    const boardingPointCode = this.display.pnrEnquiryResponseDTO.boardingPoint;
    this.filteredStations = this.display.boardingStnListDTO.boardingStationList.filter(station => {
      const [name, code] = station.stnNameCode.split(' - ');
      return code !== boardingPointCode;
    });
  }

  ngAfterViewInit() {
    this.updateSelectedStation(this.filteredStations[0].stnNameCode);
  }

  updateSelectedStation(selectedValue: string) {
    let stationArray = selectedValue.split(" - ");
    this.stationCode = stationArray[1];
    this.selectedStation = selectedValue;

  }


  confirmCancellation() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "OK",
      rejectLabel: "Cancel",
      acceptVisible: true,
      rejectVisible: true,
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'You have accepted' });
        this.isConfirmed = true;
        let requestData = {
          systktCanOtpId: this.display.systktCanOtpId,
          pnrEnquiryResponseDTO: this.display.pnrEnquiryResponseDTO,
          newBrdptCode: this.stationCode
        }
        this.webservice.post("api/text/confirmation", requestData).subscribe((resp: any) => {
          console.log(resp);
          this.bChangeResponse = resp.boardingPointChangeDTO;
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });

  }

  resetConfirmation() {
    this.isConfirmed = false;
  }
  goBack() {
    this.route.navigate(['home'])
  }
  printPage(){
    window.print()
  }
}


