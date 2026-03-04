import { useState, useEffect, useRef } from "react";

const C = {
  bg:      "#04000e",
  panel:   "#07001a",
  card:    "#0a0020",
  cyan:    "#00ffd1",
  pink:    "#ff5af1",
  blue:    "#3b82ff",
  purple:  "#9b00ff",
  gold:    "#ffd700",
  text:    "#c8d4e8",
  muted:   "#3a4055",
  border:  "#150030",
};

// ── SCAN LINES ────────────────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: "BIOS POST complete — Dell XPS 8700",           delay: 0,    color: C.muted },
{ text: "CPU: Intel i7-4790 @ 4.00GHz (8 cores)",       delay: 80,   color: C.muted },
{ text: "RAM: 16GB DDR3 — OK",                          delay: 160,  color: C.muted },
{ text: "GPU: AMD Radeon RX 580 — driver loaded",        delay: 240,  color: C.muted },
{ text: "SSD /dev/sda — 120GB — MOUNTED",               delay: 320,  color: C.muted },
{ text: "SSD /dev/sdb — 120GB — MOUNTED",               delay: 380,  color: C.muted },
{ text: "HDD /dev/sdc — 1TB LINUXDRIVE — MOUNTED",      delay: 440,  color: C.cyan  },
{ text: "SteamLibrary detected on LINUXDRIVE",           delay: 520,  color: C.cyan  },
{ text: "Niri compositor — ONLINE",                      delay: 600,  color: C.cyan  },
{ text: "PipeWire audio — ONLINE",                       delay: 660,  color: C.cyan  },
{ text: "WehttamSnaps sound system — LOADING...",        delay: 740,  color: C.pink  },
{ text: "J.A.R.V.I.S. voice pack — 57 clips ready",     delay: 860,  color: C.pink  },
{ text: "iDroid voice pack — 8 clips ready",             delay: 940,  color: C.pink  },
{ text: "GameMode daemon — ACTIVE",                      delay: 1020, color: C.cyan  },
{ text: "All systems nominal. Welcome back, Matthew.",   delay: 1140, color: C.gold  },
];

const FAKE_CPU = () => 12 + Math.floor(Math.random() * 18);
const FAKE_RAM = () => 38 + Math.floor(Math.random() * 8);

function Scanlines() {
  return <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999,
    background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px)" }} />;
}

function Glow({ children, color=C.cyan, size=14, weight=700, style={} }) {
  return <span style={{ color, fontSize:size, fontWeight:weight,
    fontFamily:"'Share Tech Mono',monospace",
    textShadow:`0 0 8px ${color}90, 0 0 24px ${color}40`,
    letterSpacing:"0.06em", ...style }}>{children}</span>;
}

