import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-animated-background',
  standalone: true,
  template: `
    <div class="animated-background">
      <div class="liquid-bg">
        <div class="liquid-blob blob1"></div>
        <div class="liquid-blob blob2"></div>
        <div class="liquid-blob blob3"></div>
      </div>
      <div class="particles-container"></div>
      <div class="coin-container">
        <div class="coin gsap-coin1"></div>
        <div class="coin gsap-coin2"></div>
        <div class="coin gsap-coin3"></div>
        <div class="coin gsap-coin4"></div>
        <div class="coin gsap-coin5"></div>
        <div class="coin gsap-coin6"></div>
      </div>
    </div>
  `,
  styleUrls: ['./animated-background.component.css']
})
export class AnimatedBackgroundComponent implements AfterViewInit, OnDestroy {
  private animationFrameId: number = 0;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      this.initGsapAnimations();
    }, 300);
  }

  ngOnDestroy(): void {
    // Clean up animations if necessary
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  initLiquidBackground(): void {
    // Check if we're in a browser environment before accessing document
    if (typeof document !== 'undefined') {
      const blobs = document.querySelectorAll('.liquid-blob');
  
      // Set initial random positions
      blobs.forEach((blob: any) => {
        gsap.set(blob, {
          x: gsap.utils.random(-100, 100),
          y: gsap.utils.random(-100, 100),
          scale: gsap.utils.random(0.3, 1.1)
        });
      });
  
      // Create faster, more fluid animations for each blob
      blobs.forEach((blob: any) => {
        // Create a timeline for this blob
        const tl = gsap.timeline({
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.2, // Reduced delay
          defaults: {
            duration: gsap.utils.random(2, 10), // Faster duration
            ease: "sine.inOut"
          }
        });
  
        // Add animations to the timeline with more dramatic movements
        tl.to(blob, {
          x: gsap.utils.random(-250, 250), // More movement
          y: gsap.utils.random(-250, 250),
          scale: gsap.utils.random(0.7, 1.8), // More scale variation
          rotation: gsap.utils.random(-15, 15) // More rotation
        })
          .to(blob, {
            x: gsap.utils.random(-250, 250),
            y: gsap.utils.random(-250, 250),
            scale: gsap.utils.random(0.7, 1.8),
            rotation: gsap.utils.random(-15, 15)
          })
          .to(blob, {
            x: gsap.utils.random(-250, 250),
            y: gsap.utils.random(-250, 250),
            scale: gsap.utils.random(0.7, 1.8),
            rotation: gsap.utils.random(-15, 15)
          });
  
        // Start the timeline at a random position
        tl.progress(Math.random());
      });
    }
  }

  initGsapAnimations(): void {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      return; // Skip animation initialization in SSR
    }
    
    // Call initLiquidBackground only in browser environment
    this.initLiquidBackground();
    
    // Create a timeline for background effects
    const bgTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true
    });

    // Check if animated-background exists before animating it
    const animatedBg = document.querySelector('.animated-background');
    if (animatedBg) {
      bgTimeline.to('.animated-background', {
        backgroundPosition: '100% 100%',
        duration: 20,
        ease: 'sine.inOut'
      });
    }

    // Add coin animations
    this.animateCoins();

    // Add magnetic effect to coins
    this.addMagneticEffect();
  }

  private animateCoins(): void {
    const coins = document.querySelectorAll('.coin');

    // If no coins found, exit
    if (coins.length === 0) {
      console.warn('No coin elements found');
      return;
    }

    // Animate each coin
    coins.forEach((coin: any, index: number) => {
      // Create a timeline for this coin
      const timeline = gsap.timeline({
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.1,
      });

      // Random starting position
      gsap.set(coin, {
        x: gsap.utils.random(-50, 50),
        y: gsap.utils.random(-50, 50),
        rotation: gsap.utils.random(-180, 180),
        opacity: gsap.utils.random(0.7, 1)
      });

      // Add animations to timeline
      timeline.to(coin, {
        x: gsap.utils.random(-150, 150),
        y: gsap.utils.random(-150, 150),
        rotation: gsap.utils.random(-360, 360),
        duration: gsap.utils.random(10, 20),
        ease: "sine.inOut",
        delay: index * 0.2
      })
        .to(coin, {
          x: gsap.utils.random(-200, 200),
          y: gsap.utils.random(-200, 200),
          rotation: gsap.utils.random(-720, 720),
          duration: gsap.utils.random(15, 25),
          ease: "sine.inOut"
        })
        .to(coin, {
          x: gsap.utils.random(-100, 100),
          y: gsap.utils.random(-100, 100),
          rotation: gsap.utils.random(-180, 180),
          duration: gsap.utils.random(10, 20),
          ease: "sine.inOut"
        });

      // Start the timeline at a random position
      timeline.progress(Math.random());
    });
  }

  private addMagneticEffect(): void {
    const coins = document.querySelectorAll('.coin');
    const container = document.querySelector('.animated-background');

    if (!container) return;

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;

    // Update mouse position
    container.addEventListener('mousemove', (e: Event) => {
      // Cast the event to MouseEvent to access clientX and clientY
      const mouseEvent = e as MouseEvent;
      mouseX = mouseEvent.clientX;
      mouseY = mouseEvent.clientY;

      // Apply magnetic effect to each coin
      coins.forEach((coin: any) => {
        const coinRect = coin.getBoundingClientRect();
        const coinX = coinRect.left + coinRect.width / 2;
        const coinY = coinRect.top + coinRect.height / 2;

        // Calculate distance between mouse and coin
        const distX = mouseX - coinX;
        const distY = mouseY - coinY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Magnetic field radius
        const radius = 300;

        if (distance < radius) {
          // Calculate repulsion force (stronger when closer)
          const force = (1 - distance / radius) * 50;

          // Direction of force (away from cursor)
          const dirX = -distX / distance;
          const dirY = -distY / distance;

          // Apply force with GSAP
          gsap.to(coin, {
            x: `+=${dirX * force}`,
            y: `+=${dirY * force}`,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    });
  }

  ngOnInit(): void {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Delay GSAP initialization to ensure DOM is ready
      setTimeout(() => {
        this.initGsapAnimations();
      }, 0);
    }
  }
}
