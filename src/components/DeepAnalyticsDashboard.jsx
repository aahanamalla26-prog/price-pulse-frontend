import React, { useState } from 'react';

const DeepAnalyticsDashboard = () => {
  const [metricTab, setMetricTab] = useState('volatility');

  const analyticsData = {
    volatility: {
      title: "market volatility index",
      subtitle: "measuring price swings and artificial festival inflation across platforms",
      stat: "14.2% avg swing",
      status: "high fluctuation ⚠️",
      items: [
        { name: "apple iphone 15", index: "8.4 / 10", risk: "medium-low", note: "predictable festival drops" },
        { name: "macbook air m2", index: "4.1 / 10", risk: "low", note: "stable pricing curve" },
        { name: "sony bravia 4k tv", index: "9.5 / 10", risk: "high", note: "wild weekend flash cuts" },
        { name: "playstation 5 slim", index: "7.8 / 10", risk: "medium", note: "drops during summer fests" }
      ]
    },
    prediction: {
      title: "next festival price predictor",
      subtitle: "ai forecasting models estimating markdown percentages for upcoming sales",
      stat: "diwali drop forecast",
      status: "processing live data 🔮",
      items: [
        { name: "apple iphone 15", index: "₹57,999 est.", risk: "-12% drop", note: "expected nov 1st week" },
        { name: "macbook air m2", index: "₹82,490 est.", risk: "-8% drop", note: "expected flash sale" },
        { name: "sony bravia 4k tv", index: "₹47,990 est.", risk: "-15% drop", note: "clearing old inventory" },
        { name: "playstation 5 slim", index: "₹38,500 est.", risk: "-14% drop", note: "bundled festival offer" }
      ]
    },
    inflation: {
      title: "fake discount checker (shadow markup)",
      subtitle: "exposing e-commerce sites that jack up prices right before a 'sale'",
      stat: "23% fake cuts caught",
      status: "audit active 🕵️‍♂️",
      items: [
        { name: "apple iphone 15", index: "authentic", risk: "0% markup", note: "real structural cuts" },
        { name: "macbook air m2", index: "suspicious", risk: "+15% phantom", note: "inflated prior to sale" },
        { name: "sony bravia 4k tv", index: "authentic", risk: "2% markup", note: "mostly honest tracking" },
        { name: "playstation 5 slim", index: "flagged", risk: "+18% phantom", note: "fake 'slash' detected" }
      ]
    }
  };

  const activeData = analyticsData[metricTab];

  return (
    <div 
      id="analytics-deep-view"
      style={{ 
        position: 'relative',
        zIndex: 1,
        padding: '40px 20px 80px 20px',
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.85)', 
        border: '1px solid rgba(167, 139, 250, 0.4)', 
        borderRadius: '24px', 
        padding: '36px',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(167, 139, 250, 0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#a78bfa', margin: 0, textTransform: 'lowercase', letterSpacing: '-0.03em' }}>
            📊 deep analytics & market intelligence
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(167, 139, 250, 0.3)', fontWeight: '600' }}>
            {activeData.status}
          </span>
        </div>
        <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '0.95rem' }}>
          {activeData.subtitle}
        </p>

        {/* Tab Switcher Controls */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          {[
            { id: 'volatility', label: 'volatility index' },
            { id: 'prediction', label: 'festival AI predictor' },
            { id: 'inflation', label: 'phantom markup detector' }
          ].map((tab) => {
            const isSelected = metricTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMetricTab(tab.id)}
                style={{
                  background: isSelected ? 'rgba(167, 139, 250, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid #a78bfa' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#a78bfa' : '#94a3b8',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: isSelected ? '700' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'lowercase',
                  fontSize: '0.85rem'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Highlight Main Metric Box */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>primary telemetry metric</span>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginTop: '2px', textTransform: 'lowercase' }}>{activeData.title}</div>
          </div>
          <div style={{ background: 'rgba(103, 232, 249, 0.1)', border: '1px solid rgba(103, 232, 249, 0.2)', padding: '8px 16px', borderRadius: '10px', color: '#67e8f9', fontWeight: '700', fontSize: '0.95rem' }}>
            {activeData.stat}
          </div>
        </div>

        {/* Data Breakdown Table / List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeData.items.map((row, idx) => (
            <div 
              key={idx}
              style={{ 
                background: 'rgba(5, 6, 16, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '16px 20px',
                borderRadius: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
            >
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '0.95rem', textTransform: 'lowercase', fontWeight: '700' }}>{row.name}</h4>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>status note: <strong style={{ color: '#94a3b8' }}>{row.note}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>{row.index}</span>
                <span style={{ 
                  background: 'rgba(167, 139, 250, 0.1)', 
                  color: '#a78bfa', 
                  padding: '4px 10px', 
                  borderRadius: '8px', 
                  fontSize: '0.8rem', 
                  fontWeight: '600',
                  border: '1px solid rgba(167, 139, 250, 0.2)'
                }}>
                  {row.risk}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DeepAnalyticsDashboard;