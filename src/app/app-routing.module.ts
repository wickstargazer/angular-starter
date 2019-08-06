import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: './components/home/home.module#HomeModule'
  },
  {
    path: 'th',
    loadChildren: './components/home/home.module#HomeModule'
  },
  {
    path: 'en',
    loadChildren: './components/home/home.module#HomeModule'
  },
  {
    path: 'notfound',
    component: NotfoundComponent
  },
  // {
  //   path: ':lang/about',
  //   loadChildren: './components/about/about.module#AboutModule',
  // },
  { path: '**', redirectTo: '/notfound' }
];

@NgModule({
imports: [
  RouterModule.forRoot(routes, { initialNavigation: 'enabled', scrollPositionRestoration: 'enabled' })
],
exports: [RouterModule],
})
export class AppRoutingModule { }
export const rountingComponents = [
 
];
