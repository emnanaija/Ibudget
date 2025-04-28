import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeAccountComponent } from './recharge-account.component';

describe('RechargeAccountComponent', () => {
  let component: RechargeAccountComponent;
  let fixture: ComponentFixture<RechargeAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechargeAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
