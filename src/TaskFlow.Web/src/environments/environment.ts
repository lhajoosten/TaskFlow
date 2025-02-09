export const environment = {
    production: false,
    apiUrl: 'https://localhost:7228',
    authEndpoints: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        refreshToken: '/api/auth/refresh-token',
        confirmEmail: '/api/auth/confirm-email',
        forgotPassword: '/api/auth/forgot-password',
        resetPassword: '/api/auth/reset-password'
    }
};