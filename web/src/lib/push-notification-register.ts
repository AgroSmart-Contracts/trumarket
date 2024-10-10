import { NotificationsService } from "src/controller/NotificationsAPI.service";

/* eslint-disable no-restricted-syntax */
const publicVapidKey = "BGn8ofoakH97-BzKTf0LQmZkm2y2n21XvT3RFCNHrpf7Z1k6Y7s2xr-wTWY4P0XJQvovLdwI_l-mhOzTlP-7Q_s";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async (subscription: any) => {
  const res = await NotificationsService.subscribeNotifications(subscription);
  return res.status === 200 ? res.json() : false;
};

const generateSubscription = async (swRegistration: any) => {
  await window.Notification.requestPermission();
  const subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  const saved = await saveSubscription(subscription);
  if (saved) return saved;
};

const registerServiceWorker = async () => {
  return await navigator.serviceWorker.register("/sw.js");
};

export const register = async () => {
  if ("serviceWorker" in navigator) {
    const swRegistration = await registerServiceWorker();
    const sub = await generateSubscription(swRegistration);
  } else throw new Error("ServiceWorkers are not supported by your browser!");
};