// ── WS LOGO (SVG recreation of the gradient WS mark) ─────────────────────────
function WSLogo({ size=90, glow=false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{
      filter: glow ? `drop-shadow(0 0 18px ${C.cyan}) drop-shadow(0 0 40px ${C.purple}60)` : "none",
          transition:"filter 0.5s",
    }}>
    <defs>
    <linearGradient id="wsgrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#8b00ff"/>
    <stop offset="50%" stopColor="#3b82ff"/>
    <stop offset="100%" stopColor="#00c8ff"/>
    </linearGradient>
    </defs>
    {/* W */}
    <polygon points="8,20 18,20 25,55 32,35 40,55 47,20 57,20 44,78 32,52 20,78" fill="url(#wsgrad)"/>
    {/* S */}
    <path d="M62,22 Q85,18 85,35 Q85,48 68,50 Q55,52 55,64 Q55,80 78,78"
    fill="none" stroke="url(#wsgrad)" strokeWidth="9" strokeLinecap="round"/>
    {/* camera shutter circle */}
    <circle cx="32" cy="52" r="10" fill="#04000e" stroke="url(#wsgrad)" strokeWidth="2"/>
    <circle cx="32" cy="52" r="5" fill="url(#wsgrad)" opacity="0.7"/>
    {/* speed lines */}
    <line x1="38" y1="82" x2="50" y2="88" stroke="#ff5af1" strokeWidth="3" strokeLinecap="round"/>
    <line x1="44" y1="85" x2="52" y2="90" stroke="#ff5af1" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ── RADIAL SWEEP ANIMATION ───────────────────────────────────────────────────
function RadarSweep({ active, color=C.cyan, size=200 }) {
  return (
    <div style={{ position:"relative", width:size, height:size }}>
    {/* rings */}
    {[1,0.66,0.33].map((s,i) => (
      <div key={i} style={{ position:"absolute",
        width:size*s, height:size*s,
        top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
                                 borderRadius:"50%",
                                 border:`1px solid ${color}${active ? "40" : "18"}`,
                                 transition:"border-color 0.5s",
      }} />
    ))}
    {/* sweep */}
    {active && (
      <div style={{ position:"absolute", inset:0,
        borderRadius:"50%", overflow:"hidden",
        animation:"radarSpin 2s linear infinite",
      }}>
      <div style={{ position:"absolute", top:"50%", left:"50%",
        width:"50%", height:"2px",
        transformOrigin:"0 50%",
        background:`linear-gradient(90deg,${color},transparent)`,
                boxShadow:`0 0 8px ${color}`,
      }} />
      </div>
    )}
    {/* center dot */}
    <div style={{ position:"absolute", top:"50%", left:"50%",
      transform:"translate(-50%,-50%)",
          width:8, height:8, borderRadius:"50%",
          background: active ? color : C.muted,
          boxShadow: active ? `0 0 12px ${color}` : "none",
          transition:"all 0.5s",
    }} />
    </div>
  );
}

// ── STAT RING ────────────────────────────────────────────────────────────────
function StatRing({ value, max=100, label, color=C.cyan, size=100 }) {
  const r = (size/2) - 8;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - value/max);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
    <div style={{ position:"relative", width:size, height:size }}>
    <svg width={size} height={size}>
    <circle cx={size/2} cy={size/2} r={r} fill="none"
    stroke={C.border} strokeWidth="4"/>
    <circle cx={size/2} cy={size/2} r={r} fill="none"
    stroke={color} strokeWidth="4"
    strokeDasharray={circ}
    strokeDashoffset={fill}
    strokeLinecap="round"
    transform={`rotate(-90 ${size/2} ${size/2})`}
    style={{ filter:`drop-shadow(0 0 6px ${color})`, transition:"stroke-dashoffset 1s ease" }}/>
    </svg>
    <div style={{ position:"absolute", inset:0,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <Glow color={color} size={18}>{value}%</Glow>
      </div>
      </div>
      <Glow color={C.muted} size={10}>{label}</Glow>
      </div>
  );
}

// ── LINK BUTTON ──────────────────────────────────────────────────────────────
function LinkButton({ icon, label, sub, color, href="#" }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
    style={{ textDecoration:"none",
      display:"flex", alignItems:"center", gap:12,
      background: hover ? `${color}18` : `${color}08`,
      border:`1px solid ${hover ? color : color+"40"}`,
      borderRadius:3, padding:"10px 16px",
      boxShadow: hover ? `0 0 20px ${color}30` : "none",
      transition:"all 0.2s", cursor:"pointer",
    }}>
    <span style={{ fontSize:22 }}>{icon}</span>
    <div>
    <Glow color={color} size={13}>{label}</Glow>
    <div style={{ fontSize:10, color:C.muted, fontFamily:"monospace", marginTop:1 }}>{sub}</div>
    </div>
    <div style={{ marginLeft:"auto", color: hover ? color : C.muted, fontSize:12,
      fontFamily:"monospace", transition:"color 0.2s" }}>→</div>
      </a>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASES:  0=boot  1=logo  2=dashboard
// ══════════════════════════════════════════════════════════════════════════════
export default function WelcomeScreen() {
  const [phase, setPhase]         = useState(0);
  const [visibleLines, setVisible] = useState([]);
  const [logoGlow, setLogoGlow]   = useState(false);
  const [radarOn, setRadarOn]     = useState(false);
  const [cpu, setCpu]             = useState(FAKE_CPU());
  const [ram, setRam]             = useState(FAKE_RAM());
  const [time, setTime]           = useState(new Date());
  const [barW, setBarW]           = useState(0);
  const termRef = useRef(null);

  // Clock tick
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Stats jitter when on dashboard
  useEffect(() => {
    if (phase < 2) return;
    const t = setInterval(() => {
      setCpu(FAKE_CPU());
      setRam(FAKE_RAM());
    }, 2800);
    return () => clearInterval(t);
  }, [phase]);

  // ── PHASE 0: boot lines ───────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 0) return;
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisible(prev => [...prev, line]);
        setBarW(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
      }, line.delay);
    });
    // transition to logo phase
    const last = BOOT_LINES[BOOT_LINES.length - 1].delay;
    setTimeout(() => setPhase(1), last + 300);
  }, []);

  // ── PHASE 1: logo ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 1) return;
    setRadarOn(true);
    setTimeout(() => setLogoGlow(true), 200);
    setTimeout(() => setPhase(2), 1600);
  }, [phase]);

  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;700;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:${C.bg};overflow:hidden}
      ::-webkit-scrollbar{width:3px}
      ::-webkit-scrollbar-thumb{background:${C.cyan}40;border-radius:2px}
      @keyframes radarSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes flicker{0%,100%{opacity:1}93%{opacity:0.97}94%{opacity:0.7}95%{opacity:1}}
      @keyframes scanDown{0%{top:0}100%{top:100%}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .dash-card{animation:fadeUp 0.5s ease both}
      `}</style>
      <Scanlines />

      <div style={{ width:"100vw", height:"100vh", background:C.bg,
        display:"flex", alignItems:"center", justifyContent:"center",
        animation:"flicker 12s infinite", overflow:"hidden",
        position:"relative",
      }}>

      {/* Ambient background glow */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:`radial-gradient(ellipse 60% 50% at 50% 50%, ${C.purple}08 0%, transparent 70%)` }} />

        {/* Corner brackets */}
        {[
          {top:16,left:16,borderTop:`2px solid ${C.cyan}`,borderLeft:`2px solid ${C.cyan}`},
          {top:16,right:16,borderTop:`2px solid ${C.cyan}`,borderRight:`2px solid ${C.cyan}`},
          {bottom:16,left:16,borderBottom:`2px solid ${C.cyan}`,borderLeft:`2px solid ${C.cyan}`},
          {bottom:16,right:16,borderBottom:`2px solid ${C.cyan}`,borderRight:`2px solid ${C.cyan}`},
        ].map((s,i) => (
          <div key={i} style={{ position:"absolute", width:32, height:32, ...s }} />
        ))}

        {/* ── PHASE 0: BOOT TERMINAL ── */}
        {phase === 0 && (
          <div style={{ width:640, animation:"fadeIn 0.3s ease" }}>
          {/* header */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <WSLogo size={36} />
          <div>
          <Glow color={C.cyan} size={15} weight={900}>WEHTTAMSNAPS</Glow>
          <div style={{ fontSize:9, color:C.muted, fontFamily:"monospace",
            letterSpacing:"0.2em", marginTop:1 }}>ARCH LINUX — NIRI COMPOSITOR</div>
            </div>
            </div>

            {/* terminal */}
            <div ref={termRef} style={{
              height:280, overflowY:"auto",
              background:"#030008", border:`1px solid ${C.border}`,
              borderRadius:3, padding:"12px 14px",
              fontFamily:"'Share Tech Mono',monospace", fontSize:11,
            }}>
            {visibleLines.map((l,i) => (
              <div key={i} style={{ color:l.color, marginBottom:4, lineHeight:1.6,
                animation:"fadeIn 0.15s ease" }}>
                <span style={{ color:C.muted, marginRight:8 }}>
                [{String(i).padStart(2,"0")}]
                </span>
                {l.text}
                </div>
            ))}
            <span style={{ color:C.cyan, animation:"pulse 0.8s infinite" }}>▌</span>
            </div>

            {/* progress bar */}
            <div style={{ marginTop:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              fontSize:9, color:C.muted, fontFamily:"monospace", marginBottom:4 }}>
              <span>SYSTEM INITIALIZATION</span>
              <span>{barW}%</span>
              </div>
              <div style={{ height:3, background:C.border, borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${barW}%`,
              background:`linear-gradient(90deg,${C.purple},${C.cyan})`,
                         boxShadow:`0 0 8px ${C.cyan}`,
                         transition:"width 0.1s linear",
              }} />
              </div>
              </div>
              </div>
        )}

        {/* ── PHASE 1: LOGO REVEAL ── */}
        {phase === 1 && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:24,
            animation:"fadeIn 0.3s ease" }}>
            <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <RadarSweep active={radarOn} color={C.cyan} size={220} />
            <div style={{ position:"absolute" }}>
            <WSLogo size={80} glow={logoGlow} />
            </div>
            </div>
            <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:32, fontWeight:900,
              background:`linear-gradient(90deg,${C.purple},${C.blue},${C.cyan})`,
                         WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                         letterSpacing:"0.2em",
            }}>WEHTTAMSNAPS</div>
            <Glow color={C.muted} size={10} style={{ letterSpacing:"0.3em" }}>
            SYSTEMS ONLINE
            </Glow>
            </div>
            </div>
        )}

        {/* ── PHASE 2: DASHBOARD ── */}
        {phase === 2 && (
          <div style={{ width:"min(960px,95vw)", animation:"fadeIn 0.4s ease" }}>

          {/* ── TOP ROW: logo + greeting + time ── */}
          <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:20 }}>
          <WSLogo size={56} glow />

          <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:28, fontWeight:900,
            background:`linear-gradient(90deg,${C.purple},${C.blue},${C.cyan})`,
                         WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                         letterSpacing:"0.15em", lineHeight:1,
          }}>WEHTTAMSNAPS</div>
          <Glow color={C.cyan} size={12} style={{ letterSpacing:"0.2em" }}>
          WELCOME BACK, MATTHEW
          </Glow>
          </div>

          {/* TIME BLOCK */}
          <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:40,
            fontWeight:700, color:C.cyan,
            textShadow:`0 0 20px ${C.cyan}80, 0 0 60px ${C.cyan}30`,
            lineHeight:1,
          }}>
          {time.toLocaleTimeString("en-US",{hour12:false,hour:"2-digit",minute:"2-digit",second:"2-digit"})}
          </div>
          <div style={{ fontFamily:"monospace", fontSize:11, color:C.muted, marginTop:3 }}>
          {dayNames[time.getDay()].toUpperCase()} &nbsp;
          {String(time.getDate()).padStart(2,"0")} {monthNames[time.getMonth()]} {time.getFullYear()}
          </div>
          </div>
          </div>

          {/* ── DIVIDER ── */}
          <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.cyan}60,transparent)`,
                         marginBottom:20 }} />

                         {/* ── MAIN GRID ── */}
                         <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>

                         {/* STATS */}
                         <div className="dash-card" style={{ animationDelay:"0s",
                           background:C.card, border:`1px solid ${C.cyan}30`, borderRadius:3, padding:18,
                           boxShadow:`0 0 24px ${C.cyan}10` }}>
                           <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:16 }}>
                           <div style={{ width:3, height:16, background:C.cyan,
                             boxShadow:`0 0 6px ${C.cyan}` }} />
                             <Glow color={C.cyan} size={11}>SYSTEM STATUS</Glow>
                             </div>
                             <div style={{ display:"flex", justifyContent:"space-around" }}>
                             <StatRing value={cpu} label="CPU" color={cpu > 70 ? C.pink : C.cyan} />
                             <StatRing value={ram} label="RAM" color={ram > 80 ? C.pink : C.blue} />
                             </div>
                             <div style={{ marginTop:14, display:"grid", gap:6 }}>
                             {[
                               { label:"UPTIME",   val:"2h 14m",     color:C.cyan  },
                               { label:"DISK",     val:"420 / 1TB",  color:C.blue  },
                               { label:"GPU",      val:"RX 580 OK",  color:C.green || C.cyan },
                               { label:"AUDIO",    val:"PipeWire ✓", color:C.cyan  },
                             ].map(({ label, val, color }) => (
                               <div key={label} style={{ display:"flex", justifyContent:"space-between",
                                 fontSize:10, fontFamily:"monospace",
                                 borderBottom:`1px solid ${C.border}`, paddingBottom:5 }}>
                                 <span style={{ color:C.muted }}>{label}</span>
                                 <span style={{ color }}>{val}</span>
                                 </div>
                             ))}
                             </div>
                             </div>

                             {/* J.A.R.V.I.S. STATUS */}
                             <div className="dash-card" style={{ animationDelay:"0.1s",
                               background:C.card, border:`1px solid ${C.pink}30`, borderRadius:3, padding:18,
                               boxShadow:`0 0 24px ${C.pink}10` }}>
                               <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
                               <div style={{ width:3, height:16, background:C.pink,
                                 boxShadow:`0 0 6px ${C.pink}` }} />
                                 <Glow color={C.pink} size={11}>J.A.R.V.I.S. SYSTEM</Glow>
                                 </div>

                                 {/* Active mode badge */}
                                 <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14,
                                   background:`${C.cyan}10`, border:`1px solid ${C.cyan}30`,
                                   borderRadius:3, padding:"8px 12px" }}>
                                   <div style={{ width:8, height:8, borderRadius:"50%",
                                     background:C.cyan, boxShadow:`0 0 10px ${C.cyan}`,
                                     animation:"pulse 2s infinite",
                                     flexShrink:0 }} />
                                     <div>
                                     <Glow color={C.cyan} size={13}>J.A.R.V.I.S. ACTIVE</Glow>
                                     <div style={{ fontSize:9, color:C.muted, fontFamily:"monospace", marginTop:1 }}>
                                     Paul Bettany · Professional mode
                                     </div>
                                     </div>
                                     </div>

                                     <div style={{ display:"grid", gap:5 }}>
                                     {[
                                       { label:"JARVIS clips",   val:"57 loaded",    dot:C.cyan  },
                                       { label:"iDroid clips",   val:"8 loaded",     dot:C.pink  },
                                       { label:"Sound path",     val:"/usr/share/…", dot:C.blue  },
                                       { label:"Gaming mode",    val:"OFF",          dot:C.muted },
                                       { label:"Auto-detect",    val:"ENABLED",      dot:C.cyan  },
                                     ].map(({ label, val, dot }) => (
                                       <div key={label} style={{ display:"flex", alignItems:"center",
                                         justifyContent:"space-between", fontSize:10, fontFamily:"monospace",
                                         borderBottom:`1px solid ${C.border}`, paddingBottom:5 }}>
                                         <span style={{ display:"flex", alignItems:"center", gap:6, color:C.muted }}>
                                         <span style={{ width:5, height:5, borderRadius:"50%",
                                           background:dot, display:"inline-block",
                                           boxShadow:`0 0 4px ${dot}` }} />
                                           {label}
                                           </span>
                                           <span style={{ color:dot === C.muted ? C.muted : C.text }}>{val}</span>
                                           </div>
                                     ))}
                                     </div>
                                     </div>

                                     {/* LINKS */}
                                     <div className="dash-card" style={{ animationDelay:"0.2s",
                                       background:C.card, border:`1px solid ${C.blue}30`, borderRadius:3, padding:18,
                                       boxShadow:`0 0 24px ${C.blue}10` }}>
                                       <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
                                       <div style={{ width:3, height:16, background:C.blue,
                                         boxShadow:`0 0 6px ${C.blue}` }} />
                                         <Glow color={C.blue} size={11}>CHANNELS</Glow>
                                         </div>
                                         <div style={{ display:"grid", gap:8 }}>
                                         <LinkButton icon="📺" label="YouTube"
                                         sub="@WehttamSnaps · Videos"
                                         color={C.pink}
                                         href="https://www.youtube.com/@WehttamSnaps" />
                                         <LinkButton icon="🟣" label="Twitch"
                                         sub="twitch.tv/WehttamSnaps · Live"
                                         color={C.purple}
                                         href="https://twitch.tv/WehttamSnaps" />
                                         <LinkButton icon="🐙" label="GitHub"
                                         sub="github.com/Crowdrocker"
                                         color={C.blue}
                                         href="https://github.com/Crowdrocker" />
                                         </div>

                                         {/* Quick tips */}
                                         <div style={{ marginTop:14, background:"#060012",
                                           border:`1px solid ${C.border}`, borderRadius:2, padding:"8px 10px" }}>
                                           <Glow color={C.muted} size={9} style={{ letterSpacing:"0.15em" }}>QUICK TIP</Glow>
                                           {[
                                             "Mod+H → Keybinds cheat sheet",
                                             "Mod+G → Toggle gaming mode",
                                             "Mod+Space → App launcher",
                                           ].map((tip,i) => (
                                             <div key={i} style={{ fontSize:10, color:C.muted,
                                               fontFamily:"monospace", marginTop:5, lineHeight:1.5 }}>
                                               <span style={{ color:C.cyan }}>›</span> {tip}
                                               </div>
                                           ))}
                                           </div>
                                           </div>
                                           </div>

                                           {/* ── BOTTOM BAR ── */}
                                           <div style={{ marginTop:16, display:"flex", justifyContent:"space-between",
                                             alignItems:"center", fontSize:9, color:C.muted,
                                             fontFamily:"monospace", letterSpacing:"0.1em",
                                             borderTop:`1px solid ${C.border}`, paddingTop:10 }}>
                                             <span>ARCH LINUX · NIRI · PIPEWIRE · RX 580 · i7-4790</span>
                                             <span style={{ color:C.cyan, animation:"pulse 3s infinite" }}>
                                             ● SYSTEM ONLINE
                                             </span>
                                             <span>WehttamSnaps · Photography · Gaming · Content</span>
                                             </div>

                                             {/* Dismiss hint */}
                                             <div style={{ textAlign:"center", marginTop:10 }}>
                                             <span style={{ fontSize:9, color:C.muted, fontFamily:"monospace",
                                               letterSpacing:"0.15em", animation:"pulse 2.5s infinite" }}>
                                               PRESS ANY KEY OR CLICK TO DISMISS
                                               </span>
                                               </div>
                                               </div>
        )}
        </div>
        </>
  );
}
