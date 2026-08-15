importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA00OQz2agtVe8fMG9Px46XTCRo5oJVfog",
  authDomain: "agent3-service.firebaseapp.com",
  projectId: "agent3-service",
  storageBucket: "agent3-service.firebasestorage.app",
  messagingSenderId: "496031551719",
  appId: "1:496031551719:web:cde2fa4c522b2d859c1242",
  measurementId: "G-S8MTPRPWD9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification';
  const notificationBody = payload.notification?.body || payload.data?.body || payload.data?.message || '';
  const notificationOptions = {
    body: notificationBody,
    icon: '/logo.png',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
