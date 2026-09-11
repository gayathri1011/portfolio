import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const navigation = [
  ['hero', 'Home'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['certifications', 'Certifications'],
  ['contact', 'Contact'],
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sections = navigation
      .map(([id]) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-18% 0px -58% 0px', threshold: [0.1, 0.35, 0.7] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return <header className="navbar">
    <a className="wordmark" href="#hero" onClick={closeMenu} aria-label="Go to home">RG</a>
    <nav className={menuOpen ? 'open' : ''} aria-label="Primary navigation">
      {navigation.map(([id, label], index) => <motion.a
        key={id}
        href={`#${id}`}
        className={activeSection === id ? 'active' : ''}
        aria-current={activeSection === id ? 'page' : undefined}
        onClick={closeMenu}
        whileHover={reduceMotion ? undefined : { y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      ><span>0{index + 1}</span>{label}</motion.a>)}
    </nav>
    <button className="menu-button" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? 'CLOSE' : 'MENU'} <i /></button>
  </header>;
}
