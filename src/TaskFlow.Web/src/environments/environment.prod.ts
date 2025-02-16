export const environment = {
  production: true,
  apiUrl: '/api',
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
  logLevel: 'info',
  logHttpResponses: true,
  logHttpRequests: true,
  logPerformance: true,
};
