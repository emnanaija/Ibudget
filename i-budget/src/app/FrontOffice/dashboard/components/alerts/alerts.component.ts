import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-container">
      <img
        src="/Prédictions_financières_avec_iBudget-removebg-preview.png"
        alt="Person holding phone with app display"
        class="modern-image"
      />

    </div>
  `,
  styles: [`
    .image-container {
      position: relative;
      max-width: 100%;
      overflow: hidden;
      right:0;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    }

    .image-container:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
    }

    .modern-image {
      width: 100%;
      display: block;
      transition: transform 0.5s ease;
    }

    .image-container:hover .modern-image {
      transform: scale(1.03);
    }

    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      padding: 20px;
      color: white;
      text-align: center;
    }


  `]
})
export class AlertsComponent {

}
