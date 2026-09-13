import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 7, suffix: '+', label: 'Years of Tradition' },
  { value: 5000, suffix: '+', label: 'Happy Customers' },
  { value: 50, suffix: '+', label: 'Local Farmers' },
  { value: 100, suffix: '%', label: 'Organic Spices' },
];

function useCountUp(target, active) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    const duration = 1400;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.floor(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);

  return value;
}

function StatItem({ value, suffix, label }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, active);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stat-item" ref={ref}>
      <strong>
        {count.toLocaleString()}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="stats-section">
      <div className="container stats-grid">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
