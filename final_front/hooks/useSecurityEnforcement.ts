
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
// @ts-ignore
import { useNavigate } from 'react-router-dom';

export const useSecurityEnforcement = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [violationActive, setViolationActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const triggerViolation = useCallback(() => {
    // Prevent multiple triggers if already active
    if (violationActive) return;
    
    setViolationActive(true);
    setCountdown(5); // Reset countdown to start
    
    // Force immediate session wipe
    logout(); 
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Crucial: Reset violation state so the overlay disappears
          setViolationActive(false);
          // Navigate to login using the router
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [violationActive, logout, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J')) // Mac
      ) {
        e.preventDefault();
        triggerViolation();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation();
    };

    // Monitor window size changes (common when docking DevTools)
    const handleResize = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      
      // Strict environment check
      if (widthDiff || heightDiff) {
        // Optional: triggerViolation(); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('resize', handleResize);
    };
  }, [triggerViolation]);

  return { violationActive, countdown };
};
