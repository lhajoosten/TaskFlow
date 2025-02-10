export const environment = {
    production: true,
    apiUrl: 'http://localhost:5000',
    authEndpoints: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        refreshToken: '/api/auth/refresh-token',
        confirmEmail: '/api/auth/confirm-email',
        forgotPassword: '/api/auth/forgot-password',
        resetPassword: '/api/auth/reset-password'
    },
    // Logging configuration
    logLevel: 'info',
    logHttpResponses: true,
    logHttpRequests: true,
    logPerformance: true
};