export function toast(message, opts = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("m360:toast", {
      detail: { message, icon: opts.icon, duration: opts.duration },
    })
  );
}
