import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDesDepensesComponent } from './page-des-depenses.component';

describe('PageDesDepensesComponent', () => {
  let component: PageDesDepensesComponent;
  let fixture: ComponentFixture<PageDesDepensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageDesDepensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDesDepensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
