import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculInteretFormComponent } from './calcul-interet-form.component';

describe('CalculInteretFormComponent', () => {
  let component: CalculInteretFormComponent;
  let fixture: ComponentFixture<CalculInteretFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculInteretFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculInteretFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
