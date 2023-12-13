import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoRechargePage } from './auto-recharge.page';

describe('AutoRechargePage', () => {
  let component: AutoRechargePage;
  let fixture: ComponentFixture<AutoRechargePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AutoRechargePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
