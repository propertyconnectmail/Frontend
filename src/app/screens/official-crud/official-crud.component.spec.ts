import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialCrudComponent } from './official-crud.component';

describe('OfficialCrudComponent', () => {
  let component: OfficialCrudComponent;
  let fixture: ComponentFixture<OfficialCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficialCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficialCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
