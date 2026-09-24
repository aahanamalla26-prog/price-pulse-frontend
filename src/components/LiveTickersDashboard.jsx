import React from 'react';

const LiveTickersDashboard = () => {
  const liveFeeds = [
    { item: "apple ipad air m2", platform: "amazon in", oldPrice: "₹59,990", newPrice: "₹54,990", time: "1m ago", drop: "-8%" },
    { item: "samsung galaxy s24", platform: "flipkart", oldPrice: "₹74,990", newPrice: "₹67,999", time: "4m ago", drop: "-9%" },
    { item: "boat rockerz 450", platform: "amazon in", oldPrice: "₹1,990", newPrice: "₹1,299", time: "12m ago", drop: "-35%" },
    { item: "dell g15 gaming laptop", platform: "reliance digital", oldPrice: "₹78,990", newPrice: "₹71,500", time: "18m ago", drop: "-9%" }
  ];

  return (
    <div 
      id="tickers-view"
      style={{ 
        position: 'relative',
        zIndex: 1,
        padding: '40px 20px 80px 20px',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.8)', 
        border: '1px solid rgba(103, 232, 249, 0.3)', 
        borderRadius: '24px', 
        padding: '36px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#67e8f9', margin: 0, textTransform: 'lowercase', letterSpacing: '-0.03em' }}>
            ⚡ live price tickers & drops
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#67e8f9', background: 'rgba(103, 232, 249, 0.1)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(103, 232, 249, 0.3)', fontWeight: '600' }}>
            websocket active 🟢
          </span>
        </div>
        <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '0.95rem' }}>
          sub-second feeds tracking random price cuts across top indian e-commerce sites. blink and you'll miss it.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {liveFeeds.map((feed, idx) => (
            <div 
              key={idx}
              style={{ 
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '16px 20px',
                borderRadius: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '1rem', textTransform: 'lowercase' }}>{feed.item}</h4>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>found on <strong style={{ color: '#94a3b8' }}>{feed.platform}</strong> • {feed.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ textDecoration: 'line-through', color: '#64748b', fontSize: '0.85rem', marginRight: '8px' }}>{feed.oldPrice}</span>
                  <span style={{ color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>{feed.newPrice}</span>
                </div>
                <span style={{ 
                  background: 'rgba(52, 211, 153, 0.15)', 
                  color: '#34d399', 
                  padding: '4px 10px', 
                  borderRadius: '8px', 
                  fontSize: '0.85rem', 
                  fontWeight: '700' 
                }}>
                  {feed.drop}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTickersDashboard;