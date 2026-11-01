/**
 * Open the booking success screen like a native app: an instant in-app
 * transition (no white flash / full reload). Falls back to a normal page
 * load if the in-app navigation hasn't happened after a few seconds
 * (e.g. a flaky in-app browser).
 */
type RouterLike = { push: (href: string) => void };

export function goToBookingSuccess(router: RouterLike, url: string) {
  if (typeof window === "undefined") {
    router.push(url);
    return;
  }

  try {
    router.push(url);
  } catch (e) {
    window.location.assign(url);
    return;
  }

  setTimeout(() => {
    if (!window.location.pathname.startsWith("/booking-success")) {
      window.location.assign(url);
    }
  }, 4000);
}
