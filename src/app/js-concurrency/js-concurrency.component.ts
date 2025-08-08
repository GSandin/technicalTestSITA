import { Component } from "@angular/core";
import { environment } from "../../environtments/environment";
import { FormsModule } from "@angular/forms";
import { JSConcurrencyService } from "./services/js-concurrency,service";
import { CommonModule } from "@angular/common";
import { Observable } from "rxjs";

@Component({
  standalone: true,
  selector: 'js-concurrency',
  imports: [FormsModule, CommonModule],
  templateUrl: './js-concurrency.component.html',
  providers: [JSConcurrencyService]
})
export class JSConcurrency {

  maxConcurrency = environment.MAX_CONCURRENCY;
  urls = '';
  resultUrls$?: Observable<string[]>;

  constructor(
    private readonly jsConcurrencyService: JSConcurrencyService
  ) {}

  onSubmit(): void {
    const urls2Fetch = this.urls.split(',').map((url) => url.trim());
    this.resultUrls$ = this.jsConcurrencyService.fetchUsingRxjs(urls2Fetch);
  }
}
