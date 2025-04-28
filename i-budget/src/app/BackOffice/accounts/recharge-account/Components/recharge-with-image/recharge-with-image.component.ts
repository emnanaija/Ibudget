import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {SimCardAccount} from '../../../../../services/account.service';

@Component({
  selector: 'app-recharge-with-image',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recharge-with-image.component.html',
  styleUrl: './recharge-with-image.component.css'
})
export class RechargeWithImageComponent {
  @Input() simCardId: number | null = null;
  selectedFile: File | null = null;
  @Input() isRechargingWithImage: boolean = false;
  @Input() imageRechargeError: string = '';
  @Input() imageRechargeResult: SimCardAccount | null = null;
  @Output() rechargeWithImage = new EventEmitter<{ simCardId: number | null, file: File }>();
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.fileSelected.emit(this.selectedFile);
    }
  }

  rechargeClicked(): void {
    if (this.simCardId && this.selectedFile) {
      this.isRechargingWithImage = true;
      this.imageRechargeError = '';
      this.rechargeWithImage.emit({ simCardId: this.simCardId, file: this.selectedFile });
    } else {
      this.imageRechargeError = 'Please enter Sim Card ID and select an image.';
    }
  }

  setRecharging(recharging: boolean): void {
    this.isRechargingWithImage = recharging;
  }

  setImageRechargeError(error: string): void {
    this.imageRechargeError = error;
  }

  setImageRechargeResult(result: SimCardAccount | null): void {
    this.imageRechargeResult = result;
  }

  setSimCardId(id: number | null): void {
    this.simCardId = id;
  }
}
