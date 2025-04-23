import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { Subscription, fromEvent } from 'rxjs';
import { pairwise, map, filter } from 'rxjs/operators';
import { AnimatedBackgroundComponent } from '../../FrontOffice/components/animated-background/animated-background.component';
import { UserService } from '../../services/user.service'; // Import your user service
import { TransactionService } from '../../services/transaction.service';
import {AccountService} from '../../services/account.service'; // Import your transaction service

gsap.registerPlugin(CSSPlugin);
@Component({
  selector: 'app-accounts-management',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AnimatedBackgroundComponent],
  templateUrl: './accounts-management.component.html',
  styleUrl: './accounts-management.component.css'
})
export class AccountsManagementComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('header') headerRef!: ElementRef;
  @ViewChild('nav') navRef!: ElementRef;
  @ViewChild('content') contentRef!: ElementRef;
  @ViewChild('movingBackground') movingBackgroundRef!: ElementRef;

  @Input() userId: number = 0; // Add input property to receive userId

  // Add properties to store user and account data
  userData: any = null;
  accountData: any = null;
  isLoading: boolean = true;

  private routerEventsSubscription: Subscription | undefined;

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    // Load user data if userId is provided
    if (this.userId > 0) {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    this.isLoading = true;

    // Load user information
    this.userService.getUserById(this.userId).subscribe({
      next: (userData) => {
        this.userData = userData;
        this.loadAccountData();
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.isLoading = false;
      }
    });
  }

  loadAccountData(): void {
    // Load account information based on userId
    this.accountService.getAccountById(this.userId).subscribe({
      next: (accountData) => {
        this.accountData = accountData;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading account data:', error);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.headerRef && this.navRef && this.contentRef) {
      this.animateElements();
    }

    if (this.movingBackgroundRef) {
      this.setupMovingBackground();
    }
  }

  ngOnDestroy(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
  animateElements(): void {
    const header = this.headerRef.nativeElement;
    const navLinks = this.navRef.nativeElement.querySelectorAll('a');
    const separator = this.navRef.nativeElement.querySelectorAll('.nav-separator');
    const content = this.contentRef.nativeElement;

    gsap.fromTo(header, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });

    gsap.fromTo(
      [...navLinks, ...separator],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
    );

    gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.5, ease: 'power1.in' });

    this.routerEventsSubscription = fromEvent(window, 'popstate')
      .pipe(
        map(() => window.location.pathname),
        pairwise(),
        filter(([prev, curr]) => prev.includes('accounts') && curr.includes('accounts'))
      )
      .subscribe(() => {
        gsap.fromTo(content, { opacity: 0.5, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power1.out' });
      });
  }

  setupMovingBackground(): void {
    const bgElement = this.movingBackgroundRef.nativeElement;
    const colors = ['#a7baba', '#485b80', '#d3d3d3']; // Dark pastel colors
    let i = 0;

    gsap.to(bgElement, {
      background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[0]})`,
      backgroundSize: '300% 300%',
      duration: 5,
      ease: 'linear',
      repeat: -1,
      yoyo: true,
      onUpdate: () => {
        i++;
        if (i % 100 === 0) {
          const nextColors = [colors[(i / 100) % colors.length], colors[((i / 100) + 1) % colors.length], colors[((i / 100) + 2) % colors.length]];
          gsap.to(bgElement, {
            background: `linear-gradient(45deg, ${nextColors[0]}, ${nextColors[1]}, ${nextColors[2]}, ${nextColors[0]})`,
            duration: 3,
            ease: 'power1.inOut'
          });
        }
      }
    });
  }
}
