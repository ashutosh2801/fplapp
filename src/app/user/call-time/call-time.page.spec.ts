import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallTimePage } from './call-time.page';

describe('CallTimePage', () => {
  let component: CallTimePage;
  let fixture: ComponentFixture<CallTimePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CallTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
