import { useEffect, useRef, useState } from 'react';

const GlowCursor = ({
  color = "#67E8F9",
  secondaryColor = "#A78BFA",
  followSpeed = 0.16,
  glowIntensity = 1.9,
  opacity = 1,
  idleFade = true,
  idleTimeout = 700,
  fadeDuration = 900,
  blendMode = "screen",
  children
}) => {
  const glowRef = useRef(null);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (idleFade) {
        setIsIdle(false);
        clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => {
          setIsIdle(true);
        }, idleTimeout);
      }
    };

    const render = () => {
      currentX += (mouseX - currentX) * followSpeed;
      currentY += (mouseY - currentY) * followSpeed;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove);
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(idleTimer.current);
    };
  }, [followSpeed, idleFade, idleTimeout]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Smaller Glow Follower Element */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: '-75px',
          left: '-75px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, ${secondaryColor} 60%, transparent 85%)`,
          opacity: isIdle ? 0 : opacity,
          filter: `brightness(${glowIntensity})`,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: blendMode,
          transition: `opacity ${fadeDuration}ms ease-out`,
        }}
      />
      {children}
    </div>
  );
};

export default GlowCursor;