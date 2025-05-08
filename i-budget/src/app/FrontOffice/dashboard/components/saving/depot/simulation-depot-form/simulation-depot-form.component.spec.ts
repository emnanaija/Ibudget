import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationDepotFormComponent } from './simulation-depot-form.component';

describe('SimulationDepotFormComponent', () => {
  let component: SimulationDepotFormComponent;
  let fixture: ComponentFixture<SimulationDepotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationDepotFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationDepotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
