import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2, AfterViewInit } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit, AfterViewInit {
  @ViewChild('card', { static: true }) card!: ElementRef;

  mouseX = 0;
  mouseY = 0;
  cardTiltX = 0;
  cardTiltY = 0;
  particles: any[] = [];
  isFlipped = false;
  lastClickTime = 0;

  balanceAmount = '10,000 TND';

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.setupCardAnimation();
  }

  ngAfterViewInit(): void {
    this.createParticles();
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;

    // Add a subtle bounce effect when flipping
    gsap.to(this.card.nativeElement, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const currentTime = new Date().getTime();
    const timeSinceLastClick = currentTime - this.lastClickTime;

    // Double click detection (300ms threshold)
    if (timeSinceLastClick < 300) {
      this.flipCard();
      event.preventDefault();
    }

    this.lastClickTime = currentTime;
  }


  setupCardAnimation(): void {
    gsap.ticker.add(() => {
      const cardWidth = this.card.nativeElement.offsetWidth;
      const cardHeight = this.card.nativeElement.offsetHeight;
      const centerX = cardWidth / 2;
      const centerY = cardHeight / 2;

      // Smooth follow for mouse position
      this.cardTiltX += (this.mouseX - centerX - this.cardTiltX) * 0.1;
      this.cardTiltY += (this.mouseY - centerY - this.cardTiltY) * 0.1;

      const rotateY = (this.cardTiltX / centerX) * 10;
      const rotateX = -(this.cardTiltY / centerY) * 10;

      // Apply 3D transform with perspective
      gsap.to(this.card.nativeElement, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 1.5,
        ease: 'power2.out'
      });

      // Move glare based on mouse position
      const glare = this.card.nativeElement.querySelector('.card-glare');
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
    const rect = this.card.nativeElement.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    // Reset card position when mouse leaves
    gsap.to(this.card.nativeElement, {
      rotateX: 0,
      rotateY: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    });

    // Reset glare position
    const glare = this.card.nativeElement.querySelector('.card-glare');
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
