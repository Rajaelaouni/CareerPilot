/**
 * @file AnalysesCV.jsx
 * @description Page Résultats ATS — CareerPilot
 * @author Fatima Zahra MARGHICH
 * @version 1.0.0
 */

import { useState } from "react";
import Sidebar, { C } from "./Sidebar";

// ─── Données mock ─────────────────────────────────────────
const CV_DATA = {
  filename: "CV_Fatima_Dev.pdf",
  date: "Il y a 2 minutes",
  atsScore: 85,
  kpis: [
    { label: "Tech Relevance", score: 91, color: "#22C55E" },
    { label: "Expérience",     score: 76, color: C.secondary },
    { label: "Formation",      score: 85, color: C.primary },
  ],
  technicalSkills: ["React", "Node.js", "AWS", "Docker", "TypeScript"],
  softSkills: ["Leadership", "Agile Methodology", "Public Speaking", "Mentoring"],
  present: ["Full-stack Development", "Cloud Infrastructure", "CI/CD Pipelines"],
  missing: ["Kubernetes orchestration", "GraphQL API", "Unit Testing (Jest)"],
  tips: [
    { title: "Clarifiez vos titres de postes", desc: "Utilisez des intitulés comme 'Senior Web Developer' pour faciliter le scan ATS.", priority: "haute" },
    { title: "Ajoutez Kubernetes", desc: "Cette compétence est cruciale pour l'offre visée. Intégrez-la dans vos expériences passées.", priority: "haute" },
    { title: "Quantifiez vos succès", desc: "Remplacez 'Gestion de projet' par 'Réduction de 20% du temps de déploiement'.", priority: "moyen" },
    { title: "Section Formation", desc: "Ajoutez l'année d'obtention de votre Master pour valider les critères temporels.", priority: "moyen" },
  ],
};

// ─── Composants ───────────────────────────────────────────
function ScoreCircle({ score }) {
  const r     = 54;
  const circ  = 2 * Math.PI * r;
  const dash  = (score / 100) * circ;
  const color = score >= 75 ? "#22C55E" : score >= 60 ? C.secondary : "#F59E0B";

  return (
    <div style={{ position:"relative", width:140, height:140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform:"rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke={C.border} strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
      </svg>
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
      }}>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:800, color, lineHeight:1 }}>{score}%</span>
        <span style={{ fontSize:10, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif", marginTop:2 }}>
          {score>=75?"STRONG MATCH":score>=60?"GOOD MATCH":"WEAK MATCH"}
        </span>
      </div>
    </div>
  );
}

function KpiBar({ label, score, color }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:13, color:C.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:700, color, fontFamily:"'Syne',sans-serif" }}>{score}%</span>
      </div>
      <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:4, background:color,
          width:`${score}%`, transition:"width 1.2s ease",
        }} />
      </div>
    </div>
  );
}

function SkillTag({ label, variant }) {
  const styles = {
    tech:    { bg:"#EDE4FD", color:C.secondary },
    soft:    { bg:"#FCE4F3", color:C.primary },
    present: { bg:"#DCFCE7", color:"#16A34A" },
    missing: { bg:"#FEE2E2", color:"#DC2626" },
  };
  const s = styles[variant] || styles.tech;
  return (
    <span style={{
      fontSize:12, fontWeight:600, padding:"5px 12px", borderRadius:50,
      background:s.bg, color:s.color,
      fontFamily:"'Plus Jakarta Sans',sans-serif",
    }}>{label}</span>
  );
}

