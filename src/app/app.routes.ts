import { Routes } from '@angular/router';
import { JSConcurrency } from './js-concurrency/js-concurrency.component';
import { Home } from './home/home.component';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'exercise-one', component: JSConcurrency}
];
