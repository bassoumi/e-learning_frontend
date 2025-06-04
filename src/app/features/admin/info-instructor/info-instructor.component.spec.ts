import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoInstructorComponent } from './info-instructor.component';

describe('InfoInstructorComponent', () => {
  let component: InfoInstructorComponent;
  let fixture: ComponentFixture<InfoInstructorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoInstructorComponent]
    });
    fixture = TestBed.createComponent(InfoInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
