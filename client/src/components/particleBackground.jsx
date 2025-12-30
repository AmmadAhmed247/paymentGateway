import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBg() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      init={particlesInit}
      className="absolute inset-0 z-0"
      options={{
        background: { color: "transparent" },
        fpsLimit: 60,
        particles: {
          number: { value: 60 },
          color: { value: "#ffffff" },
          opacity: { value: 4 },
          size: { value: { min: 1, max: 3 } },
          move: {
            enable: true,
            speed: 0.6,
          },
          links: {
            enable: true,
            distance: 140,
            opacity: 0.2,
          },
        },
        detectRetina: true,
      }}
    />
  );
}
