import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillingCalculatorPage } from './billing-calculator.page';

describe('BillingCalculatorPage', () => {
  let component: BillingCalculatorPage;
  let fixture: ComponentFixture<BillingCalculatorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BillingCalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
