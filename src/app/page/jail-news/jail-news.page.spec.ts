import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JailNewsPage } from './jail-news.page';

describe('JailNewsPage', () => {
  let component: JailNewsPage;
  let fixture: ComponentFixture<JailNewsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JailNewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
