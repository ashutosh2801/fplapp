import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallForwardingPage } from './call-forwarding.page';

describe('CallForwardingPage', () => {
  let component: CallForwardingPage;
  let fixture: ComponentFixture<CallForwardingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CallForwardingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
