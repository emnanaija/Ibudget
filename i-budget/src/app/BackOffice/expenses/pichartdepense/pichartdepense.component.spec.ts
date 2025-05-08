import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PichartdepenseComponent } from './pichartdepense.component';

describe('PichartdepenseComponent', () => {
  let component: PichartdepenseComponent;
  let fixture: ComponentFixture<PichartdepenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PichartdepenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PichartdepenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
