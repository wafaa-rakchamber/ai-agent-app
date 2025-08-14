export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com',
  apiEndpoints: {
    auth: '/api/auth',
    projects: '/api/projects',
    tasks: '/api/tasks',
    stories: '/api/stories',
    users: '/api/users',
    health: '/api/health'
  },
  app: {
    name: 'AI Agent App',
    version: '1.0.0'
  },
  auth: {
    tokenKey: 'authToken',
    userKey: 'authUser',
    tokenExpiry: 86400000 // 24 hours in milliseconds
  }
};
