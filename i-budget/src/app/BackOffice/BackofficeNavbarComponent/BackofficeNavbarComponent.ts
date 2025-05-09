import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backoffice-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="backoffice-navbar">
      <div class="navbar-header">
        <div class="logo">
          <i class="fa-solid fa-briefcase logo-icon"></i>
          <span class="logo-text">Admin</span>
        </div>
      </div>

      <div class="navbar-links">
        <a [routerLink]="['/dashboard']"
           routerLinkActive="active"
           class="nav-item">
          <div class="icon-container">
            <i class="fa-solid fa-chart-line nav-icon"></i>
          </div>
          <span class="nav-text">Dashboard</span>
        </a>

        <a [routerLink]="['/accounts']"
           routerLinkActive="active"
           class="nav-item">
          <div class="icon-container">
            <i class="fa-solid fa-landmark nav-icon"></i>
          </div>
          <span class="nav-text">Accounts</span>
        </a>

        <a [routerLink]="['/transactions']"
           routerLinkActive="active"
           class="nav-item">
          <div class="icon-container">
            <i class="fa-solid fa-money-bill-transfer nav-icon"></i>
          </div>
          <span class="nav-text">Transactions</span>
        </a>

        <a [routerLink]="['/investment']"
           routerLinkActive="active"
           class="nav-item">
          <div class="icon-container">
            <i class="fa-solid fa-coins nav-icon"></i> </div>
          <span class="nav-text">Investissement</span>
        </a>

        <a [routerLink]="['/depensesReccurentesback']"
           routerLinkActive="active"
           class="nav-item">
          <div class="icon-container">
            <i class="fa-solid fa-calendar-check nav-icon"></i>
          </div>
          <span class="nav-text">Recurring Expenses</span>
        </a>


        <a [routerLink]="['/fetesback']"
           routerLinkActive="active"
           class="nav-item">
          <div class="icon-container">
            <i class="fa-solid fa-gift nav-icon"></i> </div>
          <span class="nav-text">Events</span>
        </a>

        <a [routerLink]="['/depensesback']"
           routerLinkActive="active"
           class="nav-item">
          <div class="icon-container">
            <i class="fa-solid fa-receipt nav-icon"></i>
          </div>
          <span class="nav-text">Expenses</span>
        </a>
        <a [routerLink]="['/wallets']"
           routerLinkActive="active"
           class="nav-item">
          <div class="icon-container">
            <i class="fa-solid fa-receipt nav-icon"></i>
          </div>
          <span class="nav-text">Expenses</span>
        </a>
        <a [routerLink]="['/savingAd']"
           routerLinkActive="active"
           class="nav-item">
          <div class="icon-container">
            <i class="fa-solid fa-receipt nav-icon"></i>
          </div>
          <span class="nav-text">Expenses</span>
        </a>
      </div>

      <div class="navbar-footer">
        <a class="logout-btn">
          <div class="icon-container">
            <i class="fa-solid fa-right-from-bracket logout-icon"></i>
          </div>
          <span class="logout-text">Logout</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

    .backoffice-navbar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      backdrop-filter: blur(15px);
      width: 90px;
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
      width: 220px;
    }

    .navbar-header {
      padding: 0 15px;
      margin-bottom: 20px;
      width: 100%;
      flex-shrink: 0;
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
      color: #60a5fa;
      transition: transform 0.3s ease, color 0.3s ease;
    }

    .backoffice-navbar:hover .logo-icon {
      transform: rotate(360deg);
    }

    .logo-text {
      font-family: "Century Gothic", sans-serif;
      font-weight: bold;
      font-size: 18px;
      white-space: nowrap;
      opacity: 0;
      transform: translateX(-10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .backoffice-navbar:hover .logo-text,
    .backoffice-navbar:hover .nav-text,
    .backoffice-navbar:hover .logout-text {
      opacity: 1;
      transform: translateX(0);
    }

    .navbar-links {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
      padding: 0 5px;
      /* Styling the scrollbar */
      scrollbar-width: thin;
      scrollbar-color: rgba(96, 165, 250, 0.3) transparent;
    }

    /* For WebKit browsers (Chrome, Safari) */
    .navbar-links::-webkit-scrollbar {
      width: 4px;
    }

    .navbar-links::-webkit-scrollbar-track {
      background: transparent;
    }

    .navbar-links::-webkit-scrollbar-thumb {
      background-color: rgba(96, 165, 250, 0.3);
      border-radius: 20px;
    }

    .navbar-links::-webkit-scrollbar-thumb:hover {
      background-color: rgba(96, 165, 250, 0.5);
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px;
      margin: 6px 0;
      width: 90%;
      border-radius: 12px;
      font-family: "Century Gothic", sans-serif;
      text-decoration: none;
      color: #cbd5e1;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: white;
      transform: translateX(5px);
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

    .icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      margin-right: 15px;
      background: rgba(255, 255, 255, 0.08);
      transition: all 0.3s ease;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }

    .backoffice-navbar:not(:hover) .icon-container {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(139, 92, 246, 0.1));
      border-radius: 12px;
      margin: 0 auto;
    }

    .nav-item:hover .icon-container,
    .logout-btn:hover .icon-container {
      background: rgba(96, 165, 250, 0.2);
      transform: rotate(5deg);
    }

    .nav-item.active .icon-container {
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .nav-icon, .logout-icon {
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #cbd5e1;
      transition: all 0.3s ease;
    }

    .backoffice-navbar:not(:hover) .nav-icon,
    .backoffice-navbar:not(:hover) .logout-icon {
      font-size: 18px;
      color: #60a5fa;
    }

    .backoffice-navbar:not(:hover) .nav-item.active .nav-icon {
      color: white;
    }

    .nav-item:hover .nav-icon,
    .logout-btn:hover .logout-icon {
      color: #60a5fa;
      transform: scale(1.1);
    }

    .nav-item.active .nav-icon {
      color: white;
    }

    .nav-text, .logout-text {
      white-space: nowrap;
      opacity: 0;
      transform: translateX(-10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      font-weight: 500;
      font-size: 14px;
    }

    .navbar-footer {
      margin-top: auto;
      width: 100%;
      padding: 15px;
      flex-shrink: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
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
      transform: translateX(5px);
    }

    .logout-btn:hover .logout-icon {
      color: #f87171;
    }

    /* Media query for shorter screens */
    @media screen and (max-height: 600px) {
      .navbar-header {
        margin-bottom: 10px;
      }

      .nav-item {
        padding: 8px;
        margin: 4px 0;
      }

      .icon-container {
        width: 32px;
        height: 32px;
      }
    }
  `]
})
export class BackofficeNavbarComponent {
  // Add any component logic here if needed
}
