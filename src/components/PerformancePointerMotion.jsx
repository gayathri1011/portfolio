import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function PerformancePointerMotion() {
  const reduceMotion = useReducedMotion();
  const frame = useRef(0);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const root = document.documentElement;
    const position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const render = () => {
      frame.current = 0;
      const x = Math.max(0, Math.min(window.innerWidth, position.x));
      const y = Math.max(0, Math.min(window.innerHeight, position.y));
      root.style.setProperty('--pointer-x', ((x / window.innerWidth - 0.5) * 2).toFixed(3));
      root.style.setProperty('--pointer-y', ((y / window.innerHeight - 0.5) * 2).toFixed(3));
      root.style.setProperty('--mouse-x', `${x}px`);
      root.style.setProperty('--mouse-y', `${y}px`);
    };
    const scheduleRender = () => {
      if (!frame.current) frame.current = requestAnimationFrame(render);
    };
    const updatePointer = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      position.x = event.clientX;
      position.y = event.clientY;
      scheduleRender();
    };
    const resetPointer = () => {
      position.x = window.innerWidth / 2;
      position.y = window.innerHeight / 2;
      scheduleRender();
    };
    const stopCarouselEdgeAdvance = (event) => {
      if (event.target.closest('.carousel-controls') || swipe.active) event.stopPropagation();
    };
    const swipe = { startX: null, active: false };
    const startProjectSwipe = (event) => {
      const card = event.target.closest('.carousel-card');
      if (!card || event.target.closest('a, button')) return;
      swipe.startX = event.clientX;
      swipe.active = true;
      event.stopPropagation();
    };
    const finishProjectSwipe = (event) => {
      if (!swipe.active || swipe.startX === null) return;
      const distance = event.clientX - swipe.startX;
      swipe.startX = null;
      swipe.active = false;
      if (Math.abs(distance) < 70) return;
      const selector = distance < 0 ? '[aria-label="Next project"]' : '[aria-label="Previous project"]';
      document.querySelector(selector)?.click();
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerleave', resetPointer, { passive: true });
    window.addEventListener('blur', resetPointer, { passive: true });
    document.addEventListener('pointermove', stopCarouselEdgeAdvance, true);
    document.addEventListener('pointerdown', startProjectSwipe, true);
    document.addEventListener('pointerup', finishProjectSwipe, true);
    document.addEventListener('pointercancel', finishProjectSwipe, true);
    render();

    return () => {
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerleave', resetPointer);
      window.removeEventListener('blur', resetPointer);
      document.removeEventListener('pointermove', stopCarouselEdgeAdvance, true);
      document.removeEventListener('pointerdown', startProjectSwipe, true);
      document.removeEventListener('pointerup', finishProjectSwipe, true);
      document.removeEventListener('pointercancel', finishProjectSwipe, true);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [reduceMotion, frame]);

  useEffect(() => {
    const statGrid = document.querySelector('.stat-grid');
    if (!statGrid) return undefined;

    const statValues = [...statGrid.querySelectorAll('.stat strong')];
    const finalValues = statValues.map((element) => element.textContent.trim());
    statValues.forEach((element, index) => {
      const finalValue = finalValues[index];
      const decimals = finalValue.includes('.') ? finalValue.split('.')[1].length : 0;
      element.textContent = decimals ? Number(0).toFixed(decimals) : '0'.padStart(finalValue.length, '0');
    });
    let animationFrames = [];
    let observer;

    const startCountUp = () => {
      const startTime = performance.now();
      const duration = 900;
      const render = (time) => {
        const progress = Math.min(1, (time - startTime) / duration);
        const easedProgress = 1 - (1 - progress) ** 3;
        statValues.forEach((element, index) => {
          const finalValue = finalValues[index];
          const decimals = finalValue.includes('.') ? finalValue.split('.')[1].length : 0;
          const numericValue = Number(finalValue) * easedProgress;
          const formattedValue = decimals ? numericValue.toFixed(decimals) : String(Math.round(numericValue)).padStart(finalValue.length, '0');
          element.textContent = progress === 1 ? finalValue : formattedValue;
        });
        if (progress < 1) animationFrames.push(requestAnimationFrame(render));
      };
      animationFrames.push(requestAnimationFrame(render));
    };

    observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (reduceMotion) {
        statValues.forEach((element, index) => { element.textContent = finalValues[index]; });
        return;
      }
      startCountUp();
    }, { threshold: 0.35 });
    observer.observe(statGrid);

    return () => {
      observer.disconnect();
      animationFrames.forEach((frameId) => cancelAnimationFrame(frameId));
    };
  }, [reduceMotion]);

  return <><div className="cursor-atmosphere" aria-hidden="true"><span className="cursor-layer cursor-layer-back" /><span className="cursor-layer cursor-layer-glow" /><span className="cursor-layer cursor-layer-particle" /></div><span className="cursor-core" aria-hidden="true" /><span className="cursor-ring" aria-hidden="true" /></>;
}
