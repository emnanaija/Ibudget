import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCategoryPageComponent } from './expense-category-page.component';

describe('ExpenseCategoryPageComponent', () => {
  let component: ExpenseCategoryPageComponent;
  let fixture: ComponentFixture<ExpenseCategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCategoryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
