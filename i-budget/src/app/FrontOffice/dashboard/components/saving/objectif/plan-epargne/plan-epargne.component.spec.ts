import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanEpargneComponent } from './plan-epargne.component';

describe('PlanEpargneComponent', () => {
  let component: PlanEpargneComponent;
  let fixture: ComponentFixture<PlanEpargneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanEpargneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanEpargneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
