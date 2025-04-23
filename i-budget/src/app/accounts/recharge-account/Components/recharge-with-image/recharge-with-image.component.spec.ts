import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeWithImageComponent } from './recharge-with-image.component';

describe('RechargeWithImageComponent', () => {
  let component: RechargeWithImageComponent;
  let fixture: ComponentFixture<RechargeWithImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechargeWithImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargeWithImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
