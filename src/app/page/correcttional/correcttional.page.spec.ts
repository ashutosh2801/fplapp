import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CorrecttionalPage } from './correcttional.page';

describe('CorrecttionalPage', () => {
  let component: CorrecttionalPage;
  let fixture: ComponentFixture<CorrecttionalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CorrecttionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
