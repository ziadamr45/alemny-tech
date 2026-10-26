/* ============================================================
   علَّمني تِك — Service Worker
   إشعارات الويب الفورية: مقالات وشروحات وبرومبتات جديدة
   ============================================================ */

const DEFAULT_NOTIFICATION = {
  title: "علَّمني تِك",
  body: "وصل إشعار جديد من المنصة ✨",
  url: "/",
};

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = { ...DEFAULT_NOTIFICATION };
  try {
    if (event.data) {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    }
  } catch (error) {
    if (event.data) payload.body = event.data.text();
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/logo.png",
      badge: "/logo.png",
      dir: "rtl",
      lang: "ar",
      tag: payload.tag || undefined,
      vibrate: [80, 40, 80],
      data: { url: payload.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(target).catch(() => {});
            return client.focus();
          }
        }
        return self.clients.openWindow(target);
      }),
  );
});
