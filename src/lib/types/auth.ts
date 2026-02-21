export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
  is_new_user: boolean;
}

export interface RefreshRequest {
  refresh_token: string;
}
