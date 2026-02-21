import api from "./client";
import type { User, OnboardingPayload, UpdateProfilePayload } from "@/lib/types/user";

export async function getMe() {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: UpdateProfilePayload) {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}

export async function completeOnboarding(payload: OnboardingPayload) {
  const { data } = await api.post<User>("/users/me/onboarding", payload);
  return data;
}

export async function getUserById(userId: string) {
  const { data } = await api.get<User>(`/users/${userId}`);
  return data;
}
