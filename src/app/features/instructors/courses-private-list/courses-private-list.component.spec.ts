import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesPrivateListComponent } from './courses-private-list.component';

describe('CoursesPrivateListComponent', () => {
  let component: CoursesPrivateListComponent;
  let fixture: ComponentFixture<CoursesPrivateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursesPrivateListComponent]
    });
    fixture = TestBed.createComponent(CoursesPrivateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
