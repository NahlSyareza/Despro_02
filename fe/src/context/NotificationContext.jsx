import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "../util/url";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 1. Ambil Token
    const token = localStorage.getItem("token");
    
    // Jika tidak ada token (User belum login), hentikan proses
    if (!token) return;

    // 2. Buat URL dengan Query Param Token
    // Ini agar middleware backend (auth.middleware.js) bisa memvalidasi request
    const sseUrl = `${API_BASE_URL}/tray/events?token=${token}`;
    
    console.log(`[SSE] Connecting securely to: ${API_BASE_URL}/tray/events`);
    
    // 3. Buka Koneksi
    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => console.log("[SSE] Secure Connection Established");

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        console.log("[SSE] New Event:", parsedData);

        const newNotif = {
          id: Date.now(),
          ...parsedData, // { type, message, data: { compliance_score, ... } }
          timestamp: new Date(),
          read: false,
        };

        // Update State
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Munculkan Toast Pop-up
        if (parsedData.type === 'WARNING') {
          toast.error(parsedData.message, {
            description: `Skor Nutrisi: ${parsedData.data.compliance_score}. Cek Menu!`,
            duration: 8000, // Tampil agak lama
            action: {
              label: "Tutup",
              onClick: () => console.log("Closed"),
            },
          });
        } else {
          toast.success("Tray Baru Masuk", {
            description: `Skor: ${parsedData.data.compliance_score}`,
            duration: 3000,
          });
        }
      } catch (err) {
        console.error("[SSE] Parse Error:", err);
      }
    };

    eventSource.onerror = (err) => {
      // Browser akan otomatis mencoba reconnect jika error, jadi biarkan saja log-nya
      // Kecuali jika 401 (Unauthorized), biasanya EventSource akan mati sendiri
      console.error("[SSE] Connection lost. Waiting for reconnect...", err);
    };

    // Cleanup saat logout / unmount
    return () => {
      console.log("[SSE] Closing connection");
      eventSource.close();
    };
  }, []); // Dependency array kosong: dijalankan sekali saat mount (setelah login)

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);