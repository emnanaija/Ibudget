import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {RechargeCard} from '../../../../../services/account.service';


@Component({
  selector: 'app-generate-cards',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './generate-cards.component.html',
  styleUrl: './generate-cards.component.css'
})
export class GenerateCardsComponent {
  numberOfCards: number | null = null;
  rechargeAmount: number | null = null;
  @Input() isGenerating: boolean = false;
  @Input() generationError: string = '';
  @Input() generationResult: RechargeCard[] | null = null;

  @Output() generateCards = new EventEmitter<{ numberOfCards: number | null, rechargeAmount: number | null }>();

  generateClicked(): void {
    if (this.numberOfCards && this.rechargeAmount) {
      this.isGenerating = true;
      this.generationError = '';
      this.generateCards.emit({ numberOfCards: this.numberOfCards, rechargeAmount: this.rechargeAmount });
    } else {
      this.generationError = 'Please enter the number of cards and the amount.';
    }
  }

  setGenerating(generating: boolean): void {
    this.isGenerating = generating;
  }

  setGenerationError(error: string): void {
    this.generationError = error;
  }

  setGenerationResult(result: RechargeCard[] | null): void {
    this.generationResult = result;
  }
}
