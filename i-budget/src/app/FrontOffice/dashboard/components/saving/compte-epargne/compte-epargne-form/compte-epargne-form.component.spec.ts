import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteEpargneFormComponent } from './compte-epargne-form.component';

describe('CompteEpargneFormComponent', () => {
  let component: CompteEpargneFormComponent;
  let fixture: ComponentFixture<CompteEpargneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteEpargneFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteEpargneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
