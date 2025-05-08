import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepotPageComponent } from './depot-page.component';

describe('DepotPageComponent', () => {
  let component: DepotPageComponent;
  let fixture: ComponentFixture<DepotPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepotPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
