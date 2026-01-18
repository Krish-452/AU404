
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes
const WARNING_THRESHOLD = 9 * 60 * 1000; // 9 minutes (prompt appears 1 min before logout)

export const useSessionTimeout = () => {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const lastActivityRef = useRef<number>(Date.now());
  const countdownIntervalRef = useRef<any>(null);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (showWarning) {
      setShowWarning(false);
      setRemainingSeconds(60);
    }
  }, [showWarning]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    const checkInactivity = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;

      if (elapsed >= INACTIVITY_LIMIT) {
        logout();
        setShowWarning(false);
      } else if (elapsed >= WARNING_THRESHOLD && !showWarning) {
        setShowWarning(true);
      }
    }, 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearInterval(checkInactivity);
    };
  }, [user, logout, resetTimer, showWarning]);

  // Countdown logic for the warning modal
  useEffect(() => {
    if (showWarning) {
      countdownIntervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      setRemainingSeconds(60);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [showWarning]);

  return { showWarning, remainingSeconds, resetTimer };
};
