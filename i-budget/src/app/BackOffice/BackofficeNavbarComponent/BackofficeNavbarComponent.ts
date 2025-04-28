import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-backoffice-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="backoffice-navbar">
      <div class="navbar-header">
        <div class="logo">
          <span class="logo-icon">💼</span>
          <span class="logo-text">Admin</span>
        </div>
      </div>

      <div class="navbar-links">
        <a [routerLink]="['/dashboard']"
           routerLinkActive="active"
           class="nav-item">
          <span class="nav-icon">📊</span>
          <span class="nav-text">Dashboard</span>
        </a>

        <a [routerLink]="['/accounts']"
           routerLinkActive="active"
           class="nav-item">
          <span class="nav-icon">🏦</span>
          <span class="nav-text">Accounts</span>
        </a>

        <a [routerLink]="['/transactions']"
           routerLinkActive="active"
           class="nav-item">
          <span class="nav-icon">💸</span>
          <span class="nav-text">Transactions</span>
        </a>
      </div>

      <div class="navbar-footer">
        <a class="logout-btn">
          <span class="logout-icon">🚪</span>
          <span class="logout-text">Logout</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .backoffice-navbar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      backdrop-filter: blur(15px);
      width: 100px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 100;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
    }

    .backoffice-navbar:hover {
      width: 200px;
    }

    .navbar-header {
      padding: 0 15px;
      margin-bottom: 30px;
      width: 100%;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 12px;
    }

    .logo-icon {
      font-size: 24px;
      margin-right: 20px;
    }

    .logo-text {
      font-family: "Century Gothic", sans-serif;
      font-weight: bold;
      font-size: 18px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .backoffice-navbar:hover .logo-text,
    .backoffice-navbar:hover .nav-text,
    .backoffice-navbar:hover .logout-text {
      opacity: 1;
    }

    .navbar-links {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 15px;
      margin: 5px 0;
      width: 90%;
      border-radius: 12px;
      font-family: "Century Gothic", sans-serif;
      text-decoration: none;
      color: #cbd5e1;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: white;
    }

    .nav-item.active {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .nav-item.active::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, #3b82f6, #60a5fa);
      border-radius: 0 2px 2px 0;
    }

    .nav-icon, .logout-icon {
      font-size: 20px;
      margin-right: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
    }

    .nav-text, .logout-text {
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease;
      font-weight: 500;
    }

    .navbar-footer {
      margin-top: auto;
      width: 100%;
      padding: 20px 15px;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      padding: 12px;
      margin: 0 auto;
      width: 90%;
      border-radius: 12px;
      text-decoration: none;
      color: #cbd5e1;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .logout-btn:hover {
      color: #f87171;
      background-color: rgba(255, 255, 255, 0.05);
    }
  `]
})
export class BackofficeNavbarComponent {
  // Add any component logic here if needed
}
