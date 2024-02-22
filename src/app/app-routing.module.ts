import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NextComponent } from './next/next.component';
import { CancelComponent } from './cancel/cancel.component';
import { BchangeComponent } from './bchange/bchange.component';


const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "next", component: NextComponent},
  {path: "cancel" , component: CancelComponent},
  {path: "bchange" , component: BchangeComponent},

  {path: "**", redirectTo: "home"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
