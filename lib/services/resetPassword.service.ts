import { RequestResetResponse, ResetPasswordParams } from '@/lib/types/resetPassword.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const resetPasswordService = {

  requestReset: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/password-reset/request`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();        
        throw new Error(errorData.error || 'Failed to send reset link');
      }


      return await response.json();
    } catch (error) {
      return {
        message: 'Failed to send reset link',
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  },
  
resetPassword: async (params: ResetPasswordParams): Promise<RequestResetResponse> => {
    try {
    const response = await fetch(`${API_BASE_URL}/password-reset/reset`, {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to reset password');
    }

    return await response.json();
    } catch (error) {
    return {
        message: 'Failed to reset password',
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
    }
},


}