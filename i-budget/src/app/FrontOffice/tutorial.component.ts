import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tutorial-container">
      <div class="character-container" (click)="toggleTutorial()">
        <img [src]="characterImageSrc" alt="Tutorial Character" class="tutorial-character" #characterImage />
        <div class="tutorial-indicator" *ngIf="!tutorialShown"></div>
      </div>

      <div class="speech-bubble" [class.active]="tutorialShown" #speechBubble>
        <div class="bubble-content">
          <p class="bubble-text">{{ currentMessage }}</p>
          <div class="bubble-controls">
            <button class="bubble-button prev" *ngIf="currentStep > 0" (click)="prevStep()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div class="bubble-progress">
              <span *ngFor="let dot of tutorialMessages; let i = index"
                    class="progress-dot"
                    [class.active]="i === currentStep"></span>
            </div>
            <button class="bubble-button next" *ngIf="currentStep < tutorialMessages.length - 1" (click)="nextStep()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            <button class="bubble-button close" (click)="closeTutorial()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tutorial-container {
      position: relative;
      z-index: 2000;
    }

    .character-container {
      position: relative;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .character-container:hover {
      transform: scale(1.05);
    }

    .tutorial-character {
      max-width: 100%;
      height: auto;
    }

    .tutorial-indicator {
      position: absolute;
      top: 100px;
      right: 10px;
      width: 15px;
      height: 15px;
      background: #ff4d4f;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(255, 77, 79, 0.8);
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(255, 77, 79, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
      }
    }

    .speech-bubble {
      position: absolute;
      top: 80px;
      right: 80%;
      width: 320px;
      background: rgba(28, 37, 65, 0.95);
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      padding: 20px;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      visibility: hidden;
      z-index: 1000;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .speech-bubble:after {
      content: '';
      position: absolute;
      right: -15px;
      top: 30px;
      border-width: 15px 0 15px 15px;
      border-style: solid;
      border-color: transparent transparent transparent rgba(28, 37, 65, 0.95);
    }

    .speech-bubble.active {
      opacity: 1;
      transform: translateY(0) scale(1);
      visibility: visible;
    }

    .bubble-content {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .bubble-text {
      color: #fff;
      font-size: 1rem;
      line-height: 1.5;
      margin: 0;
      font-family: 'Century Gothic', 'CenturyGothic', 'AppleGothic', sans-serif;
    }

    .bubble-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
    }

    .bubble-button {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      transition: all 0.2s ease;
    }

    .bubble-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .bubble-progress {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .progress-dot {
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .progress-dot.active {
      background: white;
      width: 10px;
      height: 10px;
    }

    @media (max-width: 768px) {
      .speech-bubble {
        width: 250px;
        top: -100px;
        right: 0;
      }

      .speech-bubble:after {
        right: 30px;
        top: 100%;
        border-width: 15px 15px 0 15px;
        border-color: rgba(28, 37, 65, 0.95) transparent transparent transparent;
      }
    }
  `]
})
export class TutorialComponent implements AfterViewInit {
  @Input() characterImageSrc: string = '';
  @Output() tutorialToggled = new EventEmitter<boolean>();

  @ViewChild('characterImage') characterImage!: ElementRef;
  @ViewChild('speechBubble') speechBubble!: ElementRef;

  tutorialShown: boolean = false;
  currentStep: number = 0;
  speechSynthesis: SpeechSynthesis | undefined;
  speechUtterance: SpeechSynthesisUtterance | undefined;

  tutorialMessages: string[] = [
    "Welcome to your Account Management! Here you can see your current balance and account details.",
    "Use the recharge form on the right to add funds to your account with a recharge code.",
    "Watch the cool animation as money flows into your wallet when you successfully recharge your account!"
  ];

  get currentMessage(): string {
    return this.tutorialMessages[this.currentStep];
  }

  ngAfterViewInit(): void {
    // Initialize with a small delay to ensure elements are rendered
    setTimeout(() => {
      this.animateCharacter();
    }, 500);

    // Initialize speech synthesis
    if (window.speechSynthesis) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  animateCharacter(): void {
    if (!this.characterImage?.nativeElement) return;

    gsap.to(this.characterImage.nativeElement, {
      y: -10,
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  }

  toggleTutorial(): void {
    this.tutorialShown = !this.tutorialShown;
    this.tutorialToggled.emit(this.tutorialShown);

    if (this.tutorialShown) {
      this.speakMessage(this.currentMessage);
      this.animateBubbleOpen();
    } else {
      this.stopSpeaking();
      this.animateBubbleClose();
    }
  }

  nextStep(): void {
    if (this.currentStep < this.tutorialMessages.length - 1) {
      this.stopSpeaking();
      this.currentStep++;
      this.speakMessage(this.currentMessage);
      this.animateTextChange();
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.stopSpeaking();
      this.currentStep--;
      this.speakMessage(this.currentMessage);
      this.animateTextChange();
    }
  }

  closeTutorial(): void {
    this.tutorialShown = false;
    this.stopSpeaking();
    this.animateBubbleClose();
    this.tutorialToggled.emit(false);
  }

  speakMessage(message: string): void {
    if (!this.speechSynthesis) return;

    this.stopSpeaking();

    this.speechUtterance = new SpeechSynthesisUtterance(message);
    this.speechUtterance.rate = 1.0;
    this.speechUtterance.pitch = 1.0;
    this.speechUtterance.volume = 1.0;

    // Optional: Select a specific voice (e.g., female or English)
    const voices = this.speechSynthesis.getVoices();
    const selectedVoice = voices.find(voice => voice.lang.includes('en') && voice.name.toLowerCase().includes('female')) || voices[0];
    if (selectedVoice) {
      this.speechUtterance.voice = selectedVoice;
    }

    this.speechSynthesis.speak(this.speechUtterance);
  }


  stopSpeaking(): void {
    if (this.speechSynthesis && this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }
  }

  animateBubbleOpen(): void {
    if (!this.speechBubble?.nativeElement) return;

    gsap.fromTo(
      this.speechBubble.nativeElement,
      {
        opacity: 0,
        scale: 0.8,
        y: 20,
        visibility: 'hidden'
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
        visibility: 'visible'
      }
    );
  }

  animateBubbleClose(): void {
    if (!this.speechBubble?.nativeElement) return;

    gsap.to(this.speechBubble.nativeElement, {
      opacity: 0,
      scale: 0.8,
      y: 20,
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => {
        gsap.set(this.speechBubble.nativeElement, { visibility: 'hidden' });
      }
    });
  }

  animateTextChange(): void {
    if (!this.speechBubble?.nativeElement) return;

    const textElement = this.speechBubble.nativeElement.querySelector('.bubble-text');
    if (!textElement) return;

    gsap.fromTo(
      textElement,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  }
}
