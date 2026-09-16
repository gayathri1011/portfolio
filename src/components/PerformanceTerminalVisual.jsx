import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const terminalLines = [
  'Building intelligent systems...',
  'Solving real-world problems...',
  'Deploying to the cloud...',
  'Creating meaningful impact...',
  'Welcome to my portfolio _',
];

export default function PerformanceTerminalVisual() {
  const reduceMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);

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
      const timer = window.setTimeout(() => setCharacterIndex((value) => value + 1), 35);
      return () => window.clearTimeout(timer);
    }

    const nextLine = window.setTimeout(() => {
      setLineIndex((value) => value + 1);
      setCharacterIndex(0);
    }, 360);
    return () => window.clearTimeout(nextLine);
  }, [characterIndex, lineIndex, reduceMotion]);

  const visibleLines = reduceMotion
    ? terminalLines
    : terminalLines.slice(0, lineIndex).concat(lineIndex < terminalLines.length ? terminalLines[lineIndex].slice(0, characterIndex) : []);

  return (
    <motion.div
      className="terminal-visual"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
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
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
