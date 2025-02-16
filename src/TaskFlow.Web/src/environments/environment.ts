export const environment = {
  production: false,
  apiUrl: 'https://localhost:7443/api',
  authEndpoints: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    confirmEmail: '/auth/confirm-email',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  // Logging configuration
  logLevel: 'debug',
  logHttpResponses: true,
  logHttpRequests: true,
  logPerformance: true,
};
