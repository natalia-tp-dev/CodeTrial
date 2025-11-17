import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PythonCourse } from './python-course';

describe('PythonCourse', () => {
  let component: PythonCourse;
  let fixture: ComponentFixture<PythonCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PythonCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PythonCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
