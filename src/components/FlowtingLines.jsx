import { useEffect, useRef } from 'react';

const FlowtingLines = ({
  enabledWaves = ["top", "middle", "bottom"],
  lineCount = 8,
  lineDistance = 8,
  bendRadius = 8,
  bendStrength = -2,
  interactive = true,
  parallax = true,
  animationSpeed = 1,
  gradientStart = "#e945f5",
  gradientMid = "#6f6f6f",
  gradientEnd = "#6a6a6a"
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let step = 0;

    const render = () => {
      step += 0.02 * animationSpeed;
      
      if (parallax) {
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
      } else {
        mouseX = targetMouseX;
        mouseY = targetMouseY;
      }

      ctx.clearRect(0, 0, width, height);

      const waveConfigs = {
        top: height * 0.25,
        middle: height * 0.5,
        bottom: height * 0.75
      };

      enabledWaves.forEach((waveKey) => {
        const baseY = waveConfigs[waveKey] || height * 0.5;
        const totalLines = typeof lineCount === 'number' ? lineCount : 8;
        const dist = typeof lineDistance === 'number' ? lineDistance : 8;

        for (let i = 0; i < totalLines; i++) {
          ctx.beginPath();
          
          const grad = ctx.createLinearGradient(0, 0, width, 0);
          grad.addColorStop(0, gradientStart);
          grad.addColorStop(0.5, gradientMid);
          grad.addColorStop(1, gradientEnd);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;

          const lineOffset = (i - totalLines / 2) * dist;

          for (let x = 0; x < width; x += 10) {
            const waveY = baseY + lineOffset + Math.sin(x * 0.005 + step + i * 0.2) * 20;

            let bendOffset = 0;
            if (interactive) {
              const dx = x - mouseX;
              const dy = waveY - mouseY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const radius = bendRadius * 25;

              if (distance < radius) {
                const force = (1 - distance / radius) * bendStrength * 20;
                bendOffset = force;
              }
            }

            const finalY = waveY + bendOffset;

            if (x === 0) {
              ctx.moveTo(x, finalY);
            } else {
              ctx.lineTo(x, finalY);
            }
          }
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabledWaves, lineCount, lineDistance, bendRadius, bendStrength, interactive, parallax, animationSpeed, gradientStart, gradientMid, gradientEnd]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    />
  );
};

export default FlowtingLines;