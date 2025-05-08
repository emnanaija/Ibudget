import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SidebarComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
