import { useEffect, useState } from "react";
import Sidebar, { C } from "./Sidebar";

function ScoreCircle({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? "#22C55E" : score >= 60 ? C.secondary : "#F59E0B";

  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke={C.border} strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{score}%</span>
        <span style={{ fontSize: 10, color: C.muted, fontFamily: "'Plus Jakarta Sans',sans-serif", marginTop: 2 }}>
          {score >= 75 ? "STRONG MATCH" : score >= 60 ? "GOOD MATCH" : "WEAK MATCH"}
        </span>
      </div>
    </div>
  );
}

function KpiBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: C.text, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'Syne',sans-serif" }}>{score}%</span>
      </div>
      <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 4, background: color, width: `${score}%` }} />
      </div>
    </div>
  );
}

function SkillTag({ label, variant }) {
  const styles = {
    tech: { bg: "#EDE4FD", color: C.secondary },
    soft: { bg: "#FCE4F3", color: C.primary },
  };
  const s = styles[variant] || styles.tech;
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "5px 12px",
        borderRadius: 50,
        background: s.bg,
        color: s.color,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {label}
    </span>
  );
}

function TipCard({ tip, index }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "14px 0",
        borderBottom: "1px solid " + C.border,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: C.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 12,
          fontWeight: 800,
          fontFamily: "'Syne',sans-serif",
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "'Syne',sans-serif", marginBottom: 6 }}>
            {tip.title}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 50,
              background: tip.priority === "haute" ? "#FEE2E2" : "#FEF3C7",
              color: tip.priority === "haute" ? "#DC2626" : "#D97706",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              flexShrink: 0,
              marginLeft: 8,
            }}
          >
            {String(tip.priority || "moyen").toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {tip.desc}
        </div>
      </div>
    </div>
  );
}

export default function AnalysesCV() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

 useEffect(() => {
  const fetchAnalysis = async () => {
    const token = localStorage.getItem("token");
    const analysisId = localStorage.getItem("latest_analysis_id");

    if (!token) {
      setApiError("Utilisateur non connecté.");
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Token ${token}`,
    };

    try {
      let response;

      if (analysisId) {
        response = await fetch(`http://localhost:8000/api/cv/analysis/${analysisId}`, {
          method: "GET",
          headers,
        });

        if (response.ok) {
          const result = await response.json();
          setData(result);
          setLoading(false);
          return;
        }
      }

      response = await fetch("http://localhost:8000/api/cv/latest-analysis", {
        method: "GET",
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Impossible de charger l'analyse.");
      }

      if (result.analysis_id) {
        localStorage.setItem("latest_analysis_id", String(result.analysis_id));
      }

      setData(result);
    } catch (err) {
      setApiError(err.message || "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  fetchAnalysis();
}, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Chargement de l’analyse...</div>;
  }

  if (apiError) {
    return <div style={{ padding: 40, color: "red" }}>❌ {apiError}</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
<Sidebar activePage="analyses" />
      <main style={{ marginLeft: 220, flex: 1, padding: "32px 40px", overflowY: "auto", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>CareerPilot / Analyses CV</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: C.gradientLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                📄
              </div>
              <div>
                <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: C.text, margin: 0 }}>
                  {data.filename}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 50, background: "#DCFCE7", color: "#16A34A" }}>
                    ✓ ANALYSÉ
                  </span>
                  <span style={{ fontSize: 12, color: C.muted }}>{data.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background: C.card,
                borderRadius: 20,
                padding: 28,
                border: `1px solid ${C.border}`,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 32,
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                  ATS MATCH SCORE
                </div>
                <ScoreCircle score={data.atsScore} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                  KEY PERFORMANCE INDICATORS
                </div>
                {data.kpis.map((kpi, i) => (
                  <KpiBar key={i} {...kpi} />
                ))}
              </div>
            </div>

            <div style={{ background: C.card, borderRadius: 20, padding: 28, border: `1px solid ${C.border}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
                    {"<>"} TECHNICAL SKILLS
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {data.technicalSkills.map((s) => (
                      <SkillTag key={s} label={s} variant="tech" />
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
                    ◎ SOFT SKILLS
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {data.softSkills.map((s) => (
                      <SkillTag key={s} label={s} variant="soft" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1.5px solid #BBF7D0` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }}>Mots-clés présents</span>
                </div>
                {data.present.map((k) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ color: "#22C55E", fontSize: 13 }}>✓</span>
                    <span style={{ fontSize: 13, color: C.text }}>{k}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1.5px solid #FCA5A5` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>Mots-clés manquants</span>
                </div>
                {data.missing.map((k) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ color: "#EF4444", fontSize: 13 }}>✗</span>
                    <span style={{ fontSize: 13, color: C.text }}>{k}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 20 }}>
            <div style={{ background: C.card, borderRadius: 20, padding: 24, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  ★
                </div>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: C.text }}>
                  Optimization Tips
                </span>
              </div>
              {data.tips.map((tip, i) => (
                <TipCard key={i} tip={tip} index={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}