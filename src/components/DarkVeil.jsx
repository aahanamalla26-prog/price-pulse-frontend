import React, { useEffect, useRef } from 'react';

export default function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0,
  scanlineIntensity = 0,
  speed = 0.5,
  scanlineFrequency = 0,
  warpAmount = 0
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.01 * speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cyberpunk dark background gradient shift
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const baseHue = 210 + hueShift;
      gradient.addColorStop(0, `hsl(${baseHue}, 80%, 4%)`);
      gradient.addColorStop(0.5, `hsl(${baseHue + 20}, 70%, 2%)`);
      gradient.addColorStop(1, `hsl(${baseHue - 30}, 90%, 1%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dynamic glowing wave effect lines
      ctx.strokeStyle = `hsla(${baseHue + 120}, 100%, 50%, 0.15)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 10) {
        const y = Math.sin(x * 0.005 + time + warpAmount) * 40 + Math.cos(x * 0.01 - time) * 20 + canvas.height / 2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}
    />
  );
}