function TipCard({ tip, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      display:"flex", gap:14, padding:"14px 0",
      borderBottom: index < CV_DATA.tips.length - 1 ? `1px solid ${C.border}` : "none",
      cursor:"pointer",
    }} onClick={() => setExpanded(v => !v)}>
      <div style={{
        width:28, height:28, borderRadius:"50%",
        background: C.gradient,
        display:"flex", alignItems:"center", justifyContent:"center",
        color:"#fff", fontSize:12, fontWeight:800,
        fontFamily:"'Syne',sans-serif", flexShrink:0,
      }}>{index+1}</div>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, fontFamily:"'Syne',sans-serif", marginBottom: expanded ? 8 : 0 }}>
            {tip.title}
          </div>
          <span style={{
            fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:50,
            background: tip.priority==="haute" ? "#FEE2E2" : "#FEF3C7",
            color: tip.priority==="haute" ? "#DC2626" : "#D97706",
            fontFamily:"'Plus Jakarta Sans',sans-serif", flexShrink:0, marginLeft:8,
          }}>
            {tip.priority.toUpperCase()}
          </span>
        </div>
        {expanded && (
          <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            {tip.desc}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function AnalysesCV() {
  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>

      <Sidebar activeId="analyses" />

      <main style={{ marginLeft:220, flex:1, padding:"32px 40px", overflowY:"auto", minHeight:"100vh" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
          <div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              CareerPilot  /  Analyses CV
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{
                width:38, height:38, borderRadius:10,
                background:C.gradientLight,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div>
                <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, margin:0 }}>
                  {CV_DATA.filename}
                </h1>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:4 }}>
                  <span style={{ fontSize:12, fontWeight:600, padding:"2px 10px", borderRadius:50, background:"#DCFCE7", color:"#16A34A", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    ✓ ANALYSÉ
                  </span>
                  <span style={{ fontSize:12, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{CV_DATA.date}</span>
                </div>
              </div>
            </div>
          </div>
          <button style={{
            display:"flex", alignItems:"center", gap:8,
            background:C.gradient, border:"none", color:"#fff",
            fontSize:13, fontWeight:700, padding:"10px 18px", borderRadius:10,
            cursor:"pointer", fontFamily:"'Syne',sans-serif",
            boxShadow:"0 4px 16px rgba(200,24,122,0.3)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exporter PDF
          </button>
        </div>

        {/* Contenu principal */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, alignItems:"start" }}>

          {/* Colonne gauche */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* Score ATS + KPIs */}
            <div style={{
              background:C.card, borderRadius:20, padding:28,
              border:`1px solid ${C.border}`,
              display:"grid", gridTemplateColumns:"auto 1fr", gap:32, alignItems:"center",
            }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>ATS MATCH SCORE</div>
                <ScoreCircle score={CV_DATA.atsScore} />
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>KEY PERFORMANCE INDICATORS</div>
                {CV_DATA.kpis.map((kpi,i) => <KpiBar key={i} {...kpi} />)}
              </div>
            </div>

            {/* Compétences */}
            <div style={{ background:C.card, borderRadius:20, padding:28, border:`1px solid ${C.border}` }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    {"<>"} TECHNICAL SKILLS
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {CV_DATA.technicalSkills.map(s => <SkillTag key={s} label={s} variant="tech" />)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    ◎ SOFT SKILLS
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {CV_DATA.softSkills.map(s => <SkillTag key={s} label={s} variant="soft" />)}
                  </div>
                </div>
              </div>
            </div>

            {/* Mots-clés */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ background:C.card, borderRadius:16, padding:20, border:`1.5px solid #BBF7D0` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:"#22C55E", display:"inline-block" }} />
                  <span style={{ fontSize:12, fontWeight:700, color:"#16A34A", fontFamily:"'Syne',sans-serif", textTransform:"uppercase", letterSpacing:"0.06em" }}>Mots-clés présents</span>
                </div>
                {CV_DATA.present.map(k => (
                  <div key={k} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ color:"#22C55E", fontSize:13 }}>✓</span>
                    <span style={{ fontSize:13, color:C.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{k}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:C.card, borderRadius:16, padding:20, border:`1.5px solid #FCA5A5` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:"#EF4444", display:"inline-block" }} />
                  <span style={{ fontSize:12, fontWeight:700, color:"#DC2626", fontFamily:"'Syne',sans-serif", textTransform:"uppercase", letterSpacing:"0.06em" }}>Mots-clés manquants</span>
                </div>
                {CV_DATA.missing.map(k => (
                  <div key={k} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <span style={{ color:"#EF4444", fontSize:13 }}>✗</span>
                    <span style={{ fontSize:13, color:C.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{k}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite — Optimization Tips */}
          <div style={{ display:"flex", flexDirection:"column", gap:16, position:"sticky", top:20 }}>
            <div style={{ background:C.card, borderRadius:20, padding:24, border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div style={{
                  width:32, height:32, borderRadius:10, background:C.gradient,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text }}>Optimization Tips</span>
              </div>
              {CV_DATA.tips.map((tip,i) => <TipCard key={i} tip={tip} index={i} />)}
            </div>

            {/* Bouton Apply Auto-Fixes */}
            <button onClick={() => window.location.href="/optimise"} style={{
              background:C.gradient, border:"none", color:"#fff",
              fontSize:14, fontWeight:700, padding:"14px",
              borderRadius:14, cursor:"pointer",
              fontFamily:"'Syne',sans-serif",
              boxShadow:"0 4px 16px rgba(200,24,122,0.3)",
              transition:"all 0.2s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              ✨ Apply Auto-Fixes
            </button>

            <div style={{ fontSize:11, color:C.muted, textAlign:"center", fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.5 }}>
              Nos algorithmes amélioreront automatiquement votre CV tout en préservant votre style personnel.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}