import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDepensesReccurentesComponent } from './page-depenses-reccurentes.component';

describe('PageDepensesReccurentesComponent', () => {
  let component: PageDepensesReccurentesComponent;
  let fixture: ComponentFixture<PageDepensesReccurentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageDepensesReccurentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDepensesReccurentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
