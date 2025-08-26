import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovedComponent } from './aproved.component';

describe('AprovedComponent', () => {
  let component: AprovedComponent;
  let fixture: ComponentFixture<AprovedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AprovedComponent]
    });
    fixture = TestBed.createComponent(AprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
