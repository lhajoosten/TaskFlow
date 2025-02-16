import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationSetting, User } from '../../shared/models/profile.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/current`);
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData);
  }

  updateProfilePicture(file: File): Observable<{ profilePictureUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<{ profilePictureUrl: string }>(
      `${this.apiUrl}/profile-picture`,
      formData,
    );
  }

  changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, passwordData);
  }

  verifyPhoneNumber(code: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-phone`, { code });
  }

  enableTwoFactor(): Observable<{
    qrCodeUrl: string;
    recoveryCodes: string[];
  }> {
    return this.http.post<{ qrCodeUrl: string; recoveryCodes: string[] }>(
      `${this.apiUrl}/two-factor/enable`,
      {},
    );
  }

  verifyTwoFactorSetup(code: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/two-factor/verify-setup`, {
      code,
    });
  }

  disableTwoFactor(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/two-factor/disable`, {});
  }

  getNotificationSettings(): Observable<NotificationSetting[]> {
    return this.http.get<NotificationSetting[]>(
      `${this.apiUrl}/notification-settings`,
    );
  }

  updateNotificationSettings(
    settings: NotificationSetting[],
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/notification-settings`,
      settings,
    );
  }
}
