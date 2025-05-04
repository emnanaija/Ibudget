import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveNewDeviceComponent } from './approve-new-device.component';

describe('ApproveNewDeviceComponent', () => {
  let component: ApproveNewDeviceComponent;
  let fixture: ComponentFixture<ApproveNewDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveNewDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveNewDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
