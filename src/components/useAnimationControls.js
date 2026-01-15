import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useAnimationControls - Reusable hook for animation speed, play/pause, and step navigation
 * @param {number} totalSteps - Total number of steps in the animation
 * @param {function} onStepChange - Callback when the step changes
 * @param {number} initialSpeed - Initial animation speed in ms
 * @returns {object} Animation control state and handlers
 */
export function useAnimationControls(totalSteps, onStepChange, initialSpeed = 500) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedSlider, setSpeedSlider] = useState(75); // 0 (slow) to 100 (fast)
  const [animationSpeed, setAnimationSpeed] = useState(initialSpeed);
  const minSpeed = 100;
  const maxSpeed = 2000;
  const intervalRef = useRef(null);

  // Map slider to delay
  useEffect(() => {
    const delay = maxSpeed - ((speedSlider / 100) * (maxSpeed - minSpeed));
    setAnimationSpeed(Math.round(delay));
  }, [speedSlider]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < totalSteps - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, animationSpeed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isPlaying, animationSpeed, totalSteps]);

  // Notify parent on step change
  useEffect(() => {
    if (onStepChange) onStepChange(currentStep);
  }, [currentStep, onStepChange]);

  // Step navigation handlers
  const handleStep = useCallback((direction) => {
    setCurrentStep(prev => {
      if (direction === 'prev' && prev > 0) return prev - 1;
      if (direction === 'next' && prev < totalSteps - 1) return prev + 1;
      if (direction === 'first') return 0;
      if (direction === 'last') return totalSteps - 1;
      return prev;
    });
  }, [totalSteps]);

  const togglePlay = useCallback(() => setIsPlaying(p => !p), []);

  return {
    currentStep,
    setCurrentStep,
    isPlaying,
    togglePlay,
    speedSlider,
    setSpeedSlider,
    animationSpeed,
    handleStep
  };
}
