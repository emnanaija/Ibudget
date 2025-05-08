import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepenseReccurenteAjoutComponent } from './depense-reccurente-ajout.component';

describe('DepenseReccurenteAjoutComponent', () => {
  let component: DepenseReccurenteAjoutComponent;
  let fixture: ComponentFixture<DepenseReccurenteAjoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepenseReccurenteAjoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepenseReccurenteAjoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
