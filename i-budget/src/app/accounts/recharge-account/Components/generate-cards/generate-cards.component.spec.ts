import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCardsComponent } from './generate-cards.component';

describe('GenerateCardsComponent', () => {
  let component: GenerateCardsComponent;
  let fixture: ComponentFixture<GenerateCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
