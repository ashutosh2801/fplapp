import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaynowPage } from './paynow.page';

describe('PaynowPage', () => {
  let component: PaynowPage;
  let fixture: ComponentFixture<PaynowPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaynowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
