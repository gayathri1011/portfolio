import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function PerformancePointerMotion() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return undefined;

    let frame = 0;
    let active = true;
    let latest = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const root = document.documentElement;
    const hero = document.querySelector('.hero');
    const terminal = () => document.querySelector('.terminal-visual');
    const reset = () => {
      latest = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      root.style.setProperty('--pointer-x', '0');
      root.style.setProperty('--pointer-y', '0');
      if (!frame) frame = requestAnimationFrame(update);
    };
    const update = () => {
      frame = 0;
      if (!active) return;
      const nx = (latest.x / window.innerWidth - .5) * 2;
      const ny = (latest.y / window.innerHeight - .5) * 2;
      root.style.setProperty('--pointer-x', nx.toFixed(3));
      root.style.setProperty('--pointer-y', ny.toFixed(3));
      root.style.setProperty('--mouse-x', `${latest.x}px`);
      root.style.setProperty('--mouse-y', `${latest.y}px`);
      const node = terminal();
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      const localX = Math.max(-1, Math.min(1, ((latest.x - bounds.left) / bounds.width - .5) * 2));
      const localY = Math.max(-1, Math.min(1, ((latest.y - bounds.top) / bounds.height - .5) * 2));
      node.style.setProperty('--terminal-rx', `${(-localY * 5).toFixed(2)}deg`);
      node.style.setProperty('--terminal-ry', `${(localX * 7).toFixed(2)}deg`);
      node.style.setProperty('--terminal-tx', `${(localX * 6).toFixed(1)}px`);
      node.style.setProperty('--terminal-ty', `${(localY * 4).toFixed(1)}px`);
    };
    const move = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      latest = { x: event.clientX, y: event.clientY };
      if (active && !frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (!active) reset();
    }, { threshold: 0.05 });
    if (hero) observer.observe(hero);
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('blur', reset);
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', move);
      window.removeEventListener('blur', reset);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return <><div className="cursor-atmosphere" aria-hidden="true"><span className="cursor-layer cursor-layer-back" /><span className="cursor-layer cursor-layer-glow" /><span className="cursor-layer cursor-layer-particle" /></div><span className="cursor-core" aria-hidden="true" /><span className="cursor-ring" aria-hidden="true" /></>;
}
