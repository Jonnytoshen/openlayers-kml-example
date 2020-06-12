import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleViewComponent } from './style-view.component';

describe('StyleViewComponent', () => {
  let component: StyleViewComponent;
  let fixture: ComponentFixture<StyleViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StyleViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StyleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
