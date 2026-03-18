import { useState, useEffect, useRef } from "react";

// ── Floating particles background ──────────────────────────
function Particles() {
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 14 + 8,
    delay: Math.random() * 6,
    color: ["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#c77dff","#ff9a3c"][Math.floor(Math.random()*6)],
  }));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
          width:p.size, height:p.size, borderRadius:"50%",
          background:p.color, opacity:0.18,
          animation:`floatUp ${p.duration}s ${p.delay}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}

// ── Animated counter ───────────────────────────────────────
function Counter({ target, suffix="" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 18);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Step card ──────────────────────────────────────────────
function StepCard({ number, icon, title, desc, color, delay }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.07)",
      backdropFilter:"blur(12px)",
      border:`1.5px solid ${color}40`,
      borderRadius:24, padding:"32px 28px",
      display:"flex", flexDirection:"column", gap:14,
      position:"relative", overflow:"hidden",
      animation:`slideUp 0.7s ${delay}s both`,
      transition:"transform 0.3s, box-shadow 0.3s",
      cursor:"default",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow=`0 24px 48px ${color}30`; }}
    onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
    >
      <div style={{
        position:"absolute", top:-20, right:-20,
        width:90, height:90, borderRadius:"50%",
        background:`${color}15`,
      }} />
      <div style={{
        width:52, height:52, borderRadius:16,
        background:`linear-gradient(135deg, ${color}30, ${color}10)`,
        border:`1.5px solid ${color}50`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:26,
      }}>{icon}</div>
      <div style={{
        fontFamily:"'Syne', sans-serif",
        fontSize:13, fontWeight:700, letterSpacing:"0.12em",
        color:color, textTransform:"uppercase"
      }}>Étape {number}</div>
      <div style={{ fontFamily:"'Syne', sans-serif", fontSize:19, fontWeight:700, color:"#fff", lineHeight:1.3 }}>{title}</div>
      <div style={{ color:"#94a3b8", fontSize:14, lineHeight:1.7 }}>{desc}</div>
    </div>
  );
}

// ── Feature pill ───────────────────────────────────────────
function FeaturePill({ icon, text, color }) {
  return (
    <div style={{
      display:"inline-flex", alignItems:"center", gap:8,
      background:`${color}15`, border:`1px solid ${color}35`,
      borderRadius:50, padding:"8px 18px",
      color:"#e2e8f0", fontSize:13, fontWeight:500,
      backdropFilter:"blur(8px)",
    }}>
      <span>{icon}</span><span>{text}</span>
    </div>
  );
}

// ── Testimonial ────────────────────────────────────────────
function TestiCard({ name, role, text, avatar, color }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.05)",
      backdropFilter:"blur(12px)",
      border:`1px solid rgba(255,255,255,0.1)`,
      borderRadius:20, padding:"28px 24px",
      display:"flex", flexDirection:"column", gap:16,
    }}>
      <div style={{ color:"#94a3b8", fontSize:14, lineHeight:1.8, fontStyle:"italic" }}>"{text}"</div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{
          width:42, height:42, borderRadius:"50%",
          background:`linear-gradient(135deg, ${color}, ${color}80)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:20, fontWeight:700, color:"#fff",
          fontFamily:"'Syne', sans-serif"
        }}>{avatar}</div>
        <div>
          <div style={{ color:"#f1f5f9", fontWeight:600, fontSize:14 }}>{name}</div>
          <div style={{ color:"#64748b", fontSize:12 }}>{role}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main Landing Page ──────────────────────────────────────
