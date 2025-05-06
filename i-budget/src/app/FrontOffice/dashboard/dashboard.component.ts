import { Component, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

import { AnimatedBackgroundComponent } from './components/animated-background/animated-background.component';
import { StatsComponent } from './components/stats/stats.component';
import { SavingsComponent } from './components/savings/savings.component';
import { BalanceComponent } from './components/balance/balance.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { CardContainerComponent } from './components/card-container/card-container.component';
import { MoneyGoComponent } from './components/money-go/money-go.component';
import { SaveMoreComponent } from './components/save-more/save-more.component';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import {MonteCarloSimulationComponent} from '../../BackOffice/MonteCarloSim/monte-carlo-simulation.component';
import { RouterModule } from '@angular/router';
gsap.registerPlugin(ScrollToPlugin);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    AnimatedBackgroundComponent, // Add the new background component
    StatsComponent,
    SavingsComponent,
    BalanceComponent,
    AlertsComponent,
    SidebarComponent,
    HeaderComponent,
    CardContainerComponent,
    MoneyGoComponent,
    SaveMoreComponent,
    MonteCarloSimulationComponent
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
  @ViewChild('contentArea') contentArea!: ElementRef;
  currentSection = 'section1';
  sections = ['section1', 'section2', 'section3', 'section4'];
  isScrolling = false;
  lastScrollTime = 0;

  ngAfterViewInit(): void {
    // Small delay to ensure DOM is ready
    this.setupScrollListeners();

    // Initialize GSAP animations
    this.setupAnimations();

  }
  setupScrollListeners(): void {
    const contentArea = this.contentArea.nativeElement;

    contentArea.addEventListener('scroll', () => {
      if (this.isScrolling) return;

      const now = new Date().getTime();
      if (now - this.lastScrollTime < 1000) return;

      // Find current section
      for (const section of this.sections) {
        const element = document.getElementById(section);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          if (this.currentSection !== section) {
            this.currentSection = section;
            this.updateActiveIndicator();
            this.animateSection(section);
          }
          break;
        }
      }
    });
  }
  setupAnimations(): void {
    // Pre-set animations for each section
    // Create timeline for each section
    this.sections.forEach(section => {
      const tl = gsap.timeline({ paused: true });

      // Different animation for each section
      if (section === 'section1') {
        tl.from(`#${section} .top-row > *`, {
          y: 100,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out"
        });
      } else if (section === 'section2') {
        tl.from(`#${section} .middle-row > *`, {
          scale: 0.8,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "back.out(1.7)"
        });
      } else if (section === 'section3') {
        tl.from(`#${section} .card-container-wrapper`, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "elastic.out(1, 0.7)"
        });
      } else if (section === 'section4') {
        tl.from(`#${section} .bottom-row > *`, {
          x: -50,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power1.out"
        });
      }

      // Store the timeline
      (window as any)[`timeline_${section}`] = tl;
    });

    // Play the first section animation
    this.animateSection('section1');
  }

  animateSection(section: string): void {
    // Play the timeline for this section
    const timeline = (window as any)[`timeline_${section}`];
    if (timeline) {
      timeline.restart();
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (!element) return;

    this.isScrolling = true;
    this.lastScrollTime = new Date().getTime();

    // Smooth scroll to the section
    gsap.to(this.contentArea.nativeElement, {
      duration: 1,
      scrollTo: { y: element, offsetY: 60 },
      ease: "power2.inOut",
      onComplete: () => {
        this.isScrolling = false;
        this.currentSection = sectionId;
        this.updateActiveIndicator();
        this.animateSection(sectionId);
      }
    });
  }

  updateActiveIndicator(): void {
    const dots = document.querySelectorAll('.scroll-dot');
    dots.forEach((dot, index) => {
      if (this.sections[index] === this.currentSection) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
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
