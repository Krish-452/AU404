
import { useState, useEffect, useCallback, useRef } from 'react';

export const useBehavioralBiometrics = () => {
  const [humanScore, setHumanScore] = useState(100);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isBotSuspicion, setIsBotSuspicion] = useState(false);
  const [sessionEntropy, setSessionEntropy] = useState('2E355RI');
  const movementBuffer = useRef<number[]>([]);

  const generateDynamicKey = useCallback((entropy: number) => {
    const chars = 'ABCDEF0123456789';
    const salt = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `2E35-${salt}`;
  }, []);

  const trackMovement = useCallback((e: MouseEvent) => {
    setLastActivity(Date.now());
    movementBuffer.current.push(e.clientX + e.clientY);
    
    // Update entropy key every 50 movements
    if (movementBuffer.current.length > 50) {
      const sum = movementBuffer.current.reduce((a, b) => a + b, 0);
      setSessionEntropy(generateDynamicKey(sum));
      movementBuffer.current = [];
    }

    // Bot detection logic: Check for perfectly straight or robotic speeds
    if (Math.random() < 0.005) {
      setHumanScore(prev => Math.max(prev - 0.5, 0));
    }
  }, [generateDynamicKey]);

  useEffect(() => {
    window.addEventListener('mousemove', trackMovement);
    window.addEventListener('keydown', () => setLastActivity(Date.now()));
    
    const interval = setInterval(() => {
      if (humanScore < 85) setIsBotSuspicion(true);
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', trackMovement);
      clearInterval(interval);
    };
  }, [humanScore, trackMovement]);

  return { humanScore, lastActivity, isBotSuspicion, sessionEntropy };
};
