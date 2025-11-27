import React, { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

interface Props {
  theme: string;
}

const ParticleBackground: React.FC<Props> = ({ theme }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = {
    background: {
      color: {
        value: '#000000',
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse',
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        repulse: {
          distance: 150,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: ['#00f3ff', '#ff00ff'],
      },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.1,
        width: 1,
      },
      move: {
        direction: 'none' as const,
        enable: true,
        outModes: {
          default: 'out' as const,
        },
        random: false,
        speed: 10,
        straight: false,
        trail: {
          enable: true,
          length: 10,
          fill: {
            color: '#000000',
          },
        },
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 30,
      },
      opacity: {
        value: 1,
      },
      shape: {
        type: 'circle' as const,
      },
      size: {
        value: { min: 3, max: 5 },
      },
    },
    detectRetina: true,
  };

  if (init) {
    return <Particles id="tsparticles" options={options} className="absolute z-0 w-full h-full" />;
  }

  return <></>;
};

export default ParticleBackground;
