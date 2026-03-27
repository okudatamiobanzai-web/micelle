import liff from "@line/liff";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || "";

let initialized = false;

export async function initLiff() {
  if (initialized) return;
  if (!LIFF_ID) {
    console.warn("LIFF ID is not set");
    return;
  }
  try {
    await liff.init({ liffId: LIFF_ID });
    initialized = true;
  } catch (e) {
    console.warn("LIFF init failed:", e);
    // LIFF初期化に失敗しても閲覧は可能にする
  }
}

export function isLoggedIn(): boolean {
  if (!initialized) return false;
  try {
    return liff.isLoggedIn();
  } catch {
    return false;
  }
}

export function login() {
  if (!initialized) return;
  liff.login();
}

export function logout() {
  if (!initialized) return;
  liff.logout();
  window.location.reload();
}

export async function getProfile() {
  if (!initialized || !liff.isLoggedIn()) return null;
  return liff.getProfile();
}

export function getAccessToken(): string | null {
  if (!initialized) return null;
  return liff.getAccessToken();
}

export function isInClient(): boolean {
  if (!initialized) return false;
  return liff.isInClient();
}

export { liff };
