import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerminatePage } from './terminate.page';

describe('TerminatePage', () => {
  let component: TerminatePage;
  let fixture: ComponentFixture<TerminatePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TerminatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
