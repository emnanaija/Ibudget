import { Component, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

import { AnimatedBackgroundComponent } from '../components/animated-background/animated-background.component';
import { StatsComponent } from '../components/stats/stats.component';
import { SavingsComponent } from '../components/savings/savings.component';
import { BalanceComponent } from '../components/balance/balance.component';
import { AlertsComponent } from '../components/alerts/alerts.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { CardContainerComponent } from '../components/card-container/card-container.component';
import { MoneyGoComponent } from '../components/money-go/money-go.component';
import { SaveMoreComponent } from '../components/save-more/save-more.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AnimatedBackgroundComponent, // Add the new background component
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


  private renderer!: THREE.WebGLRenderer;
  private card!: THREE.Object3D;
  private animationFrameId: number = 0;


  // Sidebar state
  isSidebarCollapsed = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Small delay to ensure DOM is ready

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


}
