import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencedepComponent } from './frequencedep.component';

describe('FrequencedepComponent', () => {
  let component: FrequencedepComponent;
  let fixture: ComponentFixture<FrequencedepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrequencedepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrequencedepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
