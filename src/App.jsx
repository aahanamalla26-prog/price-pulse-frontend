import React, { useState } from 'react';
import GlowCursor from "./components/GlowCursor";
import ShinyText from "./components/ShinyText";
import FlowtingLines from "./components/FlowtingLines";
import CurvedLoop from "./components/CurvedLoop";
import MarketDashboard from "./components/MarketDashboard";
import LiveTickersDashboard from "./components/LiveTickersDashboard";
import SmartAlertsDashboard from "./components/SmartAlertsDashboard";
import DeepAnalyticsDashboard from "./components/DeepAnalyticsDashboard";
import Shuffle from './components/Shuffle';
import ChromaGrid from './components/ChromaGrid';

function App() {
  const [activeDashboard, setActiveDashboard] = useState(null);

  const handleOpenDashboard = (type) => {
    setActiveDashboard(type);
    setTimeout(() => {
      const element = document.getElementById(
        type === 'tickers' ? 'tickers-view' : 
        type === 'alerts' ? 'alerts-view' : 
        type === 'deep-analytics' ? 'analytics-deep-view' : 'dashboard-view'
      );
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const communityPillars = [
    {
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
      title: "live tickers",
      subtitle: "sub-second websocket feed",
      handle: "@tickers",
      borderColor: "#22c55e",
      gradient: "linear-gradient(145deg, #0f172a, #020617)",
      onClick: () => handleOpenDashboard('tickers')
    },
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      title: "deep telemetry",
      subtitle: "ai festival predictors",
      handle: "@telemetry",
      borderColor: "#38bdf8",
      gradient: "linear-gradient(180deg, #0f172a, #020617)",
      onClick: () => handleOpenDashboard('deep-analytics')
    },
    {
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
      title: "smart alerts",
      subtitle: "historic low ping system",
      handle: "@alerts",
      borderColor: "#4ade80",
      gradient: "linear-gradient(165deg, #0f172a, #020617)",
      onClick: () => handleOpenDashboard('alerts')
    }
  ];

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      minHeight: '100vh', 
      background: '#020617', 
      color: '#f8fafc',
      overflowX: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Background Floating Lines */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '600px', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }}>
        <FlowtingLines 
          enabledWaves={["top","middle","bottom"]}
          lineCount={8}
          lineDistance={8}
          bendRadius={8}
          bendStrength={-2}
          interactive
          parallax={true}
          animationSpeed={1}
          gradientStart="#10b981" 
          gradientMid="#0284c7"   
          gradientEnd="#38bdf8"   
        />
      </div>

      <GlowCursor
        color="#22c55e" 
        secondaryColor="#3b82f6" 
        followSpeed={0.16}
        glowIntensity={2.1}
        opacity={1}
        idleFade
        idleTimeout={700}
        fadeDuration={900}
        blendMode="screen"
      >
        {/* Hero Section */}
        <div style={{ 
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '70vh',
          justifyContent: 'center',
          padding: '60px 20px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{ 
            marginBottom: '16px', 
            padding: '6px 16px', 
            background: 'rgba(34, 197, 94, 0.1)', 
            border: '1px solid rgba(34, 197, 94, 0.4)', 
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#4ade80'
          }}>
            <ShinyText text="⚡ price drops tracked in real-time" speed={4} />
          </div>

          <Shuffle
            text="pricepulse"
            className="text-6xl md:text-8xl font-extrabold tracking-tight text-white lowercase"
            shuffleDirection="right"
            duration={0.35}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            triggerOnce={true}
            triggerOnHover={true}
            colorTo="#22c55e"
          />

          <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '600px', marginTop: '20px', lineHeight: '1.5', letterSpacing: '-0.01em' }}>
            stop overpaying. track historical receipts, spot seasonal sales dips, and never take an L on tech purchases again.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={() => handleOpenDashboard('analytics')}
              style={{ 
                padding: '12px 28px', 
                background: 'linear-gradient(135deg, #22c55e 0%, #0284c7 100%)', 
                color: '#020617', 
                fontWeight: '800', 
                border: 'none', 
                borderRadius: '10px', 
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(34, 197, 94, 0.4)',
                transition: 'transform 0.2s ease',
                textTransform: 'lowercase',
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              launch dashboard 🚀
            </button>
          </div>
        </div>

        {/* Dynamic Dashboard Views */}
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 40px 20px', position: 'relative', zIndex: 1 }}>
          {activeDashboard === 'analytics' && <MarketDashboard />}
          {activeDashboard === 'tickers' && <LiveTickersDashboard />}
          {activeDashboard === 'alerts' && <SmartAlertsDashboard />}
          {activeDashboard === 'deep-analytics' && <DeepAnalyticsDashboard />}
        </div>

        {/* ChromaGrid Spotlight Showcase Section */}
        <div style={{ position: 'relative', padding: '20px 20px 60px 20px', maxWidth: '1200px', margin: '0 auto', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: '800', textTransform: 'lowercase' }}>
              ✦ telemetry modules
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              hover and click any module to instantly open its real-time dashboard view
            </p>
          </div>
          
          <ChromaGrid 
            items={communityPillars}
            radius={280}
            damping={0.4}
            fadeOut={0.6}
            ease="power3.out"
            columns={3}
            rows={1}
          />
        </div>

        {/* CurvedLoop Marquee */}
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '30px 0', opacity: 0.9, zIndex: 1 }}>
          <CurvedLoop 
            marqueeText="Be ✦ Smart ✦ Never ✦ Overpay ✦ Track ✦ The ✦ Dips ✦"
            speed={2}
            curveAmount={300}
            direction="right"
            interactive
            className="text-emerald-400 font-bold lowercase tracking-wider text-base"
          />
        </div>
      </GlowCursor>
    </div>
  );
}

export default App;