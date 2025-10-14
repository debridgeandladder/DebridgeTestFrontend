import apiClient from './apiClient';
import endpoints from './endpoints';

export const BLANK_PHONE = '----------'
export const BLANK_EMAIL = '---------@gmail.com'
export const api = {
  // Join waitlist
  async joinWaitlist(data) {
    try {
      const response = await apiClient.post(endpoints.contacts.create, {
        email: data.contact.includes('@') ? data.contact : BLANK_EMAIL,
        phone: !data.contact.includes('@') ? data.contact : BLANK_PHONE,
        location: data.location||'Nigeria', 
        servicestype: data.userType === 'user' ? 'serviceUser' : 'serviceProvider'
      });
      
      return {
        success: true,
        message: 'Successfully joined waitlist',
        data: response.data
      };
    } catch (error) {
      console.error('Error joining waitlist:', error);
      throw error;
    }
  },

  // Get waitlist data with pagination and search
  async getWaitlist({ page = 1, limit = 10, search = '', userType = '' } = {}) {
    try {
      const response = await apiClient.get(endpoints.contacts.getAll);
      let data = response.data;
      data = data.map(item => {
        return {
          ...item,
          contact: item.phone!==BLANK_PHONE?item.phone:item.email
        };
      });
      // Apply search filter
      if (search) {
        data = data.filter(item => 
          (item.contact && item.contact.toLowerCase().includes(search.toLowerCase()))
        );
      }
      
      // Apply user type filter
      if (userType && userType !== 'all') {
        const filterType = userType === 'user' ? 'serviceUser' : 'serviceProvider';
        data = data.filter(item => item.servicestype === filterType);
      }
      
      // Calculate pagination
      const total = data.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = data.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching waitlist:', error);
      throw error;
    }
  },

  // Get waitlist statistics
  async getWaitlistStats() {
    try {
      const response = await apiClient.get(endpoints.contacts.getAll);
      let data = response.data;
      data = data.map(item => {
        return {
          ...item,
          contact: item.phone!==BLANK_PHONE?item.phone:item.email
        };
      });
      
      const total = data.length;
      const users = data.filter(item => item.servicestype === 'serviceUser').length;
      const providers = data.filter(item => item.servicestype === 'serviceProvider').length;
      
      // Generate daily registration data for the last 7 days
      const dailyStats = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Count registrations for this date
        const count = data.filter(item => {
          const itemDate = new Date(item.created_at).toISOString().split('T')[0];
          return itemDate === dateStr;
        }).length;
        
        dailyStats.push({
          date: dateStr,
          count
        });
      }
      
      return {
        success: true,
        data: {
          total,
          users,
          providers,
          dailyStats
        }
      };
    } catch (error) {
      console.error('Error fetching waitlist stats:', error);
      throw error;
    }
  },

  // Get contact by ID
  async getContactById(id) {
    try {
      const response = await apiClient.get(endpoints.contacts.single(id));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  },

  // Update contact
  async updateContact(id, data) {
    try {
      const response = await apiClient.put(endpoints.contacts.single(id), data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  // Delete contact
  async deleteContact(id) {
    try {
      await apiClient.delete(endpoints.contacts.single(id));
      return {
        success: true,
        message: 'Contact deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
}

export default api
