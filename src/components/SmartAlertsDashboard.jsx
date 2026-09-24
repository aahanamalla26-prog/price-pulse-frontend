import React, { useState } from 'react';

const SmartAlertsDashboard = () => {
  const [contact, setContact] = useState('');
  const [itemChoice, setItemChoice] = useState('iphone15');
  const [targetPrice, setTargetPrice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contact) return;
    setSubmitted(true);
  };

  return (
    <div 
      id="alerts-view"
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
        border: '1px solid rgba(52, 211, 153, 0.3)', 
        borderRadius: '24px', 
        padding: '36px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#34d399', margin: 0, textTransform: 'lowercase', letterSpacing: '-0.03em' }}>
            🛡️ smart alerts & drop triggers
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.3)', fontWeight: '600' }}>
            instant dispatch 🚀
          </span>
        </div>
        <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '0.95rem' }}>
          drop your email or phone number. we'll ping you the exact second your item hits your target price.
        </p>

        {submitted ? (
          <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
            <h3 style={{ color: '#34d399', margin: '0 0 8px 0', textTransform: 'lowercase', fontWeight: '800' }}>✨ you're officially locked in!</h3>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>we'll ping <strong>{contact}</strong> the moment prices dip below your target.</p>
            <button 
              onClick={() => setSubmitted(false)}
              style={{ 
                marginTop: '16px', 
                background: 'transparent', 
                border: '1px solid #34d399', 
                color: '#34d399', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontSize: '0.85rem',
                textTransform: 'lowercase'
              }}
            >
              set another alert
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'lowercase' }}>email or phone number</label>
              <input 
                type="text" 
                placeholder="e.g., alex@gmail.com or +91 98765 43210" 
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                style={{ 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  padding: '14px', 
                  borderRadius: '12px', 
                  color: '#fff', 
                  fontSize: '0.95rem', 
                  outline: 'none' 
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'lowercase' }}>choose item</label>
                <select 
                  value={itemChoice}
                  onChange={(e) => setItemChoice(e.target.value)}
                  style={{ 
                    background: '#0f172a', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    padding: '14px', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '0.95rem', 
                    outline: 'none' 
                  }}
                >
                  <option value="iphone15">apple iphone 15</option>
                  <option value="macbook">macbook air m2</option>
                  <option value="tv">sony bravia 55" 4k tv</option>
                  <option value="ps5">playstation 5 slim</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'lowercase' }}>target price (inr)</label>
                <input 
                  type="text" 
                  placeholder="e.g., ₹58,000" 
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  required
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    padding: '14px', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '0.95rem', 
                    outline: 'none' 
                  }}
                />
              </div>
            </div>

            <button 
              type="submit"
              style={{ 
                marginTop: '10px',
                padding: '14px', 
                background: 'linear-gradient(135deg, #34d399 0%, #67e8f9 100%)', 
                color: '#050610', 
                fontWeight: '800', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer',
                textTransform: 'lowercase',
                fontSize: '1rem',
                boxShadow: '0 0 20px rgba(52, 211, 153, 0.3)'
              }}
            >
              lock in alert 🔔
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SmartAlertsDashboard;