import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewNumberPage } from './new-number.page';

describe('NewNumberPage', () => {
  let component: NewNumberPage;
  let fixture: ComponentFixture<NewNumberPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
