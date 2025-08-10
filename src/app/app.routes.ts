import { Routes } from '@angular/router';
import { JSConcurrency } from './js-concurrency/js-concurrency.component';
import { Home } from './home/home.component';
import { LicensePlate } from './license-plate/license-plate.component';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'exercise-one', component: JSConcurrency},
  {path: 'exercise-two', component: LicensePlate}
];
