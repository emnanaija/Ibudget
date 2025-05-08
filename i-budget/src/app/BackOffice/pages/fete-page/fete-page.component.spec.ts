import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetePageComponent } from './fete-page.component';

describe('FetePageComponent', () => {
  let component: FetePageComponent;
  let fixture: ComponentFixture<FetePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FetePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FetePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
