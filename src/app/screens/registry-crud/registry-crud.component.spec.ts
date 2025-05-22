import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryCrudComponent } from './registry-crud.component';

describe('RegistryCrudComponent', () => {
  let component: RegistryCrudComponent;
  let fixture: ComponentFixture<RegistryCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistryCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistryCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
