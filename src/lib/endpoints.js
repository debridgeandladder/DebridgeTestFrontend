// API endpoints configuration
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/admin/signin',
    signup: '/admin/signup',
  },
  
  // Contacts endpoints
  contacts: {
    create: '/contacts',
    getAll: '/get-contacts',
    single: (id) => `/contacts/${id}`,
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