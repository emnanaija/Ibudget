import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  @ViewChild('card', { static: true }) card!: ElementRef;

  mouseX = 0;
  mouseY = 0;

  balanceAmount = '10,000 TND';

  constructor() { }

  ngOnInit(): void {
    this.setupCardAnimation();
  }

  setupCardAnimation(): void {
    gsap.ticker.add(() => {
      const cardWidth = this.card.nativeElement.offsetWidth;
      const cardHeight = this.card.nativeElement.offsetHeight;
      const centerX = cardWidth / 2;
      const centerY = cardHeight / 2;

      const deltaX = this.mouseX - centerX;
      const deltaY = this.mouseY - centerY;

      const rotateY = (deltaX / centerX) * 15;
      const rotateX = -(deltaY / centerY) * 15;

      gsap.to(this.card.nativeElement, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.card.nativeElement.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }
}