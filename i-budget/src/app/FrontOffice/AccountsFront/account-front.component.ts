import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService, SimCardAccount } from '../../services/account.service';
import { AuthService } from '../../services/User/auth.service';
import { RechargeFormComponent } from '../../BackOffice/accounts/recharge-account/Components/recharge-form/recharge-form.component';
import { AnimatedBackgroundComponent } from '../dashboard/components/animated-background/animated-background.component';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { HeaderComponent } from '../dashboard/components/header/header.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-account-front',
  standalone: true,
  imports: [CommonModule, AnimatedBackgroundComponent, SidebarComponent, HeaderComponent, RechargeFormComponent],
  templateUrl: './account-front.component.html',
  styleUrls: ['./account-front.component.css']
})
export class AccountFrontComponent implements OnInit, AfterViewInit {
  isSidebarCollapsed: boolean = false;
  currentUserId: number | null = null;
  accountInfo: SimCardAccount | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  rechargeError: string = '';
  rechargeSuccessMessage: string = '';

  coins = new Array(5);
  moneyArray = new Array(6);

  @ViewChild('accountInfoSection', { static: false }) accountInfoSection?: ElementRef;
  @ViewChild('balanceAmount', { static: false }) balanceAmount?: ElementRef;
  @ViewChild('accountDetails', { static: false }) accountDetails?: ElementRef;
  @ViewChild('rechargeSection', { static: false }) rechargeSection?: ElementRef;
  @ViewChild('walletAnimation', { static: false }) walletAnimation?: ElementRef;
  @ViewChild('cardElement', { static: false }) cardElement?: ElementRef;

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.currentUserId = userId;
      this.loadAccountInfo(userId);
    } else {
      this.errorMessage = 'Unable to identify current user. Please log in again.';
    }
  }

  ngAfterViewInit(): void {
    this.animateAccountFront();
  }


  animateAccountFront(): void {
    if (!this.accountInfoSection || !this.balanceAmount || !this.accountDetails || !this.rechargeSection || !this.walletAnimation || !this.cardElement) {
      return;
    }

    const timeline = gsap.timeline();

    timeline.from(this.accountInfoSection.nativeElement, {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    });

    // Animate balance amount with scale and fade in
    timeline.from(this.balanceAmount.nativeElement, {
      duration: 0.6,
      scale: 0.8,
      opacity: 0,
      ease: 'back.out(1.7)'
    }, '-=0.4');

    // Counting number animation for balance amount
    const balanceValue = this.accountInfo?.balance || 0;
    const obj = { val: 0 };
    timeline.to(obj, {
      val: balanceValue,
      duration: 2,
      ease: 'power1.out',
      onUpdate: () => {
        if (this.balanceAmount) {
          this.balanceAmount.nativeElement.textContent = obj.val.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
        }
      }
    }, '-=0.3');

    // Floating coin-like animation on balance amount
    timeline.to(this.balanceAmount.nativeElement, {
      y: -10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      duration: 1.5
    }, '-=1.5');

    timeline.from(this.accountDetails.nativeElement, {
      duration: 0.6,
      x: -30,
      opacity: 0,
      ease: 'power2.out'
    }, '-=1.2');

    // Floating effect on recharge section
    timeline.from(this.rechargeSection.nativeElement, {
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.8');

    timeline.to(this.rechargeSection.nativeElement, {
      y: -10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      duration: 2
    }, '-=0.5');

    // Wallet and card recharge animation
    const wallet = this.walletAnimation.nativeElement.querySelector('.wallet');
    const walletFlap = this.walletAnimation.nativeElement.querySelector('.wallet-flap');
    const card = this.cardElement.nativeElement;
    const moneyElements = this.walletAnimation.nativeElement.querySelectorAll('.money');

    // Open wallet flap animation
    timeline.to(walletFlap, {
      duration: 0.6,
      rotationX: -75,
      transformOrigin: "top center",
      ease: "power2.out"
    }, 0);

    // Card slide and rotate animation
    timeline.to(card, {
      duration: 1,
      x: -60,
      y: -20,
      rotation: -15,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(card, { opacity: 1, x: 0, y: 0, rotation: 0 });
      }
    }, 0.5);

    // Money animation: all PNG images pop out of the wallet repeatedly with distinct animations
    const moneyImages = Array.from(moneyElements) as HTMLElement[];
    moneyImages.forEach((money, index) => {
      const delay = index * 0.5;
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, delay: delay });
      gsap.set(money, { opacity: 0, x: 0, y: 0, scale: 1, rotation: 0 });
      tl.to(money, {
        duration: 1,
        opacity: 1,
        x: 30 + index * 10,
        y: 20 + index * 10,
        rotation: 15 * (index % 2 === 0 ? 1 : -1),
        scale: 1.2,
        ease: "power1.inOut"
      });
      tl.to(money, {
        duration: 0.7,
        opacity: 0,
        x: 60 + index * 20,
        y: -30 - index * 20,
        rotation: 45 * (index % 2 === 0 ? -1 : 1),
        scale: 0.8,
        ease: "power2.in"
      });
    });

    // Close wallet flap after money animation
    timeline.to(walletFlap, {
      duration: 0.6,
      rotationX: 0,
      transformOrigin: "top center",
      ease: "power2.in"
    }, "+=3");
  }

  loadAccountInfo(userId: number): void {
    this.isLoading = true;
    this.accountService.getAccountById(userId).subscribe({
      next: (account) => {
        this.accountInfo = account;
        this.isLoading = false;
        // Trigger animations after account info is loaded
        setTimeout(() => {
          this.animateAccountFront();
        }, 0);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load account information.';
        this.isLoading = false;
      }
    });
  }

  handleRecharge(event: { simCardId: number | null; rechargeCode: string }): void {
    this.rechargeError = '';
    this.rechargeSuccessMessage = '';
    if (event.simCardId && event.rechargeCode) {
      this.accountService.rechargeAccount(event.simCardId, event.rechargeCode).subscribe({
        next: (updatedAccount) => {
          this.accountInfo = updatedAccount;
          this.rechargeSuccessMessage = 'Recharge successful!';
        },
        error: (error) => {
          this.rechargeError = 'Recharge failed. Please check the recharge code and try again.';
        }
      });
    }
  }

  // Removed duplicate animateAccountFront implementation to fix TS2393 error
}
