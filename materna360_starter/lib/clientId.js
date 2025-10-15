export function getClientId() {
  if (typeof window === "undefined") return null;

  const STORAGE_KEY = "m360_uid";
  let id = window.localStorage.getItem(STORAGE_KEY);

  if (!id) {
    const uuidFn = window.crypto?.randomUUID;
    id = typeof uuidFn === "function" ? uuidFn.call(window.crypto) : String(Date.now());
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  return id;
}
