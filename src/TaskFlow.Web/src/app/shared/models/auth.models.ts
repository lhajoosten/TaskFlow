export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface AuthResponse {
    message?: string;
    token?: string;
    refreshToken?: string;
    errorMessage?: string;
    success?: boolean;
    // Add expiration info for client-side token management
    tokenExpiration?: Date;
    refreshTokenExpiration?: Date;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
}

export interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
}
