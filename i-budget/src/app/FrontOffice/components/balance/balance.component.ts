import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2, AfterViewInit } from '@angular/core';
import gsap from 'gsap';
import { catchError } from 'rxjs/operators';

import { of } from 'rxjs';
import {User, UserService} from '../../../services/user.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
  imports: [CommonModule]
})
export class BalanceComponent implements OnInit, AfterViewInit {
  @ViewChild('card', { static: true }) card!: ElementRef;
  isFlipped = false;
  isAnimating = false;
  mouseX = 0;
  mouseY = 0;
  cardTiltX = 0;
  cardTiltY = 0;
  particles: any[] = [];


  // User data properties
  selectedUser: User | null = null;
  balanceAmount = '10,000 TND'; // Default value
  isLoadingUser = true;

  // Fallback user data in case API fails
  fallbackUser: User = {
    userId: 1,
    firstName: 'Rayen',
    lastName: 'Dridi',
    email: 'rayen.dridi@example.com',
    simCardAccount: {
      balance: 10000
    }
  };

  constructor(private renderer: Renderer2, private userService: UserService) { }

  ngOnInit(): void {
    this.setupCardAnimation();

    // Initialize with fallback data right away
    this.selectedUser = this.fallbackUser;
    this.updateBalanceDisplay();

    // Then try to load actual data
    this.loadUserData();
  }

  ngAfterViewInit(): void {
    this.createParticles();
  }

  // User data loading function with fallback
  loadUserData(): void {
    this.isLoadingUser = true;

    this.userService.getUserById(1)
      .pipe(
        catchError(error => {
          console.error('Error loading user:', error);
          // Already using fallback data, so just return that
          return of(this.fallbackUser);
        })
      )
      .subscribe(
        (user) => {
          if (user) {
            this.selectedUser = user;
            this.updateBalanceDisplay();
          }
          this.isLoadingUser = false;
        }
      );
  }

  // Helper method to update balance display
  updateBalanceDisplay(): void {
    if (this.selectedUser?.simCardAccount?.balance) {
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      this.balanceAmount = formatter.format(this.selectedUser.simCardAccount.balance) + ' TND';
    }
  }

  flipCard(): void {
    // Prevent multiple clicks during animation
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.isFlipped = !this.isFlipped;

    // Add a subtle scale effect when flipping
    gsap.to(this.card.nativeElement, {
      scale: 0.95,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        // Allow another flip after animation completes
        setTimeout(() => {
          this.isAnimating = false;
        }, 300);
      }
    });
  }

  setupCardAnimation(): void {
    gsap.ticker.add(() => {
      // Only apply tilt effect when card is not flipped
      if (!this.isFlipped) {
        const cardWidth = this.card.nativeElement.offsetWidth;
        const cardHeight = this.card.nativeElement.offsetHeight;
        const centerX = cardWidth / 2;
        const centerY = cardHeight / 2;

        // Smooth follow for mouse position
        this.cardTiltX += (this.mouseX - centerX - this.cardTiltX) * 0.1;
        this.cardTiltY += (this.mouseY - centerY - this.cardTiltY) * 0.1;

        const rotateY = (this.cardTiltX / centerX) * 10;
        const rotateX = -(this.cardTiltY / centerY) * 10;

        // Apply 3D transform with perspective to the front card
        const frontCard = this.card.nativeElement.querySelector('.card-front');
        if (frontCard) {
          gsap.to(frontCard, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 1.5,
            ease: 'power2.out'
          });

          // Move glare based on mouse position
          const glare = frontCard.querySelector('.card-glare');
          if (glare) {
            const glareX = (this.cardTiltX / cardWidth) * 50;
            const glareY = (this.cardTiltY / cardHeight) * 50;
            gsap.to(glare, {
              x: glareX,
              y: glareY,
              duration: 1.5,
              ease: 'power2.out'
            });
          }
        }
      }
    });
  }

  createParticles(): void {
    const container = this.card.nativeElement.querySelector('.particles-container');
    if (!container) return;

    // Create 15 particles
    for (let i = 0; i < 15; i++) {
      const particle = this.renderer.createElement('div');
      this.renderer.addClass(particle, 'particle');

      // Random properties
      const size = Math.random() * 3 + 1;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const opacity = Math.random() * 0.4 + 0.1;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;

      // Set initial styles
      this.renderer.setStyle(particle, 'width', `${size}px`);
      this.renderer.setStyle(particle, 'height', `${size}px`);
      this.renderer.setStyle(particle, 'left', `${posX}%`);
      this.renderer.setStyle(particle, 'top', `${posY}%`);
      this.renderer.setStyle(particle, 'opacity', opacity);

      // Add to DOM
      this.renderer.appendChild(container, particle);

      // Animate particle
      this.animateParticle(particle, duration, delay);
    }
  }

  animateParticle(particle: HTMLElement, duration: number, delay: number): void {
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const endX = startX + (Math.random() * 40 - 20);
    const endY = startY + (Math.random() * 40 - 20);

    gsap.set(particle, {
      x: `${startX}%`,
      y: `${startY}%`
    });

    gsap.to(particle, {
      x: `${endX}%`,
      y: `${endY}%`,
      duration: duration,
      delay: delay,
      ease: 'sine.inOut',
      onComplete: () => {
        this.animateParticle(particle, duration, 0);
      }
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isFlipped) {
      const rect = this.card.nativeElement.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.isFlipped) {
      // Reset card position when mouse leaves
      const frontCard = this.card.nativeElement.querySelector('.card-front');
      if (frontCard) {
        gsap.to(frontCard, {
          rotateX: 0,
          rotateY: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.5)'
        });

        // Reset glare position
        const glare = frontCard.querySelector('.card-glare');
        if (glare) {
          gsap.to(glare, {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
          });
        }
      }
    }
  }
}
