import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagepredictionComponent } from './pageprediction.component';

describe('PagepredictionComponent', () => {
  let component: PagepredictionComponent;
  let fixture: ComponentFixture<PagepredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagepredictionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagepredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
