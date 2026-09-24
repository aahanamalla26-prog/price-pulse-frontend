import React, { useState, useEffect } from 'react';
import DarkVeil from './DarkVeil';
import DepthText from './DepthText';

export default function MarketDashboard() {
  const [livePrice, setLivePrice] = useState(104950.00);
  const [isSimulating, setIsSimulating] = useState(true);

  // Simulate live price micro-fluctuations in rupees
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setLivePrice((prev) => +(prev + (Math.random() * 400 - 200)).toFixed(2));
    }, 2000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const marketStats = [
    { label: "tracked items", value: "48,291", change: "+12% this week", color: "#22c55e" },
    { label: "active price drops", value: "1,420", change: "historic low", color: "#38bdf8" },
    { label: "avg savings secured", value: "24.5%", change: "vs retail baseline", color: "#4ade80" },
    { label: "websocket ping", value: "14ms", change: "sub-second optimal", color: "#a855f7" }
  ];

  const recentDrops = [
    { item: "sony wh-1000xm5 headphones", platform: "amazon india", oldPrice: "₹29,990", newPrice: "₹21,990", drop: "-27%" },
    { item: "macbook pro 16\" m3 max", platform: "flipkart", oldPrice: "₹3,49,900", newPrice: "₹3,19,900", drop: "-9%" },
    { item: "dell ultrasharp 32 4k monitor", platform: "amazon india", oldPrice: "₹82,000", newPrice: "₹64,900", drop: "-21%" },
    { item: "asus rog ally z1 extreme", platform: "flipkart", oldPrice: "₹69,990", newPrice: "₹49,990", drop: "-28%" }
  ];

  return (
    <div id="dashboard-view" style={{ 
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      maxWidth: '1000px',
      margin: '40px auto',
      boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(34, 197, 94, 0.1)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* DarkVeil Background Wrapper */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}>
        <DarkVeil />
      </div>

      {/* Main Foreground Content Layer */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        background: 'linear-gradient(165deg, rgba(9, 13, 22, 0.85) 0%, rgba(2, 6, 23, 0.92) 100%)',
        backdropFilter: 'blur(12px)',
        padding: '40px',
        color: '#f8fafc'
      }}>
        
        {/* 3D DepthText Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px', padding: '10px 0' }}>
          <DepthText
            text="Market Telemetry"
            layers={24}
            depth={2.0}
            faceColor="#f8fafc"
            depthColor="#22c55e"
            tilt={5.0}
            pointerTracking
            smoothing={0.14}
            perspective={900}
            autoOrbit
            orbitSpeed={0.25}
            fontSize="clamp(2.2rem, 6vw, 4rem)"
            fontWeight={900}
            shadow
          />
        </div>

        {/* Dashboard Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '35px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 12px #22c55e' }}></span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                system online // live telemetry active
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', textTransform: 'lowercase', margin: '8px 0 0 0' }}>
              command center 🚀
            </h2>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setIsSimulating(!isSimulating)}
              style={{ 
                background: isSimulating ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isSimulating ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                color: isSimulating ? '#4ade80' : '#94a3b8',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textTransform: 'lowercase'
              }}
            >
              {isSimulating ? '⚡ live feed: active' : '⏸️ feed paused'}
            </button>
          </div>
        </div>

        {/* Grid Stats Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '35px' }}>
          {marketStats.map((stat, idx) => (
            <div key={idx} style={{ 
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'lowercase' }}>{stat.label}</span>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', margin: '6px 0 4px 0' }}>{stat.value}</div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: stat.color }}>{stat.change}</span>
            </div>
          ))}
        </div>

        {/* Live Benchmark Feed Ticker Simulation */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '18px',
          padding: '25px',
          marginBottom: '35px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', textTransform: 'lowercase', margin: 0 }}>
              📈 real-time benchmark index (indian tech basket)
            </h3>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#22c55e' }}>
              ₹{livePrice.toLocaleString('en-IN')} <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>(+1.8%)</span>
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, #22c55e, #38bdf8)', borderRadius: '3px' }}></div>
          </div>
        </div>

        {/* Recent Price Drops Table */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', textTransform: 'lowercase', marginBottom: '16px' }}>
            🔥 verified massive price drops today
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentDrops.map((drop, idx) => (
              <div key={idx} style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '16px 20px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', textTransform: 'lowercase', margin: 0 }}>
                    {drop.item}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    platform: {drop.platform}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'right' }}>
                  <div>
                    <span style={{ textDecoration: 'line-through', color: '#64748b', fontSize: '0.85rem', marginRight: '8px' }}>
                      {drop.oldPrice}
                    </span>
                    <span style={{ color: '#fff', fontWeight: '800', fontSize: '1rem' }}>
                      {drop.newPrice}
                    </span>
                  </div>
                  <span style={{ 
                    background: 'rgba(34, 197, 94, 0.15)', 
                    border: '1px solid rgba(34, 197, 94, 0.4)', 
                    color: '#4ade80', 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem', 
                    fontWeight: '800' 
                  }}>
                    {drop.drop}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}