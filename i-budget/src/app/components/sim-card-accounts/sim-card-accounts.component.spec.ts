import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimCardAccountsComponent } from './sim-card-accounts.component';

describe('SimCardAccountsComponent', () => {
  let component: SimCardAccountsComponent;
  let fixture: ComponentFixture<SimCardAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimCardAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimCardAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