export default function LandingPage() {
  const [uploaded, setUploaded] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const handleDemo = () => {
    setScanning(true); setDone(false);
    setTimeout(() => { setScanning(false); setDone(true); }, 2200);
  };

  const steps = [
    { icon:"📄", title:"Upload ton CV", desc:"Dépose ton CV en PDF en quelques secondes. Notre système l'extrait et le comprend instantanément.", color:"#ff6b6b" },
    { icon:"🧠", title:"Analyse par IA", desc:"Notre IA basée sur BERT et NLP analyse tes compétences, ton expérience et évalue ton profil.", color:"#ffd93d" },
    { icon:"❓", title:"Questions personnalisées", desc:"Mistral génère des questions d'entretien sur mesure, adaptées exactement à ton parcours.", color:"#6bcb77" },
    { icon:"🎤", title:"Simule l'entretien", desc:"Réponds à l'oral, Whisper transcrit tes réponses et l'IA te donne un feedback détaillé.", color:"#4d96ff" },
  ];

  const features = [
    ["🤖","NLP Avancé","#ff6b6b"], ["⚡","Analyse en 5 secondes","#ffd93d"],
    ["🎯","Score précis","#6bcb77"], ["🗣️","Entretien oral","#4d96ff"],
    ["📊","Rapport complet","#c77dff"], ["🌍","Français & Arabe","#ff9a3c"],
    ["🔒","100% Privé","#ff6b6b"], ["💡","Conseils IA","#6bcb77"],
  ];

  const testimonials = [
    { name:"Ahmed B.", role:"Ingénieur ML — Casablanca", text:"J'ai décroché mon poste chez une startup tech après m'être préparé avec cet outil. Les questions générées étaient exactement celles posées en vrai !", avatar:"A", color:"#ff6b6b" },
    { name:"Sara I.", role:"Développeuse Full Stack", text:"Le scoring de mon CV m'a montré exactement ce qui manquait. J'ai amélioré mon profil et eu 3x plus de réponses en une semaine.", avatar:"S", color:"#4d96ff" },
    { name:"Youssef E.", role:"Data Scientist — Rabat", text:"Incroyable de voir une IA générer des questions aussi pertinentes basées sur mon CV. La simulation d'entretien est bluffante.", avatar:"Y", color:"#6bcb77" },
  ];

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg, #0d0d1a 0%, #0a1628 40%, #0d0d1a 100%)",
      fontFamily:"'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      color:"#e2e8f0", overflowX:"hidden", position:"relative",
    }}>
      <Particles />

      {/* ── Mesh gradient blobs ── */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-15%", left:"-10%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, #ff6b6b18, transparent 70%)" }} />
        <div style={{ position:"absolute", top:"30%", right:"-15%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, #4d96ff18, transparent 70%)" }} />
        <div style={{ position:"absolute", bottom:"10%", left:"20%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, #6bcb7718, transparent 70%)" }} />
      </div>

      {/* ── Navbar ── */}
      <nav style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(13,13,26,0.8)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(255,255,255,0.07)",
        padding:"0 48px", height:68,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:38, height:38, borderRadius:12,
            background:"linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20,
          }}>🎯</div>
          <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:18, color:"#fff", letterSpacing:"-0.02em" }}>
            CV<span style={{ color:"#ffd93d" }}>Pro</span>AI
          </span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {["Fonctionnalités","Comment ça marche","Témoignages"].map(l => (
            <button key={l} style={{ background:"transparent", border:"none", color:"#94a3b8", fontSize:14, padding:"8px 16px", cursor:"pointer", borderRadius:8 }}>{l}</button>
          ))}
          <button style={{
            background:"linear-gradient(135deg, #ff6b6b, #ffd93d)",
            border:"none", color:"#0d0d1a", fontWeight:700,
            padding:"10px 22px", borderRadius:10, cursor:"pointer", fontSize:14,
          }}>Essayer gratuitement →</button>
        </div>
      </nav>

      <div style={{ position:"relative", zIndex:1 }}>

        {/* ── HERO ── */}
        <section style={{ padding:"100px 48px 80px", textAlign:"center", maxWidth:900, margin:"0 auto" }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(255,217,61,0.12)", border:"1px solid rgba(255,217,61,0.3)",
            borderRadius:50, padding:"8px 20px", fontSize:13, color:"#ffd93d",
            marginBottom:32, animation:"fadeIn 0.6s both",
          }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#ffd93d", display:"inline-block", animation:"pulse 2s infinite" }} />
            Nouveau · Propulsé par Mistral AI + Whisper
          </div>

          <h1 style={{
            fontFamily:"'Syne', sans-serif",
            fontSize:"clamp(42px, 7vw, 76px)",
            fontWeight:800, lineHeight:1.05,
            letterSpacing:"-0.03em", margin:"0 0 24px",
            animation:"slideUp 0.7s 0.1s both",
          }}>
            <span style={{ color:"#fff" }}>Ton CV analysé.</span><br />
            <span style={{
              background:"linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundSize:"200%", animation:"shimmer 4s linear infinite",
            }}>Ton entretien simulé.</span>
          </h1>

          <p style={{
            fontSize:18, color:"#94a3b8", maxWidth:580, margin:"0 auto 48px",
            lineHeight:1.8, animation:"slideUp 0.7s 0.2s both",
          }}>
            Upload ton CV, reçois une analyse IA complète, des questions personnalisées et entraîne-toi à l'entretien oral. Tout en <strong style={{ color:"#6bcb77" }}>5 minutes</strong>.
          </p>

          {/* CTA Buttons */}
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", animation:"slideUp 0.7s 0.3s both" }}>
            <button style={{
              background:"linear-gradient(135deg, #ff6b6b, #ffd93d)",
              border:"none", color:"#0d0d1a",
              fontFamily:"'Syne', sans-serif", fontWeight:800,
              padding:"16px 36px", borderRadius:14, cursor:"pointer",
              fontSize:16, letterSpacing:"-0.01em",
              boxShadow:"0 8px 32px rgba(255,107,107,0.4)",
              transition:"all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform="scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
            >
              🚀 Analyser mon CV — Gratuit
            </button>
            <button style={{
              background:"rgba(255,255,255,0.06)", border:"1.5px solid rgba(255,255,255,0.15)",
              color:"#e2e8f0", padding:"16px 32px", borderRadius:14,
              cursor:"pointer", fontSize:16, fontWeight:600,
              backdropFilter:"blur(8px)", transition:"all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.4)"}
            onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"}
            >
              ▶ Voir la démo
            </button>
          </div>

          {/* Feature pills */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", marginTop:40, animation:"slideUp 0.7s 0.4s both" }}>
            {features.map(([icon, text, color]) => (
              <FeaturePill key={text} icon={icon} text={text} color={color} />
            ))}
          </div>
        </section>

        {/* ── DEMO CARD ── */}
        <section style={{ padding:"0 48px 80px", maxWidth:760, margin:"0 auto" }}>
          <div style={{
            background:"rgba(255,255,255,0.04)",
            backdropFilter:"blur(20px)",
            border:"1.5px solid rgba(255,255,255,0.1)",
            borderRadius:28, overflow:"hidden",
            boxShadow:"0 40px 80px rgba(0,0,0,0.4)",
          }}>
            {/* Window bar */}
            <div style={{ background:"rgba(255,255,255,0.05)", padding:"14px 20px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
              {["#ff6b6b","#ffd93d","#6bcb77"].map(c => <div key={c} style={{ width:12, height:12, borderRadius:"50%", background:c }} />)}
              <div style={{ flex:1, background:"rgba(255,255,255,0.06)", borderRadius:6, height:26, margin:"0 12px", display:"flex", alignItems:"center", paddingLeft:12 }}>
                <span style={{ color:"#475569", fontSize:12 }}>cvproai.ma/analyser</span>
              </div>
            </div>

            <div style={{ padding:36 }}>
              {!done ? (
                <div style={{ textAlign:"center" }}>
                  <div style={{
                    border:"2px dashed rgba(255,217,61,0.4)",
                    borderRadius:20, padding:"48px 32px",
                    background:"rgba(255,217,61,0.04)",
                    marginBottom:24,
                    position:"relative", overflow:"hidden",
                  }}>
                    {scanning && (
                      <div style={{
                        position:"absolute", top:0, left:"-100%", right:0, height:"100%",
                        background:"linear-gradient(90deg, transparent, rgba(255,217,61,0.15), transparent)",
                        animation:"scan 1s ease-in-out infinite",
                      }} />
                    )}
                    <div style={{ fontSize:52, marginBottom:16 }}>{scanning ? "⏳" : "📄"}</div>
                    <div style={{ color:"#94a3b8", marginBottom:20 }}>
                      {scanning ? "Analyse IA en cours..." : "Glissez votre CV ici ou cliquez"}
                    </div>
                    {!scanning && (
                      <button onClick={handleDemo} style={{
                        background:"linear-gradient(135deg, #ffd93d, #ff6b6b)",
                        border:"none", color:"#0d0d1a",
                        fontWeight:800, padding:"12px 28px", borderRadius:10,
                        cursor:"pointer", fontSize:15,
                      }}>📂 Simuler un upload</button>
                    )}
                    {scanning && (
                      <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
                        {["Extraction texte...","Analyse NLP...","Scoring IA...","Génération questions..."].map((t,i) => (
                          <div key={t} style={{
                            background:"rgba(255,217,61,0.15)", border:"1px solid rgba(255,217,61,0.3)",
                            borderRadius:6, padding:"4px 12px", fontSize:11, color:"#ffd93d",
                            animation:`fadeIn 0.4s ${i*0.4}s both`,
                          }}>{t}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:16, animation:"slideUp 0.5s both" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, color:"#fff" }}>✅ Analyse complète !</div>
                      <div style={{ color:"#64748b", fontSize:14 }}>Mohammed_Alami_CV.pdf</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:"'Syne', sans-serif", fontSize:42, fontWeight:800, background:"linear-gradient(135deg, #6bcb77, #4d96ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>87%</div>
                      <div style={{ color:"#6bcb77", fontSize:13, fontWeight:600 }}>Excellent profil</div>
                    </div>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                    {[["💼","3 ans","Expérience"],["🎓","Génie Info","Formation"],["🌍","FR / EN","Langues"]].map(([i,v,l]) => (
                      <div key={l} style={{ background:"rgba(255,255,255,0.05)", borderRadius:12, padding:"14px", textAlign:"center" }}>
                        <div style={{ fontSize:22 }}>{i}</div>
                        <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{v}</div>
                        <div style={{ color:"#64748b", fontSize:11 }}>{l}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ color:"#94a3b8", fontSize:12, marginBottom:8 }}>COMPÉTENCES DÉTECTÉES</div>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {["Python","FastAPI","React","ML","Docker","NLP"].map((c,i) => (
                        <span key={c} style={{
                          background:[`rgba(255,107,107,0.15)`,`rgba(255,217,61,0.15)`,`rgba(107,203,119,0.15)`,`rgba(77,150,255,0.15)`,`rgba(199,125,255,0.15)`,`rgba(255,154,60,0.15)`][i],
                          color:[`#ff6b6b`,`#ffd93d`,`#6bcb77`,`#4d96ff`,`#c77dff`,`#ff9a3c`][i],
                          borderRadius:8, padding:"5px 14px", fontSize:13, fontWeight:600,
                        }}>{c}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ background:"rgba(77,150,255,0.08)", border:"1px solid rgba(77,150,255,0.2)", borderRadius:12, padding:16 }}>
                    <div style={{ color:"#4d96ff", fontSize:12, fontWeight:700, marginBottom:8 }}>❓ QUESTIONS GÉNÉRÉES PAR IA</div>
                    {["Décrivez votre expérience avec FastAPI et les architectures microservices.","Comment avez-vous appliqué le Machine Learning dans un projet réel ?"].map((q,i) => (
                      <div key={i} style={{ color:"#94a3b8", fontSize:13, padding:"6px 0", borderBottom:i===0?"1px solid rgba(255,255,255,0.05)":"none" }}>
                        {i+1}. {q}
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setDone(false)} style={{
                    background:"transparent", border:"1px solid rgba(255,255,255,0.15)",
                    color:"#94a3b8", padding:"10px", borderRadius:10,
                    cursor:"pointer", fontSize:13,
                  }}>↩ Réessayer</button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ padding:"60px 48px", background:"rgba(255,255,255,0.02)", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:32, textAlign:"center" }}>
            {[
              ["500+","CVs analysés","#ff6b6b"],
              ["98","% de satisfaction","#ffd93d"],
              ["5","secondes d'analyse","#6bcb77"],
              ["3x","plus de réponses","#4d96ff"],
            ].map(([n,l,c]) => (
              <div key={l}>
                <div style={{ fontFamily:"'Syne', sans-serif", fontSize:44, fontWeight:800, color:c }}>{n}</div>
                <div style={{ color:"#64748b", fontSize:14, marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding:"90px 48px", maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <div style={{ color:"#6bcb77", fontSize:13, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 }}>COMMENT ÇA MARCHE</div>
            <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:40, fontWeight:800, color:"#fff", margin:0, letterSpacing:"-0.02em" }}>
              4 étapes vers l'entretien parfait
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {steps.map((s,i) => <StepCard key={i} number={i+1} {...s} delay={i*0.1} />)}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ padding:"80px 48px", maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ color:"#c77dff", fontSize:13, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 }}>TÉMOIGNAGES</div>
            <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:40, fontWeight:800, color:"#fff", margin:0, letterSpacing:"-0.02em" }}>
              Ils ont décroché leur poste
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {testimonials.map(t => <TestiCard key={t.name} {...t} />)}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ padding:"80px 48px 120px", textAlign:"center" }}>
          <div style={{
            maxWidth:700, margin:"0 auto",
            background:"rgba(255,255,255,0.04)",
            backdropFilter:"blur(20px)",
            border:"1.5px solid rgba(255,255,255,0.1)",
            borderRadius:32, padding:"64px 48px",
            position:"relative", overflow:"hidden",
          }}>
            <div style={{ position:"absolute", top:"-40%", left:"50%", transform:"translateX(-50%)", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,107,107,0.12), transparent 70%)", pointerEvents:"none" }} />
            <div style={{ fontSize:52, marginBottom:20 }}>🚀</div>
            <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:36, fontWeight:800, color:"#fff", margin:"0 0 16px", letterSpacing:"-0.02em" }}>
              Prêt à décrocher ton poste ?
            </h2>
            <p style={{ color:"#94a3b8", fontSize:16, marginBottom:36, lineHeight:1.7 }}>
              Rejoins les étudiants qui ont transformé leur recherche d'emploi avec CVProAI.
            </p>
            <button style={{
              background:"linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77)",
              border:"none", color:"#0d0d1a",
              fontFamily:"'Syne', sans-serif", fontWeight:800,
              padding:"18px 48px", borderRadius:14, cursor:"pointer",
              fontSize:18, letterSpacing:"-0.01em",
              boxShadow:"0 12px 40px rgba(255,107,107,0.35)",
              transition:"all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.05)"; e.currentTarget.style.boxShadow="0 16px 50px rgba(255,107,107,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 12px 40px rgba(255,107,107,0.35)"; }}
            >
              Analyser mon CV maintenant — C'est gratuit 🎯
            </button>
            <div style={{ color:"#475569", fontSize:13, marginTop:16 }}>Aucune carte bancaire requise · 100% gratuit pour les étudiants</div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"32px 48px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, color:"#fff" }}>CV<span style={{ color:"#ffd93d" }}>Pro</span>AI</div>
          <div style={{ color:"#475569", fontSize:13 }}>© 2025 · PFA ENIAD Berkane · Équipe Génie Informatique</div>
          <div style={{ display:"flex", gap:16 }}>
            {["GitHub","Docs","Contact"].map(l => <a key={l} href="#" style={{ color:"#475569", fontSize:13, textDecoration:"none" }}>{l}</a>)}
          </div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatUp { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.1)} }
        @keyframes shimmer { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes scan { 0%{left:-100%} 100%{left:100%} }
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#0d0d1a}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}
      `}</style>
    </div>
  );
}
