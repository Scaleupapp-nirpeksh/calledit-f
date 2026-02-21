const KEYS = {
  ACCESS_TOKEN: "calledit_access_token",
  REFRESH_TOKEN: "calledit_refresh_token",
} as const;

function getItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

function setItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function getAccessToken(): string | null {
  return getItem(KEYS.ACCESS_TOKEN);
}

export function setAccessToken(token: string): void {
  setItem(KEYS.ACCESS_TOKEN, token);
}

export function getRefreshToken(): string | null {
  return getItem(KEYS.REFRESH_TOKEN);
}

export function setRefreshToken(token: string): void {
  setItem(KEYS.REFRESH_TOKEN, token);
}

export function clearTokens(): void {
  removeItem(KEYS.ACCESS_TOKEN);
  removeItem(KEYS.REFRESH_TOKEN);
}
