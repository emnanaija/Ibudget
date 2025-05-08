import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifListComponent } from './objectif-list.component';

describe('ObjectifListComponent', () => {
  let component: ObjectifListComponent;
  let fixture: ComponentFixture<ObjectifListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectifListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectifListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
