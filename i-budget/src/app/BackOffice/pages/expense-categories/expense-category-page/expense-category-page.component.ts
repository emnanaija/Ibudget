import { CommonModule } from '@angular/common';
import { ExpenseCategoryComponent } from '../../../expenses/expense-category/expense-category.component'; // Corrige le chemin si nécessaire
import { Component, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SidebarComponent } from '../../../expenses/sidebar/sidebar.component';
import { HeaderComponent } from '../../../expenses/header/header.component';

import { CategoryListComponent } from '../../../expenses/category-list/category-list.component';  // Importer le composant de la liste
import { AnimatedBackgroundComponent } from '../../../../FrontOffice/dashboard/components/animated-background/animated-background.component';
import {BackofficeNavbarComponent} from '../../../BackofficeNavbarComponent/BackofficeNavbarComponent';

import { gsap } from 'gsap';
@Component({
  selector: 'app-expense-category-page',
  templateUrl: './expense-category-page.component.html',
  styleUrls: ['./expense-category-page.component.css'],
  standalone: true,
  imports: [CommonModule, ExpenseCategoryComponent, SidebarComponent, CategoryListComponent,HeaderComponent,AnimatedBackgroundComponent,BackofficeNavbarComponent]  // Import de ton composant standalone
})
export class ExpenseCategoryPageComponentback {
  isSidebarCollapsed = false;

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
