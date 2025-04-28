import { Component } from '@angular/core';
import { AccountService, RechargeCard, SimCardAccount } from '../../../services/account.service';
import { CommonModule } from '@angular/common';
import {RechargeFormComponent} from './Components/recharge-form/recharge-form.component';
import {RechargeWithImageComponent} from './Components/recharge-with-image/recharge-with-image.component';
import {
  RechargeWithoutNotificationComponent
} from './Components/recharge-without-notification/recharge-without-notification.component';
import {GenerateCardsComponent} from './Components/generate-cards/generate-cards.component';

@Component({
  selector: 'app-recharge-account',
  standalone: true, // Make sure it's standalone if you're using standalone components
  imports: [
    RechargeFormComponent,
    GenerateCardsComponent,
    RechargeWithImageComponent,
    RechargeWithoutNotificationComponent,
    CommonModule,
  ],
  templateUrl: './recharge-account.component.html',
  styleUrl: './recharge-account.component.css'
})
export class RechargeAccountComponent {
  rechargeResult: any;
  rechargeError: string = '';
  isRecharging: boolean = false;
  generationResult: RechargeCard[] | null = null;
  generationError: string = '';
  isGenerating: boolean = false;
  imageRechargeResult: SimCardAccount | null = null;
  imageRechargeError: string = '';
  isRechargingWithImage: boolean = false;
  simCardIdForImage: number | null = null;
  rechargeResultNoNotify: SimCardAccount | null = null;
  errorMessageNoNotify: string = '';
  isLoadingNoNotify: boolean = false;
  previousBalanceNoNotify: number = 0;

  constructor(private accountService: AccountService) {}

  handleRecharge(rechargeData: { simCardId: number | null, rechargeCode: string }): void {
    this.isRecharging = true;
    this.rechargeError = '';
    this.rechargeResult = null;

    if (rechargeData.simCardId && rechargeData.rechargeCode) {
      this.accountService.rechargeAccount(rechargeData.simCardId, rechargeData.rechargeCode).subscribe({
        next: (data) => {
          this.rechargeResult = data;
          this.isRecharging = false;
          console.log('Account recharged:', data);
        },
        error: (error) => {
          this.rechargeError = 'Failed to recharge account.';
          this.isRecharging = false;
          console.error('Error recharging account:', error);
          this.rechargeResult = error;
        }
      });
    }
  }

  handleGenerateCards(generateData: { numberOfCards: number | null, rechargeAmount: number | null }): void {
    this.isGenerating = true;
    this.generationError = '';
    this.generationResult = null;

    if (generateData.numberOfCards && generateData.rechargeAmount) {
      this.accountService.generateRechargeCards(generateData.numberOfCards, generateData.rechargeAmount).subscribe({
        next: (data) => {
          this.generationResult = data;
          this.isGenerating = false;
          console.log('Recharge cards generated:', data);
        },
        error: (error) => {
          this.generationError = 'Failed to generate recharge cards.';
          this.isGenerating = false;
          console.error('Error generating recharge cards:', error);
          this.generationResult = null;
        }
      });
    }
  }

  handleRechargeWithImage(imageData: { simCardId: number | null, file: File }): void {
    this.isRechargingWithImage = true;
    this.imageRechargeError = '';
    this.imageRechargeResult = null;

    if (imageData.simCardId && imageData.file) {
      this.accountService.rechargeAccountWithImage(imageData.simCardId, imageData.file).subscribe({
        next: (data) => {
          this.imageRechargeResult = data;
          this.isRechargingWithImage = false;
          console.log('Account recharged with image:', data);
        },
        error: (error) => {
          this.imageRechargeError = 'Failed to recharge account with image.';
          this.isRechargingWithImage = false;
          console.error('Error recharging account with image:', error);
          this.imageRechargeResult = null;
        }
      });
    }
  }

  handleRechargeWithoutNotification(noNotifyData: { simCardId: number | null, rechargeCode: string }): void {
    this.isLoadingNoNotify = true;
    this.errorMessageNoNotify = '';
    this.rechargeResultNoNotify = null;

    if (noNotifyData.simCardId && noNotifyData.rechargeCode) {
      this.accountService.rechargeAccountWithoutNotification(noNotifyData.simCardId, noNotifyData.rechargeCode).subscribe({
        next: (data) => {
          this.previousBalanceNoNotify = this.rechargeResultNoNotify?.balance || 0;
          this.rechargeResultNoNotify = data;
          this.isLoadingNoNotify = false;
          console.log('Account recharged without notification:', data);
        },
        error: (error) => {
          this.errorMessageNoNotify = 'Failed to recharge account without notification.';
          this.isLoadingNoNotify = false;
          console.error('Error recharging without notification:', error);
          this.rechargeResultNoNotify = null;
        }
      });
    }
  }

  setSimCardIdForImage(id: number | null): void {
    this.simCardIdForImage = id;
  }
}
