import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LicensePlateService } from './services/license-plate.service';

@Component({
  standalone: true,
  selector: 'license-plate',
  imports: [FormsModule, CommonModule],
  templateUrl: './license-plate.component.html',
  providers: [LicensePlateService],
})
export class LicensePlate {
  numLicense?: number;
  license?: string;

  constructor(private readonly licensePlateService: LicensePlateService) {}

  public onSubmit(): void {
    if (this.numLicense !== undefined) {
      this.license = this.licensePlateService.generateLicense(this.numLicense);
    }
  }
}
