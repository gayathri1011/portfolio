const revealItems = document.querySelectorAll('.reveal, .project, .skill-row, .timeline-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

const style = document.createElement('style');
style.textContent = `.project, .skill-row, .timeline-item { opacity: 0; transform: translateY(18px); transition: opacity .7s ease, transform .7s ease, border-color .3s, background .3s; } .project.is-visible, .skill-row.is-visible, .timeline-item.is-visible { opacity: 1; transform: none; }`;
document.head.appendChild(style);
