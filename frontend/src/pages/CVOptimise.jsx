/**
 * @file CVOptimise.jsx
 * @description Page CV Optimisé — CareerPilot
 * @author Fatima Zahra MARGHICH
 * @version 1.0.0
 */

import { useState } from "react";
import Sidebar, { C } from "./Sidebar";

const POINTS_CRITIQUES = ["Mots-clés ATS absents","Structure à revoir","Expériences peu détaillées"];
const AMELIORATIONS    = ["Mots-clés ATS ajoutés","Structure optimisée","Expériences reformulées"];

const ORIGINAL_SECTIONS = [
  { title:"Développeur Web", content:"Développement d'applications web avec React et Node.js. Gestion de projets en équipe.", score:42 },
  { title:"Compétences", content:"React, JavaScript, CSS, HTML, Git", score:38 },
  { title:"Formation", content:"Master Informatique - ENIAD Berkane", score:55 },
];

const OPTIMISED_SECTIONS = [
  { title:"Senior Full-Stack Developer", content:"Architecture et développement d'applications web React.js + Node.js pour 50k+ utilisateurs. Déploiement CI/CD sur AWS avec réduction de 30% du temps de livraison. Leadership technique d'une équipe de 4 développeurs.", score:89 },
  { title:"Compétences Techniques", content:"React.js • Node.js • TypeScript • AWS • Docker • PostgreSQL • GraphQL • REST API • Git • Agile/Scrum", score:92 },
  { title:"Formation", content:"Master Génie Informatique — ENIAD Berkane (2024) | Spécialisation ML/DL/NLP | Mention Bien", score:84 },
];

export default function CVOptimise() {
  const [activeTab, setActiveTab] = useState("compare");

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <Sidebar activeId="optimise" />

      <main style={{ marginLeft:220, flex:1, padding:"32px 40px", overflowY:"auto" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
          <div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:6 }}>CareerPilot / CV Optimisé</div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:C.text, margin:"0 0 6px" }}>CV Optimisé par IA</h1>
            <p style={{ fontSize:14, color:C.muted }}>Comparez votre CV original avec la version améliorée</p>
          </div>
          {/* Score global */}
          <div style={{ background:C.card, borderRadius:16, padding:"16px 24px", border:`1px solid ${C.border}`, textAlign:"center" }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>SCORE GLOBAL</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800, color:"#22C55E", lineHeight:1 }}>89%</div>
            <div style={{ fontSize:11, color:"#22C55E", fontWeight:600, marginTop:4, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>+24% Amélioration</div>
            <div style={{ height:4, borderRadius:2, background:C.border, marginTop:8, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:2, background:"linear-gradient(90deg,#22C55E,#16A34A)", width:"89%" }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {["compare","ameliorations"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: activeTab===tab ? C.gradient : C.card,
              border: `1px solid ${activeTab===tab ? "transparent" : C.border}`,
              color: activeTab===tab ? "#fff" : C.muted,
              fontSize:13, fontWeight:600, padding:"9px 20px", borderRadius:10,
              cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow: activeTab===tab ? "0 4px 16px rgba(200,24,122,0.3)" : "none",
            }}>
              {tab==="compare" ? "📊 Comparaison" : "✨ Améliorations"}
            </button>
          ))}
        </div>

        {activeTab === "compare" ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {/* CV Original */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.muted, fontFamily:"'Syne',sans-serif" }}>CV ORIGINAL</div>
                <span style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:50, background:"#FEF3C7", color:"#D97706", fontFamily:"'Syne',sans-serif" }}>65% ATS</span>
              </div>
              {ORIGINAL_SECTIONS.map((s,i) => (
                <div key={i} style={{ background:C.card, borderRadius:14, padding:18, border:`1px solid ${C.border}`, marginBottom:12 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.muted, marginBottom:8, fontFamily:"'Syne',sans-serif", textDecoration:"line-through" }}>{s.title}</div>
                  <div style={{ fontSize:12, color:"#9CA3AF", lineHeight:1.6, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:10 }}>{s.content}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, height:4, borderRadius:2, background:C.border, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:2, background:"#F59E0B", width:`${s.score}%` }} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:"#F59E0B", fontFamily:"'Syne',sans-serif" }}>{s.score}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CV Optimisé */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.primary, fontFamily:"'Syne',sans-serif" }}>CV OPTIMISÉ — IA</div>
                <span style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:50, background:"#DCFCE7", color:"#16A34A", fontFamily:"'Syne',sans-serif" }}>89% ATS</span>
              </div>
              {OPTIMISED_SECTIONS.map((s,i) => (
                <div key={i} style={{ background:C.card, borderRadius:14, padding:18, border:`1.5px solid #BBF7D0`, marginBottom:12, position:"relative" }}>
                  <div style={{ position:"absolute", top:10, right:10, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:50, background:"#DCFCE7", color:"#16A34A", fontFamily:"'Syne',sans-serif" }}>
                    Amélioré ✓
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:8, fontFamily:"'Syne',sans-serif" }}>{s.title}</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:10 }}>{s.content}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ flex:1, height:4, borderRadius:2, background:C.border, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:2, background:"#22C55E", width:`${s.score}%` }} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:"#22C55E", fontFamily:"'Syne',sans-serif" }}>{s.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div style={{ background:C.card, borderRadius:20, padding:24, border:"1.5px solid #FCA5A5" }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#DC2626", margin:"0 0 16px" }}>❌ Points Critiques</h3>
              {POINTS_CRITIQUES.map((p,i) => (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:10 }}>
                  <span style={{ color:"#EF4444", fontWeight:700, flexShrink:0 }}>✗</span>
                  <span style={{ fontSize:13, color:C.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ background:C.card, borderRadius:20, padding:24, border:"1.5px solid #BBF7D0" }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#16A34A", margin:"0 0 16px" }}>✅ Améliorations Apportées</h3>
              {AMELIORATIONS.map((a,i) => (
                <div key={i} style={{ display:"flex", gap:10, marginBottom:10 }}>
                  <span style={{ color:"#22C55E", fontWeight:700, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:13, color:C.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div style={{ display:"flex", gap:12, marginTop:24 }}>
          <button style={{
            background:"transparent", border:`1.5px solid ${C.border}`,
            color:C.text, fontSize:14, fontWeight:600, padding:"13px 24px",
            borderRadius:12, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
            display:"flex", alignItems:"center", gap:8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Modifier
          </button>
          <button style={{
            background:C.gradient, border:"none", color:"#fff",
            fontSize:14, fontWeight:700, padding:"13px 28px",
            borderRadius:12, cursor:"pointer", fontFamily:"'Syne',sans-serif",
            boxShadow:"0 4px 16px rgba(200,24,122,0.3)",
            display:"flex", alignItems:"center", gap:8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            📄 Télécharger PDF
          </button>
          <button style={{
            background:"transparent", border:`1.5px solid ${C.primary}`,
            color:C.primary, fontSize:14, fontWeight:600, padding:"13px 24px",
            borderRadius:12, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
            display:"flex", alignItems:"center", gap:8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.35"/></svg>
            Régénérer
          </button>
        </div>
      </main>
    </div>
  );
}