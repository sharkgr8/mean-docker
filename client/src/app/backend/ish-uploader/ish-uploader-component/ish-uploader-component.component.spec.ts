import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IshUploaderComponentComponent } from './ish-uploader-component.component';

describe('IshUploaderComponentComponent', () => {
  let component: IshUploaderComponentComponent;
  let fixture: ComponentFixture<IshUploaderComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IshUploaderComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IshUploaderComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
