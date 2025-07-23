import { UserData, QueryParams, PaginatedResponse, UserServices } from '@/lib/types/user.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

export const userServices: UserServices = {
  async getUsers(params: QueryParams): Promise<PaginatedResponse<UserData>> {
    try {
      // Convert params to URL query string
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await fetch(`${API_BASE_URL}/users?${queryParams.toString()}`,{
           method: 'GET',
           credentials: 'include', 
        });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      console.log('rep:',response.json);
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async createUser(user: Omit<UserData, 'id' | 'createdAt'>): Promise<UserData> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        credentials: 'include',
        headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...user})
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUser(id: string, updates: Partial<Omit<UserData, 'id' | 'createdAt'>>): Promise<UserData> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        credentials:'include',
        headers: {
          // Include authorization header if needed
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};



// // Optionally keep mock services for development/testing
// export const mockUserServices: UserServices = {
//   // ... (keep your existing mock implementation if needed)
// };