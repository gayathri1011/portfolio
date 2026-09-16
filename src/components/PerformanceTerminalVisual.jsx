import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const terminalLines = [
  'Building intelligent systems...',
  'Solving real-world problems...',
  'Deploying to the cloud...',
  'Creating meaningful impact...',
  'Welcome to my portfolio _',
];

export default function PerformanceTerminalVisual() {
  const reduceMotion = useReducedMotion();
  const terminalRef = useRef(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: terminalRef, offset: ['start end', 'end start'] });
  const scrollY = useTransform(scrollYProgress, [0, .28, .68, 1], [42, 0, 0, -32]);
  const scrollRotate = useTransform(scrollYProgress, [0, .28, .68, 1], [5, 0, 0, -3]);
  const scrollScale = useTransform(scrollYProgress, [0, .28, .68, 1], [.94, 1, 1, .96]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    if (lineIndex >= terminalLines.length) {
      const pause = window.setTimeout(() => {
        setLineIndex(0);
        setCharacterIndex(0);
      }, 1700);
      return () => window.clearTimeout(pause);
    }
    const currentLine = terminalLines[lineIndex];
    if (characterIndex < currentLine.length) {
      const timer = window.setTimeout(() => setCharacterIndex((value) => value + 1), 42);
      return () => window.clearTimeout(timer);
    }
    const nextLine = window.setTimeout(() => {
      setLineIndex((value) => value + 1);
      setCharacterIndex(0);
    }, 480);
    return () => window.clearTimeout(nextLine);
  }, [characterIndex, lineIndex, reduceMotion]);

  const visibleLines = reduceMotion
    ? terminalLines
    : terminalLines.slice(0, lineIndex).concat(lineIndex < terminalLines.length ? terminalLines[lineIndex].slice(0, characterIndex) : []);

  return (
    <motion.div
      ref={terminalRef}
      className="terminal-visual"
      style={{
        y: reduceMotion ? 0 : scrollY,
        rotateX: reduceMotion ? 0 : scrollRotate,
        rotateY: reduceMotion ? 0 : -8,
        scale: reduceMotion ? 1 : scrollScale,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="terminal-glow" />
      <div className="terminal-window">
        <div className="terminal-header">
          <span className="terminal-dot dot-red" />
          <span className="terminal-dot dot-yellow" />
          <span className="terminal-dot dot-green" />
          <span className="terminal-title">rsg@portfolio:~</span>
        </div>
        <div className="terminal-body">
          <div className="terminal-prompt"><span>rsg@portfolio</span><b>:</b><i>~</i><strong>$</strong></div>
          {visibleLines.map((line, index) => (
            <div className="terminal-line" key={`${line}-${index}`}>
              <span className="terminal-arrow">&gt;</span>
              <span>{line}</span>
              {index === visibleLines.length - 1 && !reduceMotion && <span className="terminal-caret" />}
            </div>
          ))}
          {reduceMotion && <span className="terminal-caret terminal-caret-static" />}
        </div>
      </div>
    </motion.div>
  );
}
