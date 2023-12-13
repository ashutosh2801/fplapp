import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorrectionalDetailPage } from './correctional-detail.page';

describe('CorrectionalDetailPage', () => {
  let component: CorrectionalDetailPage;
  let fixture: ComponentFixture<CorrectionalDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CorrectionalDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
