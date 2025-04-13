// Fix imports at the top
import { Component, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransactionsComponent } from '../transactions/transactions.component';
import { StatsComponent } from '../stats/stats.component';
import { SavingsComponent } from '../savings/savings.component';
import { BalanceComponent } from '../balance/balance.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CardContainerComponent } from '../card-container/card-container.component';
import { MoneyGoComponent } from '../money-go/money-go.component';
import { SaveMoreComponent } from '../save-more/save-more.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TransactionsComponent,
    StatsComponent,
    SavingsComponent,
    BalanceComponent,
    AlertsComponent,
    SidebarComponent,
    HeaderComponent,
    CardContainerComponent,
    MoneyGoComponent,
    SaveMoreComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('card3d') cardCanvas!: ElementRef;
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private card!: THREE.Object3D;
  private animationFrameId: number = 0;
  private mouseX = 0;
  private mouseY = 0;
  private targetRotationX = 0;
  private targetRotationY = 0;
  private currentRotationX = 0;
  private currentRotationY = 0;

  // Sidebar state
  isSidebarCollapsed = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      // Initialize animations first
      this.initGsapAnimations();
      
      // Then initialize ThreeJS if the canvas is available
      if (this.cardCanvas?.nativeElement) {
        this.initThreeJS();
      } else {
        console.warn('Card canvas not available, skipping ThreeJS initialization');
      }
    }, 300); // Increased timeout to ensure DOM is fully ready
  }

  // GSAP animation methods
  private initLiquidBackground(): void {
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
  };
  
  // Add this new method to create liquid blobs dynamically
  private createLiquidBlobs(): void {
    console.log('Creating liquid blobs dynamically');
    const container = document.querySelector('.animated-background');
    
    if (!container) {
      console.error('No animated background container found');
      return;
    }
    
    // Create liquid-bg container if it doesn't exist
    let liquidBg = document.querySelector('.liquid-bg');
    if (!liquidBg) {
      liquidBg = document.createElement('div');
      liquidBg.className = 'liquid-bg';
      const liquidBgEl = liquidBg as HTMLElement;
      liquidBgEl.style.position = 'absolute';
      liquidBgEl.style.top = '0';
      liquidBgEl.style.left = '0';
      liquidBgEl.style.width = '100%';
      liquidBgEl.style.height = '100%';
      liquidBgEl.style.filter = 'blur(30px)';
      liquidBgEl.style.opacity = '0.8';
      liquidBgEl.style.overflow = 'hidden';
      container.appendChild(liquidBg);
    }
    
    // Create 3 blobs
    const colors = [
      'linear-gradient(90deg, #5000ff, #8000ff)',
      'linear-gradient(90deg, #ff0050, #ff0080)',
      'linear-gradient(90deg, #00c9ff, #92effd)'
    ];
    
    for (let i = 0; i < 3; i++) {
      const blob = document.createElement('div');
      blob.className = `liquid-blob blob${i+1}`;
      
      // Set inline styles
      blob.style.position = 'absolute';
      blob.style.borderRadius = '50%';
      blob.style.filter = 'blur(40px)';
      blob.style.mixBlendMode = 'screen';
      blob.style.willChange = 'transform';
      blob.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
      
      // Size and position
      const size = (60 - i*10) + 'vw';
      blob.style.width = size;
      blob.style.height = size;
      blob.style.background = colors[i];
      
      // Position
      if (i === 0) {
        blob.style.top = '20%';
        blob.style.left = '10%';
      } else if (i === 1) {
        blob.style.top = '30%';
        blob.style.right = '20%';
      } else {
        blob.style.bottom = '20%';
        blob.style.left = '30%';
      }
      
      (liquidBg as HTMLElement).appendChild(blob);
    }
    
    // Restart animations
    setTimeout(() => this.initLiquidBackground(), 100);
  }
  
  // Update your initGsapAnimations method to call the liquid background method
  private initGsapAnimations(): void {
    // Initialize the liquid background first
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
    
    // First, set initial positions for the coins
    const coins = document.querySelectorAll('.coin');
    if (coins.length === 0) {
      console.warn('No coin elements found');
      // Create coins dynamically if none exist
      this.createCoins();
      return;
    }
    
    // Rest of the method remains the same
    // ...
  }
  
  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  // Toggle sidebar visibility
  toggleSidebar(): void {
    console.log('Toggling sidebar, current state:', this.isSidebarCollapsed);
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    console.log('New sidebar state:', this.isSidebarCollapsed);
    
    // Force change detection
    setTimeout(() => {
      const sidebar = document.querySelector('.sidebar');
      const mainContent = document.querySelector('.main-content');
      
      if (sidebar) {
        if (this.isSidebarCollapsed) {
          sidebar.classList.add('collapsed');
        } else {
          sidebar.classList.remove('collapsed');
        }
      }
      
      if (mainContent) {
        if (this.isSidebarCollapsed) {
          mainContent.classList.add('sidebar-collapsed');
        } else {
          mainContent.classList.remove('sidebar-collapsed');
        }
      }
    }, 0);
  }

  // Add this new method to create coins dynamically
  private createCoins(): void {
    console.log('Creating coins dynamically');
    const container = document.querySelector('.dashboard-container') || document.body;
    
    // Create coin container if it doesn't exist
    let coinContainer = document.querySelector('.coin-container');
    if (!coinContainer) {
      coinContainer = document.createElement('div');
      coinContainer.className = 'coin-container';
      // Cast to HTMLElement to access style property
      const coinContainerEl = coinContainer as HTMLElement;
      coinContainerEl.style.position = 'absolute';
      coinContainerEl.style.top = '0';
      coinContainerEl.style.left = '0';
      coinContainerEl.style.width = '100%';
      coinContainerEl.style.height = '100%';
      coinContainerEl.style.pointerEvents = 'none';
      coinContainerEl.style.zIndex = '100';
      container.appendChild(coinContainer);
    }
    
    // Create 10 coins for more visual impact
    for (let i = 0; i < 10; i++) {
      const coin = document.createElement('div');
      coin.className = `coin gsap-coin${i+1}`;
      
      // Set inline styles to ensure they're applied
      coin.style.position = 'absolute';
      coin.style.top = `${gsap.utils.random(10, 90)}%`;
      coin.style.left = `${gsap.utils.random(10, 90)}%`;
      coin.style.width = '50px';
      coin.style.height = '50px';
      coin.style.borderRadius = '50%';
      coin.style.background = 'linear-gradient(145deg, #ffd700, #ffaa00)';
      coin.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.8)';
      coin.style.zIndex = '100';
      coin.style.display = 'flex';
      coin.style.alignItems = 'center';
      coin.style.justifyContent = 'center';
      coin.style.transform = 'translate3d(0, 0, 0)'; // Force hardware acceleration
      
      // Cast coinContainer to HTMLElement
      (coinContainer as HTMLElement).appendChild(coin);
      
      // Add dollar sign
      const text = document.createElement('span');
      text.textContent = '$';
      text.style.fontSize = '24px';
      text.style.fontWeight = 'bold';
      text.style.color = 'rgba(0, 0, 0, 0.5)';
      text.style.textShadow = '0 1px 1px rgba(255, 255, 255, 0.5)';
      coin.appendChild(text);
    }
    
    // Restart animations
    setTimeout(() => this.initGsapAnimations(), 100);
  }
  
  private addMagneticEffect(): void {
    const coins = document.querySelectorAll('.coin');
    const container = document.querySelector('.dashboard-container');
    
    if (!container) return;
    
    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    
    // Update mouse position - Fix the event type issue
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
    
    // Reset positions when mouse leaves - also fix this event listener
    container.addEventListener('mouseleave', () => {
      // Let coins return to their timeline paths
    });
  }
  
  private createParticles(): void {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    // Create 30 particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particlesContainer.appendChild(particle);
      
      // Style the particle
      gsap.set(particle, {
        position: 'absolute',
        width: gsap.utils.random(2, 6),
        height: gsap.utils.random(2, 6),
        backgroundColor: gsap.utils.random([
          'rgba(255, 215, 0, 0.6)',
          'rgba(255, 255, 255, 0.5)',
          'rgba(179, 0, 0, 0.5)',
          'rgba(0, 201, 255, 0.5)'
        ]),
        borderRadius: '50%',
        x: gsap.utils.random(0, window.innerWidth),
        y: gsap.utils.random(0, window.innerHeight),
        opacity: 0
      });
      
      // Animate the particle
      gsap.to(particle, {
        duration: gsap.utils.random(10, 20),
        x: gsap.utils.random(0, window.innerWidth),
        y: gsap.utils.random(0, window.innerHeight),
        opacity: gsap.utils.random(0.1, 0.4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 5)
      });
    }
  }

  private initThreeJS(): void {
    const canvas = this.cardCanvas?.nativeElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    // Three.js initialization
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      700
    );
    
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(3, 5, 5);
    this.scene.add(ambientLight, directionalLight);

    // Load 3D model
    const loader = new GLTFLoader();
    loader.load(
      '/assets/smoking_money_ps1.glb',
      (gltf) => {
        this.card = gltf.scene;
        this.scene.add(this.card);

        // Position and scale
        this.card.position.set(0, -0.2, 0);
        this.card.scale.set(4, 4, 4);
        this.camera.position.set(0, 0, 7);

        // Mouse interactions
        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        canvas.addEventListener('click', this.handleClick.bind(this));
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading 3D model:', error);
      }
    );

    // Start animation loop
    this.animate();
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.card) return;

    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.targetRotationX = mouseY * 0.4;
    this.targetRotationY = mouseX * 0.4;
  }

  private handleClick(): void {
    if (!this.card) return;

    this.card.rotation.x += Math.PI / 2;
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    // Smooth rotation
    this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.05;
    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.05;

    // Apply rotation to card
    if (this.card) {
      this.card.rotation.x = this.currentRotationX;
      this.card.rotation.y = this.currentRotationY;
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}
