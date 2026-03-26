import liff from "@line/liff";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || "";

let initialized = false;

export async function initLiff() {
  if (initialized) return;
  if (!LIFF_ID) {
    console.warn("LIFF ID is not set");
    return;
  }
  await liff.init({ liffId: LIFF_ID });
  initialized = true;
}

export function isLoggedIn(): boolean {
  return liff.isLoggedIn();
}

export function login() {
  liff.login();
}

export function logout() {
  liff.logout();
  window.location.reload();
}

export async function getProfile() {
  if (!liff.isLoggedIn()) return null;
  return liff.getProfile();
}

export function getAccessToken(): string | null {
  return liff.getAccessToken();
}

export function isInClient(): boolean {
  return liff.isInClient();
}

export { liff };
