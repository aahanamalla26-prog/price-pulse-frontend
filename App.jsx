import React from 'react';
import SplitText from "./components/SplitText";
import GlowCursor from "./components/GlowCursor";
import ShinyText from "./components/ShinyText";

function App() {
  const handleAnimationComplete = () => {
    console.log('Title animation completed!');
  };

  const handleCardClick = (featureName) => {
    alert(`Navigating to ${featureName} dashboard...`);
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      minHeight: '100vh', 
      background: '#050610', 
      color: '#ffffff',
      overflowX: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <GlowCursor
        color="#67E8F9"
        secondaryColor="#A78BFA"
        followSpeed={0.16}
        glowIntensity={1.9}
        opacity={1}
        idleFade
        idleTimeout={700}
        fadeDuration={900}
        blendMode="screen"
      >
        {/* Hero Section */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '75vh',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          {/* Shimmering Badge */}
          <div style={{ 
            marginBottom: '16px', 
            padding: '6px 16px', 
            background: 'rgba(103, 232, 249, 0.1)', 
            border: '1px solid rgba(103, 232, 249, 0.3)', 
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            <ShinyText text="✨ Real-Time Intelligence v2.0 is Live" speed={4} />
          </div>

          <SplitText
            text="PricePulse"
            className="text-6xl md:text-8xl font-extrabold tracking-tight text-white"
            delay={50}
            animationFrom={{ opacity: 0, transform: 'translate3d(0,40px,0)' }}
            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            easing="power3.out"
            threshold={0.1}
            rootMargin="-100px"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          <p style={{ color: '#94A3B8', fontSize: '1.25rem', maxWidth: '600px', marginTop: '20px', lineHeight: '1.6' }}>
            Predictive pricing analytics, high-velocity market feeds, and intelligent monitoring built for modern systems.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
            <button style={{ 
              padding: '12px 28px', 
              background: 'linear-gradient(135deg, #67E8F9 0%, #A78BFA 100%)', 
              color: '#050610', 
              fontWeight: 'bold', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(103, 232, 249, 0.3)',
            }}>
              Launch Dashboard
            </button>
            <button style={{ 
              padding: '12px 28px', 
              background: 'transparent', 
              color: '#ffffff', 
              fontWeight: 'bold', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}>
              Explore APIs
            </button>
          </div>
        </div>

        {/* Clickable Feature Cards Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          padding: '20px 60px 100px 60px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            { title: "⚡ Live Tickers", color: "#67E8F9", desc: "Sub-second websocket feeds tracking market changes globally without latency." },
            { title: "🛡️ Smart Alerts", color: "#A78BFA", desc: "Custom threshold triggers that notify you instantly when pricing shifts occur." },
            { title: "📊 Deep Analytics", color: "#34D399", desc: "Comprehensive architectural visualizers and trend reporting tools." }
          ].map((card, idx) => (
            <div 
              key={idx}
              onClick={() => handleCardClick(card.title)}
              style={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid rgba(255, 255, 255, 0.06)', 
                padding: '28px', 
                borderRadius: '16px', 
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = card.color;
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <h3 style={{ color: card.color, fontSize: '1.25rem', marginBottom: '10px' }}>{card.title}</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </GlowCursor>
    </div>
  );
}

export default App;