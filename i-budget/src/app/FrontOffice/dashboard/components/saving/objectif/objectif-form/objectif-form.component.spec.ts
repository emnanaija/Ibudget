import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifFormComponent } from './objectif-form.component';

describe('ObjectifFormComponent', () => {
  let component: ObjectifFormComponent;
  let fixture: ComponentFixture<ObjectifFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectifFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectifFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
