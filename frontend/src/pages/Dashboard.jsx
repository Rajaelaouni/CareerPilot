/**
 * @file Dashboard.jsx
 * @description Page Dashboard CareerPilot
 * @author Fatima Zahra MARGHICH
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import Sidebar, { C } from "./Sidebar";

const KPIS = [
  { label: "CVs Analysés", value: 142,     icon: "📄", color: C.primary,   bg: "#FCE4F3", trend: "+12%" },
  { label: "Entretiens",   value: 89,      icon: "🎤", color: C.secondary, bg: "#EDE4FD", trend: "+8%"  },
  { label: "Score Moyen",  value: "73.4%", icon: "📊", color: C.primary,   bg: "#FCE4F3", trend: "+5%"  },
  { label: "Requêtes IA",  value: "1 247", icon: "🤖", color: C.secondary, bg: "#EDE4FD", trend: "+24%" },
];

const WEEK_DATA = [
  { day: "Lun", a: 18, e: 8  },
  { day: "Mar", a: 24, e: 12 },
  { day: "Mer", a: 15, e: 6  },
  { day: "Jeu", a: 32, e: 18 },
  { day: "Ven", a: 28, e: 14 },
  { day: "Sam", a: 12, e: 4  },
  { day: "Dim", a: 20, e: 10 },
];

const RECENT = [
  { name: "Pierre Durand",   initials: "PD", skills: ["React","Node.js"], score: 85, status: "Analysé",  statusColor: C.success  },
  { name: "Sophie Lefebvre", initials: "SL", skills: ["Java","Design"],   score: 78, status: "En cours", statusColor: C.warning  },
  { name: "Jean-Luc Renault",initials: "JR", skills: ["Python","IA"],     score: 62, status: "Analysé",  statusColor: C.success  },
];

function KpiCard({ label, value, icon, color, bg, trend, index }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), index * 100); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px",
      display: "flex", flexDirection: "column", gap: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)",
      transition: `all 0.5s ease ${index * 80}ms`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.success, background: "#DCFCE7", padding: "3px 8px", borderRadius: 20 }}>{trend}</span>
      </div>
      <div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: C.text }}>{value}</div>
        <div style={{ fontSize: 13, color: C.muted, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{label}</div>
      </div>
    </div>
  );
}

function WeekChart() {
  const max = Math.max(...WEEK_DATA.map(d => d.a));
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Activité hebdomadaire</h3>
        <div style={{ display: "flex", gap: 16 }}>
          {[["Analyses", C.primary], ["Entretiens", C.secondary]].map(([l, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
              <span style={{ fontSize: 12, color: C.muted, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120 }}>
        {WEEK_DATA.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 100 }}>
              <div style={{ flex: 1, borderRadius: "4px 4px 0 0", height: `${(d.a / max) * 100}%`, background: C.primary, opacity: 0.85 }} />
              <div style={{ flex: 1, borderRadius: "4px 4px 0 0", height: `${(d.e / max) * 100}%`, background: C.secondary, opacity: 0.7 }} />
            </div>
            <span style={{ fontSize: 11, color: C.muted, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CvLevels() {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 20px" }}>Niveaux CV</h3>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="45" fill="none" stroke={C.border} strokeWidth="18" />
            <circle cx="60" cy="60" r="45" fill="none" stroke={C.secondary} strokeWidth="18"
              strokeDasharray={`${0.45 * 283} ${283}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
            <circle cx="60" cy="60" r="45" fill="none" stroke={C.primary} strokeWidth="18"
              strokeDasharray={`${0.20 * 283} ${283}`} strokeDashoffset={`-${0.45 * 283}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: C.text }}>142</div>
            <div style={{ fontSize: 10, color: C.muted }}>Total</div>
          </div>
        </div>
      </div>
      {[["Basic", "#EDE8FB", 35], ["Mid Level", C.secondary, 45], ["Senior", C.primary, 20]].map(([l, c, p]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
            <span style={{ fontSize: 13, color: C.muted, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{l}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "'Syne',sans-serif" }}>{p}%</span>
        </div>
      ))}
    </div>
  );
}

function RecentTable() {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Analyses récentes</h3>
        <button style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 14px", color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          Voir tout
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 120px 100px 50px", gap: 12, padding: "8px 12px", borderRadius: 8, background: C.bg, marginBottom: 8 }}>
        {["Candidat","Compétences","Score","Statut",""].map((h, i) => (
          <span key={i} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{h}</span>
        ))}
      </div>
      {RECENT.map((r, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "1.5fr 1fr 120px 100px 50px",
          gap: 12, padding: "12px", borderRadius: 10,
          borderBottom: i < RECENT.length - 1 ? `1px solid ${C.border}` : "none",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.bg}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", flexShrink: 0 }}>
              {r.initials}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{r.name}</span>
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
            {r.skills.map((s, j) => (
              <span key={j} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: j === 0 ? "#FCE4F3" : "#EDE4FD", color: j === 0 ? C.primary : C.secondary, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
              <div style={{ width: `${r.score}%`, height: "100%", background: r.score > 80 ? C.success : r.score > 60 ? C.warning : C.error, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: "'Syne',sans-serif", whiteSpace: "nowrap" }}>{r.score}%</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: r.statusColor + "20", color: r.statusColor, fontFamily: "'Plus Jakarta Sans',sans-serif", alignSelf: "center", whiteSpace: "nowrap" }}>
            {r.status}
          </span>
          <button style={{ background: C.gradientLight, border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.primary }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <Sidebar activePage="dashboard" />
      <div style={{ marginLeft: 240, flex: 1, padding: "32px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: C.text, margin: "0 0 4px" }}>Bonjour, Fatima 👋</h1>
            <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Prête à optimiser votre prochaine candidature ?</p>
          </div>
          <button onClick={() => window.location.href = "/upload"} style={{
            background: C.gradient, border: "none", color: "#fff",
            fontSize: 14, fontWeight: 700, padding: "12px 24px", borderRadius: 12,
            cursor: "pointer", fontFamily: "'Syne',sans-serif",
            boxShadow: "0 4px 16px rgba(200,24,122,0.3)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7-7 7 7"/></svg>
            Nouvelle analyse
          </button>
        </div>
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          {KPIS.map((k, i) => <KpiCard key={i} {...k} index={i} />)}
        </div>
        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 24 }}>
          <WeekChart />
          <CvLevels />
        </div>
        {/* Table */}
        <RecentTable />
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      `}</style>
    </div>
  );
}