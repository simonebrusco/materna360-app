export function toast(message) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("m360:toast", { detail: { msg: message } }));
  }
}
