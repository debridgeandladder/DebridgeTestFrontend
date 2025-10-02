// API endpoints configuration
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/admin/signin',
    signup: '/admin/signup',
    logout: '/admin/logout',
    profile: '/admin/profile',
    refresh: '/admin/refresh'
  },
  
  // Contacts endpoints
  contacts: {
    create: '/contacts',
    getAll: '/get-contacts',
    getById: (id) => `/contacts/${id}`,
    update: (id) => `/contacts/${id}`,
    delete: (id) => `/contacts/${id}`
  }
}

// Open endpoints that don't require authentication
export const openEndpoints = [
  '/admin/signin',
  '/admin/signup',
  '/contacts',
  '/contacts/',


]

export default endpoints;