import { useEffect, useState } from 'react';

const SPICES = [
  { id: 'turmeric', src: '/images/floating/turmeric.png', className: 'spice-1', angle: 0 },
  { id: 'chilli', src: '/images/floating/chilli.png', className: 'spice-2', angle: 36 },
  { id: 'cumin', src: '/images/floating/cumin.png', className: 'spice-3', angle: 72 },
  { id: 'coriander', src: '/images/floating/coriander.png', className: 'spice-4', angle: 108 },
  { id: 'cinnamon', src: '/images/floating/cinnamon.png', className: 'spice-5', angle: 144 },
  { id: 'ginger', src: '/images/floating/ginger.png', className: 'spice-6', angle: 180 },
  { id: 'cardamom', src: '/images/floating/cardamom.png', className: 'spice-7', angle: 216 },
  { id: 'cloves', src: '/images/floating/cloves.png', className: 'spice-8', angle: 252 },
  { id: 'mixed', src: '/images/floating/mixed.png', className: 'spice-9', angle: 288 },
  { id: 'blackpep', src: '/images/floating/blackpep.png', className: 'spice-10', angle: 324 },
];

export default function FloatingSpices() {
  const [phase, setPhase] = useState('boot');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPhase('float');
      return undefined;
    }

    const boot = window.setTimeout(() => setPhase('orbit'), 80);
    const settle = window.setTimeout(() => setPhase('settle'), 80);
    const float = window.setTimeout(() => setPhase('float'), 3200);

    return () => {
      window.clearTimeout(boot);
      window.clearTimeout(settle);
      window.clearTimeout(float);
    };
  }, []);

  return (
    <div className={`spice-stage spice-phase-${phase}`} aria-hidden="true">
      {SPICES.map((spice, index) => (
        <img
          key={spice.id}
          className={`float-spice ${spice.className}`}
          src={spice.src}
          alt=""
          style={{
            '--spice-angle': `${spice.angle}deg`,
            '--spice-delay': `${index * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}
