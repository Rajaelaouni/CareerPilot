/**
 * @file Profil.jsx
 * @description Page Profil Utilisateur — CareerPilot
 * @author Fatima Zahra MARGHICH
 * @version 1.0.0
 */

import { useState } from "react";
import Sidebar, { C } from "./Sidebar";

const TOP_SKILLS = ["React","Python","FastAPI","Git"];
const ACTIVITES  = [
  { label:"Candidature envoyée — Fullstack Senior", time:"Il y a 2 heures",  color:C.primary   },
  { label:"Optimisation CV terminée  +15%",         time:"Il y a 30 min",    color:"#22C55E"   },
  { label:"Nouveau badge — Python Expert",           time:"Il y a 3 jours",  color:C.secondary },
];

function Field({ label, value, type="text" }) {
  const [val, setVal] = useState(value);
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{label}</label>
      <input type={type} value={val} onChange={e => setVal(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width:"100%", padding:"11px 14px", fontSize:14, color:C.text,
          background: focused ? "#fff" : C.bg,
          border:`1.5px solid ${focused ? C.primary : C.border}`,
          borderRadius:10, outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif",
          boxShadow: focused ? `0 0 0 3px ${C.primary}15` : "none",
          transition:"all 0.2s",
        }}
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
      <span style={{ fontSize:14, color:C.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{label}</span>
      <div onClick={onChange} style={{
        width:42, height:22, borderRadius:11, cursor:"pointer",
        background: checked ? C.gradient : C.border,
        position:"relative", transition:"background 0.3s",
      }}>
        <div style={{
          position:"absolute", top:3, left: checked ? 23 : 3,
          width:16, height:16, borderRadius:"50%", background:"#fff",
          transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </div>
    </div>
  );
}

export default function Profil() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush,  setNotifPush]  = useState(false);
  const [editing,    setEditing]    = useState(false);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <Sidebar activeId="profil" />

      <main style={{ marginLeft:220, flex:1, padding:"32px 40px", overflowY:"auto" }}>
        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:13, color:C.muted, marginBottom:6 }}>CareerPilot / Profil</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:C.text, margin:0 }}>Mon Profil</h1>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:24, alignItems:"start" }}>
          {/* Colonne gauche */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* Avatar + nom */}
            <div style={{ background:C.card, borderRadius:20, padding:28, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:24 }}>
              <div style={{
                width:80, height:80, borderRadius:"50%", background:C.gradient,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:28, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif",
                boxShadow:"0 8px 24px rgba(200,24,122,0.3)", flexShrink:0,
              }}>F</div>
              <div style={{ flex:1 }}>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:C.text, margin:"0 0 4px" }}>
                  Fatima Zahra Ouali
                </h2>
                <div style={{ fontSize:14, color:C.muted, marginBottom:8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  Développeuse Frontend
                </div>
                <div style={{ display:"flex", gap:16 }}>
                  <span style={{ fontSize:12, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif", display:"flex", alignItems:"center", gap:4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Berkane, Maroc
                  </span>
                  <span style={{ fontSize:12, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>🎓 2 ans d'expérience</span>
                </div>
              </div>
              <button onClick={() => setEditing(!editing)} style={{
                background: editing ? C.gradient : "transparent",
                border:`1.5px solid ${editing ? "transparent" : C.border}`,
                color: editing ? "#fff" : C.text,
                fontSize:13, fontWeight:600, padding:"9px 20px", borderRadius:10,
                cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
              }}>
                {editing ? "✓ Sauvegarder" : "✏ Modifier le profil"}
              </button>
            </div>

            {/* Informations personnelles */}
            <div style={{ background:C.card, borderRadius:20, padding:28, border:`1px solid ${C.border}` }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, margin:"0 0 20px", display:"flex", alignItems:"center", gap:8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Informations personnelles
              </h3>
              <Field label="Email"     value="fatima.zahra@careerpilot.io" type="email" />
              <Field label="Téléphone" value="+212 6 00 00 00 00" />
              <Field label="Localisation" value="Berkane, Maroc" />
            </div>

            {/* Sécurité */}
            <div style={{ background:C.card, borderRadius:20, padding:28, border:`1px solid ${C.border}` }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, margin:"0 0 20px", display:"flex", alignItems:"center", gap:8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Sécurité
              </h3>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text, fontFamily:"'Syne',sans-serif" }}>Mot de passe</div>
                  <div style={{ fontSize:12, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:"0.15em" }}>••••••••••••</div>
                </div>
                <button style={{
                  background:"transparent", border:`1px solid ${C.border}`,
                  color:C.primary, fontSize:12, fontWeight:600, padding:"7px 16px",
                  borderRadius:8, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
                }}>Changer</button>
              </div>
            </div>

            {/* Notifications */}
            <div style={{ background:C.card, borderRadius:20, padding:28, border:`1px solid ${C.border}` }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, margin:"0 0 20px", display:"flex", alignItems:"center", gap:8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                Notifications
              </h3>
              <Toggle label="Notifications Email" checked={notifEmail} onChange={() => setNotifEmail(v => !v)} />
              <Toggle label="Notifications Push"  checked={notifPush}  onChange={() => setNotifPush(v => !v)} />
            </div>
          </div>

          {/* Colonne droite — Career Insights */}
          <div style={{ display:"flex", flexDirection:"column", gap:16, position:"sticky", top:20 }}>
            <div style={{ background:C.card, borderRadius:20, padding:24, border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text, margin:0 }}>Career Insights</h3>
                <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:50, background:C.gradientLight, color:C.primary, fontFamily:"'Syne',sans-serif" }}>Rising Prospect 🔥</span>
              </div>

              {/* Top compétences */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:10, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>TOP COMPÉTENCES</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {TOP_SKILLS.map(s => (
                    <span key={s} style={{ fontSize:12, fontWeight:600, padding:"5px 12px", borderRadius:50, background:C.gradientLight, color:C.primary, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                <div style={{ background:C.bg, borderRadius:12, padding:"14px", textAlign:"center", border:`1px solid ${C.border}` }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:C.primary }}>88%</div>
                  <div style={{ fontSize:11, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif", marginTop:2 }}>Score ATS moyen</div>
                </div>
                <div style={{ background:C.bg, borderRadius:12, padding:"14px", textAlign:"center", border:`1px solid ${C.border}` }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:C.secondary }}>12</div>
                  <div style={{ fontSize:11, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif", marginTop:2 }}>Entretiens passés</div>
                </div>
              </div>

              {/* Activité récente */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>ACTIVITÉ RÉCENTE</div>
                {ACTIVITES.map((a,i) => (
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:a.color, flexShrink:0, marginTop:5 }} />
                    <div>
                      <div style={{ fontSize:12, color:C.text, fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.4 }}>{a.label}</div>
                      <div style={{ fontSize:11, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif", marginTop:2 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ background:C.gradientLight, borderRadius:14, padding:16, textAlign:"center" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:6, fontFamily:"'Syne',sans-serif" }}>Prête pour le prochain niveau ?</div>
                <div style={{ fontSize:12, color:C.muted, marginBottom:12, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>L'IA CareerPilot a détecté 4 nouvelles opportunités.</div>
                <button onClick={() => window.location.href="/matching"} style={{
                  background:C.gradient, border:"none", color:"#fff",
                  fontSize:13, fontWeight:700, padding:"9px 20px", borderRadius:10,
                  cursor:"pointer", fontFamily:"'Syne',sans-serif",
                  boxShadow:"0 4px 12px rgba(200,24,122,0.3)",
                }}>Voir les Jobs →</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}