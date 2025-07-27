
export interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

export interface RequestResetResponse {
  message: string;
  error?: string;
}