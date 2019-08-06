import { NgModule } from '@angular/core';
import { CoreModule } from '../../core.module';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';


//
@NgModule({
  imports: [
    CommonModule,
    CoreModule.forRoot(),
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
  ],
  providers: [
  
  ],
})

export class HomeModule { }
