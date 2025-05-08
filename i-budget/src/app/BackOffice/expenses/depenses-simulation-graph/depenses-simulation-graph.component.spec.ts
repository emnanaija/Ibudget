import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepensesSimulationGraphComponent } from './depenses-simulation-graph.component';

describe('DepensesSimulationGraphComponent', () => {
  let component: DepensesSimulationGraphComponent;
  let fixture: ComponentFixture<DepensesSimulationGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepensesSimulationGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepensesSimulationGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
