import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPhoneDialogComponent } from './verify-phone-dialog.component';

describe('VerifyPhoneDialogComponent', () => {
  let component: VerifyPhoneDialogComponent;
  let fixture: ComponentFixture<VerifyPhoneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyPhoneDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyPhoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
