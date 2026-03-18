import { useState } from "react";

// ── Floating particles ─────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 5,
    color: ["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#c77dff"][Math.floor(Math.random()*5)],
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
          width:p.size, height:p.size, borderRadius:"50%",
          background:p.color, opacity:0.15,
          animation:`floatUp ${p.duration}s ${p.delay}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}

// ── Input Field ────────────────────────────────────────────
function InputField({ icon, type, placeholder, value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <div style={{
        display:"flex", alignItems:"center", gap:12,
        background: focused ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${error ? "#ff6b6b" : focused ? "#ffd93d" : "rgba(255,255,255,0.1)"}`,
        borderRadius:14, padding:"14px 18px",
        transition:"all 0.2s",
      }}>
        <span style={{ fontSize:18, opacity:0.7 }}>{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex:1, background:"transparent", border:"none", outline:"none",
            color:"#f1f5f9", fontSize:15,
            fontFamily:"'Plus Jakarta Sans', sans-serif",
          }}
        />
      </div>
      {error && <span style={{ color:"#ff6b6b", fontSize:12, paddingLeft:4 }}>⚠ {error}</span>}
    </div>
  );
}

// ── Login Page ─────────────────────────────────────────────
function LoginPage({ onSwitch }) {
  const [form, setForm] = useState({ email:"", password:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Email invalide";
    if (form.password.length < 6) e.password = "Minimum 6 caractères";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      {/* Header */}
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>👋</div>
        <h2 style={{
          fontFamily:"'Syne', sans-serif", fontSize:30, fontWeight:800,
          color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em"
        }}>Bon retour !</h2>
        <p style={{ color:"#64748b", fontSize:14 }}>Connecte toi à ton compte CareerPilot</p>
      </div>

      {success ? (
        <div style={{
          background:"rgba(107,203,119,0.1)", border:"1.5px solid rgba(107,203,119,0.3)",
          borderRadius:16, padding:28, textAlign:"center",
          animation:"slideUp 0.5s both"
        }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
          <div style={{ color:"#6bcb77", fontWeight:700, fontSize:18, marginBottom:8 }}>Connexion réussie !</div>
          <div style={{ color:"#94a3b8", fontSize:14 }}>Redirection vers le dashboard...</div>
        </div>
      ) : (
        <>
          {/* Form */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <InputField
              icon="📧" type="email" placeholder="Adresse email"
              value={form.email} error={errors.email}
              onChange={e => setForm({...form, email:e.target.value})}
            />
            <InputField
              icon="🔒" type="password" placeholder="Mot de passe"
              value={form.password} error={errors.password}
              onChange={e => setForm({...form, password:e.target.value})}
            />
            <div style={{ textAlign:"right" }}>
              <span style={{ color:"#ffd93d", fontSize:13, cursor:"pointer" }}>
                Mot de passe oublié ?
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #ff6b6b, #ffd93d)",
              border:"none", color: loading ? "#64748b" : "#0d0d1a",
              fontFamily:"'Syne', sans-serif", fontWeight:800,
              padding:"16px", borderRadius:14, cursor: loading ? "not-allowed" : "pointer",
              fontSize:16, transition:"all 0.2s",
              boxShadow: loading ? "none" : "0 8px 32px rgba(255,107,107,0.3)",
            }}
          >
            {loading ? "⏳ Connexion en cours..." : "🚀 Se connecter"}
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
            <span style={{ color:"#475569", fontSize:13 }}>ou continuer avec</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }} />
          </div>

          {/* Social */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[["🔵","Google"],["⚫","GitHub"]].map(([icon, name]) => (
              <button key={name} style={{
                background:"rgba(255,255,255,0.04)",
                border:"1.5px solid rgba(255,255,255,0.1)",
                color:"#e2e8f0", padding:"12px", borderRadius:12,
                cursor:"pointer", fontSize:14, fontWeight:600,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                transition:"all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"}
              >
                {icon} {name}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Switch */}
      <p style={{ textAlign:"center", color:"#64748b", fontSize:14, margin:0 }}>
        Pas encore de compte ?{" "}
        <span
          onClick={onSwitch}
          style={{ color:"#ffd93d", fontWeight:700, cursor:"pointer" }}
        >
          S'inscrire gratuitement →
        </span>
      </p>
    </div>
  );
}

// ── Sign Up Page ───────────────────────────────────────────
function SignUpPage({ onSwitch }) {
  const [form, setForm] = useState({ nom:"", email:"", password:"", confirm:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const validateStep1 = () => {
    const e = {};
    if (form.nom.length < 2) e.nom = "Nom trop court";
    if (!form.email.includes("@")) e.email = "Email invalide";
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (form.password.length < 6) e.password = "Minimum 6 caractères";
    if (form.password !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    return e;
  };

  const handleNext = () => {
    const e = validateStep1();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({}); setStep(2);
  };

  const handleSubmit = () => {
    const e = validateStep2();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({}); setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
  };

  // Password strength
  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;
  const strengthColors = ["#ff6b6b","#ff6b6b","#ffd93d","#6bcb77"];
  const strengthLabels = ["","Faible","Moyen","Fort"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header */}
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🎯</div>
        <h2 style={{
          fontFamily:"'Syne', sans-serif", fontSize:30, fontWeight:800,
          color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em"
        }}>Créer un compte</h2>
        <p style={{ color:"#64748b", fontSize:14 }}>Rejoins CareerPilot gratuitement</p>
      </div>

      {/* Step indicator */}
      <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
        {[1,2].map(s => (
          <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{
              width:32, height:32, borderRadius:"50%",
              background: step >= s ? "linear-gradient(135deg, #ff6b6b, #ffd93d)" : "rgba(255,255,255,0.08)",
              border: `2px solid ${step >= s ? "transparent" : "rgba(255,255,255,0.1)"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              color: step >= s ? "#0d0d1a" : "#475569",
              fontWeight:800, fontSize:14,
              transition:"all 0.3s",
            }}>{s}</div>
            {s === 1 && <div style={{ width:60, height:2, background: step > 1 ? "linear-gradient(90deg,#ff6b6b,#ffd93d)" : "rgba(255,255,255,0.08)", borderRadius:2, transition:"all 0.3s" }} />}
          </div>
        ))}
      </div>

      {success ? (
        <div style={{
          background:"rgba(107,203,119,0.1)", border:"1.5px solid rgba(107,203,119,0.3)",
          borderRadius:16, padding:28, textAlign:"center",
          animation:"slideUp 0.5s both"
        }}>
          <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
          <div style={{ color:"#6bcb77", fontWeight:700, fontSize:18, marginBottom:8 }}>Compte créé avec succès !</div>
          <div style={{ color:"#94a3b8", fontSize:14 }}>Bienvenue sur CareerPilot, {form.nom} ! 🎉</div>
        </div>
      ) : (
        <>
          {step === 1 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:16, animation:"slideUp 0.4s both" }}>
              <InputField
                icon="👤" type="text" placeholder="Nom complet"
                value={form.nom} error={errors.nom}
                onChange={e => setForm({...form, nom:e.target.value})}
              />
              <InputField
                icon="📧" type="email" placeholder="Adresse email"
                value={form.email} error={errors.email}
                onChange={e => setForm({...form, email:e.target.value})}
              />
              <button onClick={handleNext} style={{
                background:"linear-gradient(135deg, #4d96ff, #c77dff)",
                border:"none", color:"#fff",
                fontFamily:"'Syne', sans-serif", fontWeight:800,
                padding:"16px", borderRadius:14, cursor:"pointer",
                fontSize:16, boxShadow:"0 8px 32px rgba(77,150,255,0.3)",
              }}>
                Continuer →
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:16, animation:"slideUp 0.4s both" }}>
              <InputField
                icon="🔒" type="password" placeholder="Mot de passe"
                value={form.password} error={errors.password}
                onChange={e => setForm({...form, password:e.target.value})}
              />

              {/* Password strength */}
              {form.password.length > 0 && (
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <div style={{ display:"flex", gap:6 }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{
                        flex:1, height:4, borderRadius:2,
                        background: strength >= i ? strengthColors[strength] : "rgba(255,255,255,0.08)",
                        transition:"all 0.3s"
                      }} />
                    ))}
                  </div>
                  <span style={{ color:strengthColors[strength], fontSize:12 }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}

              <InputField
                icon="✅" type="password" placeholder="Confirmer le mot de passe"
                value={form.confirm} error={errors.confirm}
                onChange={e => setForm({...form, confirm:e.target.value})}
              />

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => setStep(1)} style={{
                  background:"rgba(255,255,255,0.06)",
                  border:"1.5px solid rgba(255,255,255,0.1)",
                  color:"#94a3b8", padding:"16px 24px", borderRadius:14,
                  cursor:"pointer", fontSize:15, fontWeight:600,
                }}>← Retour</button>
                <button onClick={handleSubmit} disabled={loading} style={{
                  flex:1,
                  background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #ff6b6b, #ffd93d)",
                  border:"none", color: loading ? "#64748b" : "#0d0d1a",
                  fontFamily:"'Syne', sans-serif", fontWeight:800,
                  padding:"16px", borderRadius:14, cursor: loading ? "not-allowed" : "pointer",
                  fontSize:16, boxShadow: loading ? "none" : "0 8px 32px rgba(255,107,107,0.3)",
                }}>
                  {loading ? "⏳ Création..." : "🎉 Créer mon compte"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Switch */}
      <p style={{ textAlign:"center", color:"#64748b", fontSize:14, margin:0 }}>
        Déjà un compte ?{" "}
        <span onClick={onSwitch} style={{ color:"#ffd93d", fontWeight:700, cursor:"pointer" }}>
          Se connecter →
        </span>
      </p>
    </div>
  );
}

// ── Main Auth Page ─────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg, #0d0d1a 0%, #0a1628 50%, #0d0d1a 100%)",
      fontFamily:"'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24, position:"relative",
    }}>
      <Particles />

      {/* Blobs */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, #ff6b6b15, transparent 70%)" }} />
        <div style={{ position:"absolute", bottom:"-10%", right:"-10%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, #4d96ff15, transparent 70%)" }} />
        <div style={{ position:"absolute", top:"40%", left:"40%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, #ffd93d10, transparent 70%)" }} />
      </div>

      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:460 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:10,
            background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:50, padding:"10px 20px",
          }}>
            <div style={{
              width:32, height:32, borderRadius:10,
              background:"linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
            }}>🎯</div>
            <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:18, color:"#fff" }}>
              Career<span style={{ color:"#ffd93d" }}>Pilot</span>
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background:"rgba(255,255,255,0.04)",
          backdropFilter:"blur(24px)",
          border:"1.5px solid rgba(255,255,255,0.09)",
          borderRadius:28, padding:"40px 36px",
          boxShadow:"0 40px 80px rgba(0,0,0,0.4)",
        }}>
          {mode === "login"
            ? <LoginPage onSwitch={() => setMode("signup")} />
            : <SignUpPage onSwitch={() => setMode("login")} />
          }
        </div>

        {/* Footer */}
        <p style={{ textAlign:"center", color:"#334155", fontSize:12, marginTop:24 }}>
          © 2025 CareerPilot · PFA ENIAD Berkane
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-25px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: #475569; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #1e293b inset !important; -webkit-text-fill-color: #f1f5f9 !important; }
      `}</style>
    </div>
  );
}