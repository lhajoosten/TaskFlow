export interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string;
  phoneNumber?: string;
  role?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
  skills?: string[];
  preferences?: UserPreferences;
  twoFactorEnabled: boolean;
  phoneNumberConfirmed?: string;
  emailConfirmed: boolean;
}

export interface UserPreferences {
  language: string;
  timeZone: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  darkMode: boolean;
}

export interface NotificationSetting {
  type: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}
