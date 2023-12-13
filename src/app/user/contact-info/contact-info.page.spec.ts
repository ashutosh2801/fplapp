import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactInfoPage } from './contact-info.page';

describe('ContactInfoPage', () => {
  let component: ContactInfoPage;
  let fixture: ComponentFixture<ContactInfoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ContactInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
