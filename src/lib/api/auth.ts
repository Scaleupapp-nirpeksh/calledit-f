import api from "./client";
import type {
  SendOtpRequest,
  VerifyOtpRequest,
  AuthResponse,
} from "@/lib/types/auth";

export async function sendOtp(payload: SendOtpRequest) {
  const { data } = await api.post<{ message: string }>(
    "/auth/otp/send",
    payload
  );
  return data;
}

export async function verifyOtp(payload: VerifyOtpRequest) {
  const { data } = await api.post<AuthResponse>("/auth/otp/verify", payload);
  return data;
}

export async function logout() {
  const { data } = await api.post<{ message: string }>("/auth/logout");
  return data;
}
