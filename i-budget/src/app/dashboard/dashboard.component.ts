import { Component, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransactionsComponent } from '../transactions/transactions.component';
import { StatsComponent } from '../stats/stats.component';
import { SavingsComponent } from '../savings/savings.component';
import { BalanceComponent } from '../balance/balance.component';
import { AlertsComponent } from '../alerts/alerts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TransactionsComponent,
    StatsComponent,
    SavingsComponent,
    BalanceComponent,
    AlertsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('3d-card') cardCanvas!: ElementRef;
  
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
      this.initThreeJS();
    }, 100);
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

  private initThreeJS(): void {
    const canvas = this.cardCanvas.nativeElement;
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
