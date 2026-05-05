/**
 * @file Parametres.jsx
 * @description Page Paramètres — CareerPilot
 * @author Fatima Zahra MARGHICH
 * @version 1.0.0
 */

import { useState } from "react";
import Sidebar, { C } from "./Sidebar";

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
      <div>
        <div style={{ fontSize:14, fontWeight:600, color:C.text, fontFamily:"'Syne',sans-serif" }}>{label}</div>
        {desc && <div style={{ fontSize:12, color:C.muted, marginTop:2, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{desc}</div>}
      </div>
      <div onClick={onChange} style={{
        width:44, height:24, borderRadius:12, cursor:"pointer",
        background: checked ? C.gradient : C.border,
        position:"relative", transition:"background 0.3s", flexShrink:0, marginLeft:16,
      }}>
        <div style={{
          position:"absolute", top:4, left: checked ? 24 : 4,
          width:16, height:16, borderRadius:"50%", background:"#fff",
          transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </div>
    </div>
  );
}

function SelectField({ label, desc, value, options, onChange }) {
  return (
    <div style={{ padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:C.text, fontFamily:"'Syne',sans-serif" }}>{label}</div>
          {desc && <div style={{ fontSize:12, color:C.muted, marginTop:2, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{desc}</div>}
        </div>
        <select value={value} onChange={e => onChange(e.target.value)} style={{
          background:C.bg, border:`1.5px solid ${C.border}`,
          borderRadius:8, padding:"7px 12px", fontSize:13, color:C.text,
          fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:"pointer", outline:"none",
        }}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ background:C.card, borderRadius:20, padding:24, border:`1px solid ${C.border}`, marginBottom:20 }}>
      <h3 style={{
        fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:C.text,
        margin:"0 0 4px", display:"flex", alignItems:"center", gap:10,
      }}>
        <span style={{ color:C.primary }}>{icon}</span>
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

export default function Parametres() {
  const [notifEmail,   setNotifEmail]   = useState(true);
  const [notifPush,    setNotifPush]    = useState(false);
  const [notifRapport, setNotifRapport] = useState(true);
  const [notifTips,    setNotifTips]    = useState(true);
  const [autoSave,     setAutoSave]     = useState(true);
  const [analytics,    setAnalytics]    = useState(true);
  const [darkMode,     setDarkMode]     = useState(false);
  const [langue,       setLangue]       = useState("fr");
  const [cvFormat,     setCvFormat]     = useState("pdf");
  const [saved,        setSaved]        = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <Sidebar activeId="parametres" />

      <main style={{ marginLeft:220, flex:1, padding:"32px 40px", overflowY:"auto" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:6 }}>CareerPilot / Paramètres</div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:C.text, margin:0 }}>Paramètres</h1>
          </div>
          <button onClick={handleSave} style={{
            background: saved ? "#22C55E" : C.gradient,
            border:"none", color:"#fff", fontSize:14, fontWeight:700,
            padding:"11px 24px", borderRadius:12, cursor:"pointer",
            fontFamily:"'Syne',sans-serif",
            boxShadow: saved ? "0 4px 16px rgba(34,197,94,0.3)" : "0 4px 16px rgba(200,24,122,0.3)",
            transition:"all 0.3s", display:"flex", alignItems:"center", gap:8,
          }}>
            {saved ? (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Sauvegardé !</>
            ) : (
              <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Sauvegarder</>
            )}
          </button>
        </div>

        <div style={{ maxWidth:740 }}>

          {/* Notifications */}
          <Section title="Notifications" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          }>
            <Toggle label="Notifications par email"  desc="Recevez les rapports d'analyse par email"         checked={notifEmail}   onChange={() => setNotifEmail(v => !v)} />
            <Toggle label="Notifications push"       desc="Alertes en temps réel dans le navigateur"         checked={notifPush}    onChange={() => setNotifPush(v => !v)} />
            <Toggle label="Rapport d'entretien"      desc="Notification à la fin de chaque simulation"       checked={notifRapport} onChange={() => setNotifRapport(v => !v)} />
            <Toggle label="Conseils d'optimisation"  desc="Recevez des tips hebdomadaires pour votre carrière" checked={notifTips}  onChange={() => setNotifTips(v => !v)} />
          </Section>

          {/* Préférences */}
          <Section title="Préférences" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
          }>
            <SelectField label="Langue de l'interface" desc="Langue d'affichage de la plateforme"
              value={langue} onChange={setLangue}
              options={[{value:"fr",label:"Français"},{value:"en",label:"English"},{value:"ar",label:"العربية"}]} />
            <SelectField label="Format d'export CV" desc="Format par défaut pour le téléchargement"
              value={cvFormat} onChange={setCvFormat}
              options={[{value:"pdf",label:"PDF"},{value:"docx",label:"DOCX"},{value:"both",label:"PDF + DOCX"}]} />
            <Toggle label="Mode sombre"      desc="Activer le thème sombre (bientôt disponible)" checked={darkMode}  onChange={() => setDarkMode(v => !v)} />
            <Toggle label="Sauvegarde auto"  desc="Sauvegarder automatiquement vos analyses"     checked={autoSave} onChange={() => setAutoSave(v => !v)} />
          </Section>

          {/* Confidentialité */}
          <Section title="Confidentialité & Données" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          }>
            <Toggle label="Analytics anonymes" desc="Aidez-nous à améliorer CareerPilot (anonyme)" checked={analytics} onChange={() => setAnalytics(v => !v)} />
            <div style={{ padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.text, fontFamily:"'Syne',sans-serif" }}>Données personnelles</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:2, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Télécharger toutes vos données (RGPD)</div>
                </div>
                <button style={{ background:"transparent", border:`1px solid ${C.border}`, color:C.primary, fontSize:12, fontWeight:600, padding:"7px 16px", borderRadius:8, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  Exporter
                </button>
              </div>
            </div>
            <div style={{ padding:"14px 0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:"#EF4444", fontFamily:"'Syne',sans-serif" }}>Supprimer le compte</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:2, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Action irréversible — toutes vos données seront supprimées</div>
                </div>
                <button style={{ background:"transparent", border:"1px solid #FCA5A5", color:"#EF4444", fontSize:12, fontWeight:600, padding:"7px 16px", borderRadius:8, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                  onClick={() => { if(window.confirm("Êtes-vous sûre de vouloir supprimer votre compte ?")) alert("Compte supprimé (démo)"); }}>
                  Supprimer
                </button>
              </div>
            </div>
          </Section>

          {/* À propos */}
          <Section title="À propos" icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          }>
            {[
              { label:"Version",       val:"2.0.0" },
              { label:"Moteur IA",     val:"Groq API (Mixtral-8x7B)" },
              { label:"Speech-to-Text",val:"Whisper Tiny" },
              { label:"Développé par", val:"ENIAD Berkane — PFA 2024/2025" },
            ].map(({ label, val }) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:13, color:C.muted, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{label}</span>
                <span style={{ fontSize:13, fontWeight:600, color:C.text, fontFamily:"'Syne',sans-serif" }}>{val}</span>
              </div>
            ))}
          </Section>
        </div>
      </main>
    </div>
  );
}