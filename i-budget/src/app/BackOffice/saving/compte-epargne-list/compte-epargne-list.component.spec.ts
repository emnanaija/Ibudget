import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteEpargneListComponent } from './compte-epargne-list.component';

describe('CompteEpargneListComponent', () => {
  let component: CompteEpargneListComponent;
  let fixture: ComponentFixture<CompteEpargneListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteEpargneListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteEpargneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
