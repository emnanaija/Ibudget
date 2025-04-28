import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeWithoutNotificationComponent } from './recharge-without-notification.component';

describe('RechargeWithoutNotificationComponent', () => {
  let component: RechargeWithoutNotificationComponent;
  let fixture: ComponentFixture<RechargeWithoutNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechargeWithoutNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargeWithoutNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
