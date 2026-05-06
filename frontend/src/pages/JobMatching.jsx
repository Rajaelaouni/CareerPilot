/**
 * @file JobMatching.jsx
 * @description Page de Matching Intelligent CareerPilot
 * @author Fatima Zahra MARGHICH
 */

import { useState } from "react";
import Sidebar, { C, Icons } from "./Sidebar";
import { useAppSettings } from "../context/AppSettingsContext";

export default function JobMatching() {
  const { theme } = useAppSettings();

  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleMatch = async () => {
    if (!jobDescription) return;
    setLoading(true);

    await new Promise(r => setTimeout(r, 2000));

    setResults({
      score: 78,
      matching: ["React.js", "TailwindCSS", "FastAPI", "PostgreSQL"],
      missing: ["Docker", "AWS", "CI/CD"],
      advice: "Votre profil correspond bien. Pour atteindre 90%, mentionnez vos projets utilisant Docker."
    });

    setLoading(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <Sidebar activePage="matching" />

      <div style={{ marginLeft: 240, flex: 1, padding: "32px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: theme.text, margin: "0 0 8px" }}>
            Job Matching <span style={{ color: C.secondary }}>Intelligent</span>
          </h1>
          <p style={{ color: theme.muted, fontSize: 14, margin: 0 }}>
            Analysez la compatibilité entre votre CV et une offre d'emploi grâce à la similarité sémantique.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            background: theme.card,
            borderRadius: 20,
            padding: 24,
            border: `1px solid ${theme.border}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 16, color: theme.text }}>
              Description du poste
            </h3>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Collez ici l'offre d'emploi (Job Description)..."
              style={{
                width: "100%",
                height: 350,
                padding: 16,
                borderRadius: 12,
                border: `1px solid ${theme.border}`,
                background: theme.bg,
                color: theme.text,
                outline: "none",
                fontSize: 14,
                fontFamily: "inherit",
                resize: "none"
              }}
            />

            <button 
              onClick={handleMatch}
              disabled={loading || !jobDescription}
              style={{
                width: "100%",
                marginTop: 20,
                background: loading || !jobDescription ? theme.border : theme.gradient,
                border: "none",
                color: loading || !jobDescription ? theme.muted : "#fff",
                fontSize: 15,
                fontWeight: 700,
                padding: "14px",
                borderRadius: 14,
                cursor: "pointer",
                fontFamily: "'Syne',sans-serif",
                transition: "all 0.2s"
              }}
            >
              {loading ? "⌛ Analyse sémantique..." : "Lancer le Matching IA"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {!results ? (
              <div style={{ 
                flex: 1,
                border: `2px dashed ${theme.border}`,
                borderRadius: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 40,
                color: theme.muted,
                textAlign: "center"
              }}>
                <div style={{ opacity: 0.2, marginBottom: 16 }}>{Icons.matching}</div>
                <p style={{ fontSize: 14 }}>Les résultats de compatibilité s'afficheront ici.</p>
              </div>
            ) : (
              <div style={{
                background: theme.card,
                borderRadius: 20,
                padding: 24,
                border: `1px solid ${theme.border}`,
                animation: "fadeIn 0.4s ease"
              }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ 
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: theme.gradientLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px" 
                  }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: C.primary, fontFamily: "'Syne'" }}>
                      {results.score}%
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>
                    Score de Match
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.success, marginBottom: 8 }}>
                    ✓ POINTS COMMUNS
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {results.matching.map(s => (
                      <span key={s} style={{ background: "#DCFCE7", color: "#166534", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.error, marginBottom: 8 }}>
                    ✗ COMPÉTENCES MANQUANTES
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {results.missing.map(s => (
                      <span key={s} style={{ background: "#FEE2E2", color: "#991B1B", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: theme.bg,
                  padding: 12,
                  borderRadius: 10,
                  borderLeft: `4px solid ${C.primary}`,
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: theme.text
                }}>
                  <strong>Conseil IA:</strong> {results.advice}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}