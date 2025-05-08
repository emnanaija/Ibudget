import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifPageComponent } from './objectif-page.component';

describe('ObjectifPageComponent', () => {
  let component: ObjectifPageComponent;
  let fixture: ComponentFixture<ObjectifPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectifPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectifPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
