import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteEpargnePageComponent } from './compte-epargne-page.component';

describe('CompteEpargnePageComponent', () => {
  let component: CompteEpargnePageComponent;
  let fixture: ComponentFixture<CompteEpargnePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteEpargnePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteEpargnePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
