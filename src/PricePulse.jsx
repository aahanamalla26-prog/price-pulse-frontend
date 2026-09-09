import { useState, useEffect, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Search, TrendingDown, TrendingUp, Minus, Bell, Check } from "lucide-react";

const API_BASE = "https://ai-price-predictions.vercel.app";

/* ---------------- demo data (mirrors backend/seed.py) ---------------- */

const DEMO_PRODUCTS = [
  { id: 1, name: "Sony WH-1000XM5 Headphones", category: "Electronics", currency: "INR", current_price: 26990, trend: "down" },
  { id: 2, name: "Instant Pot Duo 6-Qt", category: "Home & Kitchen", currency: "INR", current_price: 7999, trend: "up" },
  { id: 3, name: "Nike Air Zoom Pegasus 40", category: "Footwear", currency: "INR", current_price: 8995, trend: "down" },
  { id: 4, name: "Logitech MX Master 3S", category: "Electronics", currency: "INR", current_price: 8995, trend: "up" },
  { id: 5, name: "Dyson V11 Vacuum Cleaner", category: "Home & Kitchen", currency: "INR", current_price: 32900, trend: "down" },
  { id: 6, name: "Kindle Paperwhite (11th Gen)", category: "Electronics", currency: "INR", current_price: 13999, trend: "up" },
];

function demoHistory(product) {
  const days = 60;
  const points = [];
  const dir = product.trend === "down" ? 1 : -1;
  let price = product.current_price * (1 + dir * 0.08);
  const drift = (product.current_price - price) / days;
  const seed = product.id * 999;
  for (let i = 0; i < days; i++) {
    const pseudo = Math.sin(seed + i * 12.9898) * 43758.5453;
    const noise = (pseudo - Math.floor(pseudo) - 0.5) * 0.02 * price;
    price = Math.max(price + drift + noise, product.current_price * 0.7);
    const d = new Date();
    d.setDate(d.getDate() - (days - i));
    points.push({ recorded_at: d.toISOString(), price: Math.round(price * 100) / 100 });
  }
  points.push({ recorded_at: new Date().toISOString(), price: product.current_price });
  return points;
}

function linearRegression(xs, ys) {
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  return { slope, intercept: meanY - slope * meanX };
}

function demoPredict(history, daysAhead = 7) {
  const sorted = [...history].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
  const t0 = new Date(sorted[0].recorded_at).getTime();
  const xs = sorted.map((p) => (new Date(p.recorded_at).getTime() - t0) / 86400000);
  const ys = sorted.map((p) => p.price);
  const { slope, intercept } = linearRegression(xs, ys);
  const targetX = xs[xs.length - 1] + daysAhead;
  const predicted = Math.max(intercept + slope * targetX, 0);
  const current = ys[ys.length - 1];
  const threshold = Math.max(current * 0.001, 0.01);
  const trend = slope > threshold ? "up" : slope < -threshold ? "down" : "flat";
  const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
  const ssTot = ys.reduce((a, y) => a + (y - meanY) ** 2, 0);
  const ssRes = ys.reduce((a, y, i) => a + (y - (intercept + slope * xs[i])) ** 2, 0);
  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  const volumeFactor = Math.min(ys.length / 30, 1);
  const confidence = Math.max(0, Math.min(1, 0.5 * rSquared + 0.5 * volumeFactor));
  return {
    predicted_price: Math.round(predicted * 100) / 100,
    trend,
    confidence: Math.round(confidence * 100) / 100,
    basis_points: ys.length,
  };
}

/* ---------------- helpers ---------------- */

const formatPrice = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

const TrendIcon = ({ trend, size = 14 }) => {
  if (trend === "up") return <TrendingUp size={size} />;
  if (trend === "down") return <TrendingDown size={size} />;
  return <Minus size={size} />;
};

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

/* ---------------- main component ---------------- */

