import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { HomeComponent } from './home/home.component';
import { NextComponent } from './next/next.component';
import { HeaderComponent } from './header/header.component';
import { ProcedureComponent } from './procedure/procedure.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { reducers , metaReducers} from './store/root.reducer';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CancelComponent } from './cancel/cancel.component';
import { BchangeComponent } from './bchange/bchange.component';
import { TrainDetailsComponent } from './train-details/train-details.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BprocedureComponent } from './bprocedure/bprocedure.component';
import { WebService } from './service/web.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NextComponent,
    HeaderComponent,
    ProcedureComponent,
    FooterComponent,
    CancelComponent,
    BchangeComponent,
    TrainDetailsComponent,
    BprocedureComponent
  ],
  imports: [
    ConfirmDialogModule,
    HttpClientModule,
    BrowserModule,
    StoreModule.forRoot( reducers , {metaReducers}),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule
  ],
  providers: [
    provideClientHydration(),
    ConfirmationService,
    MessageService,
    WebService
  ],
  bootstrap: [AppComponent,]
})
export class AppModule { }
