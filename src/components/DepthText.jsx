import React, { useEffect, useRef, useState } from 'react';

export default function DepthText({
  text = "Elevate",
  layers = 34,
  depth = 2.4,
  faceColor = "#f8fafc",
  depthColor = "#7c3aed",
  tilt = 7.5,
  pointerTracking = true,
  smoothing = 0.14,
  perspective = 900,
  autoOrbit = true,
  orbitSpeed = 0.35,
  fontSize = "clamp(3rem, 12vw, 7rem)",
  fontWeight = 900,
  shadow = true
}) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Handle pointer tracking across the window/container
  useEffect(() => {
    if (!pointerTracking) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // range -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [pointerTracking]);

  // Handle auto-orbit loop
  useEffect(() => {
    if (!autoOrbit) return;
    let animationFrame;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setOrbitAngle((prev) => prev + orbitSpeed * delta * 50);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [autoOrbit, orbitSpeed]);

  // Calculate dynamic rotation based on orbit and mouse interaction
  const baseRotationY = autoOrbit ? Math.sin(orbitAngle * 0.02) * tilt : 0;
  const baseRotationX = autoOrbit ? Math.cos(orbitAngle * 0.02) * (tilt * 0.5) : 0;
  
  const finalRotX = baseRotationX + mousePos.y * tilt;
  const finalRotY = baseRotationY + mousePos.x * tilt;

  return (
    <div
      ref={containerRef}
      style={{
        perspective: `${perspective}px`,
        display: 'inline-block',
        textAlign: 'center',
        userSelect: 'none',
        cursor: pointerTracking ? 'pointer' : 'default',
        padding: '20px 0'
      }}
    >
      <div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${-finalRotX}deg) rotateY(${finalRotY}deg)`,
          transition: `transform ${smoothing}s cubic-bezier(0.15, 0.85, 0.35, 1)`,
        }}
      >
        {Array.from({ length: layers }).map((_, index) => {
          const isFront = index === 0;
          const zOffset = (layers - index) * depth;
          const currentColor = isFront ? faceColor : depthColor;

          return (
            <span
              key={index}
              style={{
                position: isFront ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                right: 0,
                display: 'block',
                fontSize: fontSize,
                fontWeight: fontWeight,
                lineHeight: 1.1,
                color: currentColor,
                transform: `translateZ(${zOffset}px)`,
                zIndex: layers - index,
                pointerEvents: 'none',
                textShadow: shadow && isFront ? '0 20px 40px rgba(0,0,0,0.5)' : 'none',
                opacity: isFront ? 1 : 0.85 - (index / layers) * 0.3
              }}
            >
              {text}
            </span>
          );
        })}
      </div>
    </div>
  );
}