export default function PricePulse() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [selectedId, setSelectedId] = useState(DEMO_PRODUCTS[0].id);
  const [history, setHistory] = useState(() => demoHistory(DEMO_PRODUCTS[0]));
  const [prediction, setPrediction] = useState(() => demoPredict(demoHistory(DEMO_PRODUCTS[0])));
  const [demoMode, setDemoMode] = useState(true);
  const [checkingApi, setCheckingApi] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [trackState, setTrackState] = useState("idle"); // idle | sending | done | error

  const selected = useMemo(
    () => products.find((p) => p.id === selectedId) ?? products[0],
    [products, selectedId]
  );

  // Probe the live API once on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchJSON(`${API_BASE}/products?limit=20`);
        if (cancelled) return;
        if (data.items && data.items.length > 0) {
          setProducts(data.items.map((p) => ({ ...p, trend: undefined })));
          setSelectedId(data.items[0].id);
          setDemoMode(false);
        }
      } catch {
        // stay in demo mode
      } finally {
        if (!cancelled) setCheckingApi(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load history + prediction whenever the selected product changes.
  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setLoadingDetail(true);
    (async () => {
      if (demoMode) {
        const h = demoHistory(selected);
        if (!cancelled) {
          setHistory(h);
          setPrediction(demoPredict(h));
          setLoadingDetail(false);
        }
        return;
      }
      try {
        const [h, pred] = await Promise.all([
          fetchJSON(`${API_BASE}/products/${selected.id}/history?days=90`),
          fetchJSON(`${API_BASE}/products/${selected.id}/predict?days_ahead=7`),
        ]);
        if (cancelled) return;
        setHistory(h.points);
        setPrediction(pred);
      } catch {
        if (cancelled) return;
        const h = demoHistory({ ...selected, trend: "down" });
        setHistory(h);
        setPrediction(demoPredict(h));
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selected, demoMode]);

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.category ?? "").toLowerCase().includes(q)
    );
  }, [products, query]);

  const chartData = useMemo(
    () =>
      history.map((p) => ({
        date: new Date(p.recorded_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        price: p.price,
      })),
    [history]
  );

  const handleTrack = useCallback(
    async (e) => {
      e.preventDefault();
      if (!selected || !email || !targetPrice) return;
      setTrackState("sending");
      try {
        if (demoMode) {
          await new Promise((r) => setTimeout(r, 500));
        } else {
          await fetchJSON(`${API_BASE}/products/${selected.id}/track`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, target_price: Number(targetPrice) }),
          });
        }
        setTrackState("done");
      } catch {
        setTrackState("error");
      }
    },
    [selected, email, targetPrice, demoMode]
  );

  const trendColor = (trend) =>
    trend === "down" ? "var(--pp-signal)" : trend === "up" ? "var(--pp-alert)" : "var(--pp-slate)";

  return (
    <div className="pp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');

        .pp-root {
          --pp-ink: #12201c;
          --pp-ink-soft: #33473f;
          --pp-paper: #f0f3f0;
          --pp-panel: #ffffff;
          --pp-signal: #1f9d6e;
          --pp-alert: #d9542f;
          --pp-slate: #6b7c76;
          --pp-line: #d7ded8;
          background: var(--pp-paper);
          color: var(--pp-ink);
          font-family: 'Inter', sans-serif;
          min-height: 100%;
          padding: 40px 20px 60px;
        }
        .pp-wrap { max-width: 860px; margin: 0 auto; }

        .pp-word {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 34px;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .pp-tagline {
          color: var(--pp-ink-soft);
          font-size: 15px;
          margin: 6px 0 0;
        }

        .pp-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: var(--pp-slate);
          margin-top: 14px;
        }
        .pp-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--pp-signal);
        }
        .pp-dot.demo { background: #c7a53a; }
        .pp-dot.live { animation: pp-pulse 1.8s ease-in-out infinite; }
        @keyframes pp-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(31,157,110,0.45); }
          50% { box-shadow: 0 0 0 5px rgba(31,157,110,0); }
        }

        .pp-hero { position: relative; margin-top: 28px; }
        .pp-pulseline { position: absolute; top: -6px; left: 0; right: 0; height: 46px; opacity: 0.55; pointer-events: none; }
        .pp-pulseline path {
          stroke: var(--pp-ink-soft);
          stroke-width: 1.5;
          fill: none;
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: pp-draw 1.6s ease-out forwards;
        }
        @keyframes pp-draw { to { stroke-dashoffset: 0; } }

        .pp-search {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--pp-panel);
          border: 1px solid var(--pp-ink);
          padding: 14px 18px;
          margin-top: 20px;
        }
        .pp-search input {
          border: none; outline: none; background: transparent;
          font-family: 'Inter', sans-serif; font-size: 16px; flex: 1; color: var(--pp-ink);
        }
        .pp-search input::placeholder { color: var(--pp-slate); }

        .pp-row {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          margin-top: 26px;
          padding-bottom: 6px;
        }
        .pp-card {
          flex: 0 0 200px;
          border: 1px solid var(--pp-line);
          background: var(--pp-panel);
          padding: 16px;
          cursor: pointer;
          transition: border-color 0.15s ease;
        }
        .pp-card:hover { border-color: var(--pp-ink-soft); }
        .pp-card.active { border-color: var(--pp-ink); border-width: 1.5px; }
        .pp-card-cat { font-size: 11.5px; color: var(--pp-slate); margin: 0 0 8px; }
        .pp-card-name {
          font-size: 14px; font-weight: 500; margin: 0 0 14px; line-height: 1.35;
          min-height: 38px;
        }
        .pp-card-price {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 17px; font-weight: 600;
        }
        .pp-card-trend { display: flex; align-items: center; gap: 4px; font-size: 12px; margin-top: 6px; }

        .pp-empty { color: var(--pp-slate); font-size: 14px; padding: 20px 4px; }

        .pp-detail {
          margin-top: 30px;
          border-top: 1px solid var(--pp-line);
          padding-top: 26px;
        }
        .pp-detail-head { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 10px; }
        .pp-detail-name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 22px; margin: 0; }
        .pp-detail-price { font-family: 'IBM Plex Mono', monospace; font-size: 26px; font-weight: 600; }

        .pp-chart { margin-top: 18px; border: 1px solid var(--pp-line); background: var(--pp-panel); padding: 16px 8px 8px; }

        .pp-predict {
          margin-top: 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid var(--pp-line);
          background: var(--pp-panel);
          padding: 16px 18px;
        }
        .pp-predict-badge {
          display: flex; align-items: center; gap: 6px;
          font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 600;
        }
        .pp-predict-meta { font-size: 12.5px; color: var(--pp-slate); }
        .pp-confidence-track { width: 60px; height: 4px; background: var(--pp-line); position: relative; }
        .pp-confidence-fill { position: absolute; left: 0; top: 0; bottom: 0; background: var(--pp-ink-soft); }

        .pp-track {
          margin-top: 18px;
          border: 1px solid var(--pp-line);
          background: var(--pp-panel);
          padding: 18px;
        }
        .pp-track-title { font-size: 14px; font-weight: 600; margin: 0 0 4px; display: flex; align-items: center; gap: 6px; }
        .pp-track-sub { font-size: 12.5px; color: var(--pp-slate); margin: 0 0 14px; }
        .pp-track-form { display: flex; gap: 10px; flex-wrap: wrap; }
        .pp-track-form input {
          border: 1px solid var(--pp-line);
          padding: 10px 12px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          background: var(--pp-paper);
          outline: none;
        }
        .pp-track-form input:focus { border-color: var(--pp-ink); }
        .pp-track-form input[type="email"] { flex: 1; min-width: 180px; }
        .pp-track-form input[type="number"] { width: 140px; }
        .pp-track-btn {
          border: 1px solid var(--pp-ink);
          background: var(--pp-ink);
          color: var(--pp-paper);
          padding: 10px 18px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .pp-track-btn:disabled { opacity: 0.6; cursor: default; }
        .pp-track-done { display: flex; align-items: center; gap: 6px; color: var(--pp-signal); font-size: 14px; margin-top: 12px; }
        .pp-track-error { color: var(--pp-alert); font-size: 13px; margin-top: 10px; }

        @media (max-width: 520px) {
          .pp-detail-price { font-size: 22px; }
        }
      `}</style>

      <div className="pp-wrap">
        <h1 className="pp-word">PricePulse</h1>
        <p className="pp-tagline">Track prices. Spot the drop before it happens.</p>

        <div className="pp-status">
          <span className={`pp-dot ${demoMode ? "demo" : "live"}`} />
          {checkingApi
            ? "Checking live API…"
            : demoMode
            ? "Demo data — connect your deployed API to see live prices"
            : "Connected to live API"}
        </div>

        <div className="pp-hero">
          <svg className="pp-pulseline" viewBox="0 0 800 46" preserveAspectRatio="none">
            <path d="M0,23 L160,23 L185,6 L205,40 L225,14 L245,23 L400,23 L425,32 L445,14 L465,23 L800,23" />
          </svg>
          <div className="pp-search">
            <Search size={18} color="var(--pp-ink-soft)" />
            <input
              placeholder="Search products or categories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="pp-row">
          {filtered.length === 0 && <p className="pp-empty">No products match "{query}".</p>}
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`pp-card ${p.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(p.id)}
            >
              <p className="pp-card-cat">{p.category ?? "Uncategorised"}</p>
              <p className="pp-card-name">{p.name}</p>
              <div className="pp-card-price">{formatPrice(p.current_price, p.currency)}</div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="pp-detail">
            <div className="pp-detail-head">
              <h2 className="pp-detail-name">{selected.name}</h2>
              <div className="pp-detail-price">{formatPrice(selected.current_price, selected.currency)}</div>
            </div>

            <div className="pp-chart">
              {loadingDetail ? (
                <p className="pp-empty">Loading price history…</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid stroke="var(--pp-line)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#6b7c76" }}
                      axisLine={{ stroke: "var(--pp-line)" }}
                      tickLine={false}
                      minTickGap={40}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7c76" }}
                      axisLine={false}
                      tickLine={false}
                      width={64}
                      tickFormatter={(v) => formatPrice(v, selected.currency)}
                    />
                    <Tooltip
                      formatter={(v) => formatPrice(v, selected.currency)}
                      contentStyle={{ fontSize: 13, border: "1px solid #d7ded8", borderRadius: 0 }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#33473f" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {prediction && !loadingDetail && (
              <div className="pp-predict">
                <div
                  className="pp-predict-badge"
                  style={{ color: trendColor(prediction.trend) }}
                >
                  <TrendIcon trend={prediction.trend} size={16} />
                  {formatPrice(prediction.predicted_price, selected.currency)}
                </div>
                <div className="pp-predict-meta">
                  in {prediction.predicted_for_days ?? 7} days · {prediction.basis_points} data points
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="pp-predict-meta">{Math.round(prediction.confidence * 100)}% confidence</span>
                  <div className="pp-confidence-track">
                    <div
                      className="pp-confidence-fill"
                      style={{ width: `${Math.round(prediction.confidence * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pp-track">
              <p className="pp-track-title">
                <Bell size={15} /> Get notified on a price drop
              </p>
              <p className="pp-track-sub">Set a target price — we'll flag it here once it's within reach.</p>

              {trackState === "done" ? (
                <div className="pp-track-done">
                  <Check size={16} /> You're set. We'll watch this one for you.
                </div>
              ) : (
                <form className="pp-track-form" onSubmit={handleTrack}>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder={`Target ${selected.currency}`}
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    min="1"
                    required
                  />
                  <button className="pp-track-btn" type="submit" disabled={trackState === "sending"}>
                    {trackState === "sending" ? "Setting…" : "Set alert"}
                  </button>
                </form>
              )}
              {trackState === "error" && (
                <p className="pp-track-error">Couldn't reach the tracking endpoint. Try again shortly.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
