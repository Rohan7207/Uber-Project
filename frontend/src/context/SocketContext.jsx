import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

/**
 * SocketContext
 *
 * Provides a small wrapper around a Socket.io client instance and exposes
 * two simple helpers to the app:
 *  - sendEvent(eventName, payload): emit a message to the server
 *  - onEvent(eventName, handler): subscribe to messages from the server
 *
 * The provider handles connecting/disconnecting and exposes a `connected`
 * boolean plus the raw `socket` if a consumer needs it.
 *
 * Usage:
 * <SocketProvider>
 *   <App />
 * </SocketProvider>
 *
 * const { sendEvent, onEvent } = useSocket();
 */

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Prefer an explicit socket URL from env, fall back to base URL or origin
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_BASE_URL ||
      window.location.origin;

    // Create the socket. `transports: ['websocket']` helps avoid polling on some hosts.
    const socket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current = socket;

    // Basic lifecycle logging and state updates
    const handleConnect = () => {
      setConnected(true);
      // eslint-disable-next-line no-console
      console.debug("Socket connected:", socket.id);
    };

    const handleDisconnect = (reason) => {
      setConnected(false);
      // eslint-disable-next-line no-console
      console.debug("Socket disconnected:", reason);
    };

    const handleConnectError = (err) => {
      // eslint-disable-next-line no-console
      console.error("Socket connection error:", err);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // Clean up on unmount: remove listeners and disconnect socket
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      try {
        if (socket.connected) socket.disconnect();
      } catch (e) {
        // ignore
      }
      socketRef.current = null;
    };
  }, []);

  /**
   * Emit a message to the server on a specific event name.
   * If the socket is not ready, this warns and no-op's.
   */
  const sendEvent = (eventName, payload = {}) => {
    const socket = socketRef.current;
    if (!socket) {
      // eslint-disable-next-line no-console
      console.warn("Socket not initialized yet. Event not sent:", eventName);
      return;
    }

    console.log(`Sending message: ${payload} to ${eventName}`);

    socket.emit(eventName, payload);
  };

  /**
   * Subscribe to an event coming from the server.
   * Returns an unsubscribe function which removes the specific handler.
   */
  const onEvent = (eventName, handler) => {
    const socket = socketRef.current;
    if (!socket) {
      // eslint-disable-next-line no-console
      console.warn(
        "Socket not initialized yet. Listener not attached:",
        eventName,
      );
      return () => {};
    }

    socket.on(eventName, handler);

    // unsubscribe function
    return () => {
      if (socketRef.current) socketRef.current.off(eventName, handler);
    };
  };

  const value = {
    socket: socketRef.current,
    connected,
    sendEvent,
    onEvent,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

/**
 * Hook for consuming the socket helpers
 */
export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
  return ctx;
};

export default SocketContext;
