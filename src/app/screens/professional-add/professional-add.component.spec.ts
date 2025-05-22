import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalAddComponent } from './professional-add.component';

describe('ProfessionalAddComponent', () => {
  let component: ProfessionalAddComponent;
  let fixture: ComponentFixture<ProfessionalAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfessionalAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
