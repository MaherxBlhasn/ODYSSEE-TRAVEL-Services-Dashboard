import { Subscriber, EmailRequest, EmailAllRequest, SendResponse, QueryParams, PaginatedResponse } from '@/lib/types/newspaper.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const newspaperService = {
  // Get all subscribers
async getAllSubscribers(params: QueryParams): Promise<PaginatedResponse<Subscriber>> {
  try {
    // Convert params to URL query string
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    queryParams.append('page', params.page.toString());
    queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const res = await fetch(
      `${API_BASE_URL}/newspaper?${queryParams.toString()}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch subscribers: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    throw error;
  }
},

  // Get subscriber by ID
  async getSubscriberById(id: string): Promise<Subscriber | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/newspaper/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error: unknown) {
      console.error(`Error fetching subscriber ${id}:`, error);
      return null;
    }
  },

  // Update subscriber email
  async updateSubscriber(id: string, email: string): Promise<Subscriber | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/newspaper/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error: unknown) {
      console.error(`Error updating subscriber ${id}:`, error);
      return null;
    }
  },

  // Delete a subscriber
  async deleteSubscriber(id: string): Promise<{ message: string } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/newspaper/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error: unknown) {
      console.error(`Error deleting subscriber ${id}:`, error);
      return null;
    }
  },

  // Send email to selected subscribers
  async sendEmail(request: EmailRequest): Promise<SendResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/newspaper/send`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error: unknown) {
      console.error('Error sending email:', error);
      return null;
    }
  },

  // Send email to all subscribers
  async sendEmailToAll(request: EmailAllRequest): Promise<SendResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/newspaper/send-all`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error: unknown) {
      console.error('Error sending email to all subscribers:', error);
      return null;
    }
  },

  // Delete all subscribers
  async deleteAllSubscribers(): Promise<{ message: string } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/newspaper/delete-all`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error: unknown) {
      console.error('Error deleting all subscribers:', error);
      return null;
    }
  },
};
