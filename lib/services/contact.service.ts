import { ContactDataFetch , QueryParams ,PaginatedResponse ,ContactServices} from '@/lib/types/contact.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

export const contactService: ContactServices = {

    async getContacts(params : QueryParams) : Promise <PaginatedResponse<ContactDataFetch>>{
      try{
            // Convert params to URL query string
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        queryParams.append('page', params.page.toString());
        queryParams.append('limit', params.limit.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const response = await fetch(`${API_BASE_URL}/contacts?${queryParams.toString()}`,{
            method: 'GET',
            credentials: 'include', 
            });    
        if (!response.ok) {
            throw new Error(`Failed to fetch contacts: ${response.statusText}`);
        }
        console.log('rep:',response.json);
        return await response.json();
        } catch (error) {
            console.error("Error fetching contacts :",error);
            throw error;
        }
    },

    async deleteContact(id: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            });

            if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to delete contact: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            throw error;
        }
    }

};