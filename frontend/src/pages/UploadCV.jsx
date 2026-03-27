/**
 * @file UploadCV.jsx
 * @description Page Upload CV CareerPilot
 * @author Fatima Zahra MARGHICH
 * @version 1.0.0
 */

import { useState, useRef } from "react";
import Sidebar, { C } from "./Sidebar";

export default function UploadCV() {
  const [dragging, setDragging] = useState(false);
  const [file,     setFile]     = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const validExts  = f.name.endsWith(".pdf") || f.name.endsWith(".docx");
    if (!validTypes.includes(f.type) && !validExts) { alert("Format non supporté. Utilisez PDF ou DOCX."); return; }
    if (f.size > 5 * 1024 * 1024) { alert("Fichier trop grand (max 5MB)."); return; }
    setFile(f); setProgress(0); setDone(false);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };

  const handleLaunch = async () => {
    if (!file) return;
    setLoading(true);
    for (let i = 0; i <= 100; i += 4) {
      await new Promise(r => setTimeout(r, 70));
      setProgress(i);
    }
    setProgress(100);
    setLoading(false);
    setDone(true);
    setTimeout(() => { window.location.href = "/analyses"; }, 1200);
  };

  const fmtSize = b => b < 1024*1024 ? `${(b/1024).toFixed(0)} KB` : `${(b/1024/1024).toFixed(1)} MB`;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <Sidebar activePage="upload" />

      <div style={{ marginLeft:240, flex:1, padding:"32px" }}>
        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:C.text, margin:"0 0 8px" }}>
            Analyser votre CV
          </h1>
          <p style={{ color:C.muted, fontSize:14, margin:0 }}>
            Optimisez votre CV pour les systèmes ATS avec notre IA de pointe. Obtenez un retour instantané.
          </p>
        </div>

        <div style={{ maxWidth:680, margin:"0 auto" }}>

          {/* Zone Drop */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current?.click()}
            style={{
              border:`2px dashed ${dragging ? C.primary : file ? C.success : C.border}`,
              borderRadius:20, padding:"48px 32px", textAlign:"center",
              cursor: file ? "default" : "pointer",
              background: dragging ? "#FCE4F3" : file ? "#F0FDF4" : C.card,
              transition:"all 0.3s",
              boxShadow: dragging ? `0 0 0 4px ${C.primary}18` : "0 2px 8px rgba(0,0,0,0.04)",
              marginBottom:24,
            }}
          >
            <input ref={inputRef} type="file" accept=".pdf,.docx" style={{ display:"none" }}
              onChange={e => handleFile(e.target.files[0])} />

            {!file ? (
              <>
                <div style={{
                  width:64, height:64, borderRadius:"50%",
                  background: dragging ? C.gradient : C.gradientLight,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 20px", transition:"all 0.3s",
                  boxShadow: dragging ? "0 8px 24px rgba(200,24,122,0.3)" : "none",
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dragging ? "#fff" : C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:C.text, margin:"0 0 8px" }}>
                  Glissez votre CV ici ou cliquez pour parcourir
                </p>
                <p style={{ color:C.muted, fontSize:13, margin:"0 0 20px" }}>PDF, DOCX — Max 5MB</p>
                <button onClick={e => { e.stopPropagation(); inputRef.current?.click(); }} style={{
                  background:"transparent", border:`1.5px solid ${C.primary}`,
                  color:C.primary, borderRadius:10, padding:"10px 24px",
                  fontSize:13, fontWeight:700, cursor:"pointer",
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  display:"inline-flex", alignItems:"center", gap:8,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Parcourir les fichiers
                </button>
              </>
            ) : (
              <>
                <div style={{ width:64, height:64, borderRadius:"50%", background:"#DCFCE7", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <p style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:C.text, margin:"0 0 4px" }}>{file.name}</p>
                <p style={{ color:C.muted, fontSize:13, margin:"0 0 16px" }}>{fmtSize(file.size)}</p>
                <button onClick={e => { e.stopPropagation(); setFile(null); setProgress(0); setDone(false); }} style={{
                  background:"transparent", border:`1px solid ${C.border}`,
                  color:C.muted, borderRadius:8, padding:"6px 16px",
                  fontSize:12, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif",
                }}>✕ Supprimer</button>
              </>
            )}
          </div>

          {/* Progression */}
          {(loading || done) && (
            <div style={{ marginBottom:24, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:13, fontWeight:600, color:C.text, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{file?.name}</span>
                <span style={{ fontSize:13, fontWeight:700, color: done ? C.success : C.primary, fontFamily:"'Syne',sans-serif" }}>{progress}%</span>
              </div>
              <div style={{ height:8, borderRadius:4, background:C.border, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:4, background: done ? C.success : C.gradient, width:`${progress}%`, transition:"width 0.08s ease" }} />
              </div>
              {done && <p style={{ color:C.success, fontSize:12, fontWeight:600, margin:"8px 0 0", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>✅ Analyse terminée ! Redirection vers les résultats...</p>}
            </div>
          )}

          {/* Bouton lancer */}
          <button onClick={handleLaunch} disabled={!file || loading || done} style={{
            width:"100%",
            background: !file || loading || done ? C.border : C.gradient,
            border:"none", color: !file || loading || done ? C.muted : "#fff",
            fontSize:15, fontWeight:700, padding:"16px", borderRadius:14,
            cursor: !file || loading || done ? "not-allowed" : "pointer",
            fontFamily:"'Syne',sans-serif",
            boxShadow: !file || loading || done ? "none" : "0 4px 20px rgba(200,24,122,0.3)",
            transition:"all 0.2s", marginBottom:24,
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4"/>
            </svg>
            {loading ? "⏳ Analyse en cours..." : done ? "✅ Analyse terminée !" : "Lancer l'Analyse IA"}
          </button>

          {/* Badges */}
          <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:36 }}>
            {[["⚡","RAPIDE"],["🎯","PRÉCIS"],["🔍","TRANSPARENT"]].map(([ic,lb]) => (
              <div key={lb} style={{
                display:"flex", alignItems:"center", gap:6,
                background:C.gradientLight, borderRadius:50, padding:"6px 16px",
                fontSize:12, fontWeight:700, color:C.primary,
                fontFamily:"'Plus Jakarta Sans',sans-serif",
                border:`1px solid ${C.border}`,
              }}>{ic} {lb}</div>
            ))}
          </div>

          {/* Features */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              ["🛡️","IA Spécialisée","Algorithme entraîné sur des milliers de recrutements réussis pour détecter les mots-clés essentiels."],
              ["🔐","Confidentialité","Données chiffrées et supprimées après analyse. Conformité RGPD stricte."],
              ["⚡","Résultats Instantanés","Obtenez votre score ATS et vos recommandations en moins de 10 secondes."],
              ["📈","Suivi Progression","Comparez vos versions et suivez votre amélioration au fil des optimisations."],
            ].map(([ic,ti,de], i) => (
              <div key={i} style={{
                background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px",
                display:"flex", gap:14, boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{ic}</span>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>{ti}</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{de}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      `}</style>
    </div>
  );
}