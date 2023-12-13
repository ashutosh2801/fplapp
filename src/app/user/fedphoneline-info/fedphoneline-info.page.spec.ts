import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FedphonelineInfoPage } from './fedphoneline-info.page';

describe('FedphonelineInfoPage', () => {
  let component: FedphonelineInfoPage;
  let fixture: ComponentFixture<FedphonelineInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FedphonelineInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
