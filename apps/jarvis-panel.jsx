import { useState, useEffect, useRef } from "react";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  bg:       "#04000e",
  panel:    "#07001a",
  card:     "#0a0020",
  cyan:     "#00ffd1",
  pink:     "#ff5af1",
  blue:     "#3b82ff",
  gold:     "#ffd700",
  orange:   "#ff6a00",
  green:    "#00ff88",
  red:      "#ff2255",
  text:     "#c8d4e8",
  muted:    "#3a4055",
  border:   "#150030",
  borderHi: "#2a0050",
};

// ── ALL SOUNDS from your actual file listing ─────────────────────────────────
const JARVIS_SOUNDS = [
  // Startup / shutdown
  { id:"startup",            label:"Startup",             cat:"system",  phrase:"Allow me to introduce myself..." },
  { id:"shutdown",           label:"Shutdown",            cat:"system",  phrase:"Shutting down. Have a good day, Matthew." },
  { id:"morning",            label:"Good Morning",        cat:"system",  phrase:"Good morning, sir." },
  { id:"afternoon",          label:"Good Afternoon",      cat:"system",  phrase:"Good afternoon." },
  { id:"evening",            label:"Good Evening",        cat:"system",  phrase:"Good evening, sir." },
  // Notifications
  { id:"notification",       label:"Notification",        cat:"alerts",  phrase:"Sir, you have a notification." },
  { id:"jarvis-notification",label:"JARVIS Notif",        cat:"alerts",  phrase:"Attention required." },
  { id:"warning",            label:"Warning",             cat:"alerts",  phrase:"Warning detected." },
  { id:"jarvis-warning",     label:"JARVIS Warning",      cat:"alerts",  phrase:"I must caution you, sir." },
  { id:"error",              label:"Error",               cat:"alerts",  phrase:"An error has occurred." },
  // Audio
  { id:"audio-mute",         label:"Mute",                cat:"audio",   phrase:"Audio muted, sir." },
  { id:"audio-unmute",       label:"Unmute",              cat:"audio",   phrase:"Audio restored." },
  { id:"volume-up",          label:"Volume Up",           cat:"audio",   phrase:"Volume increased." },
  { id:"volume-down",        label:"Volume Down",         cat:"audio",   phrase:"Volume decreased." },
  { id:"music-play",         label:"Play Music",          cat:"audio",   phrase:"Playing music." },
  { id:"music-pause",        label:"Pause Music",         cat:"audio",   phrase:"Pausing music." },
  { id:"music-next",         label:"Next Track",          cat:"audio",   phrase:"Next track." },
  { id:"music-previous",     label:"Previous Track",      cat:"audio",   phrase:"Previous track." },
  // Apps
  { id:"launching-firefox",  label:"Firefox",             cat:"apps",    phrase:"Launching Firefox, sir." },
  { id:"launching-chrome",   label:"Chrome",              cat:"apps",    phrase:"Launching Chrome." },
  { id:"launching-discord",  label:"Discord",             cat:"apps",    phrase:"Opening Discord." },
  { id:"launching-spotify",  label:"Spotify",             cat:"apps",    phrase:"Opening Spotify." },
  { id:"launching-editor",   label:"VS Code",             cat:"apps",    phrase:"Opening VS Code." },
  { id:"launching-gimp",     label:"GIMP",                cat:"apps",    phrase:"Launching GIMP." },
  { id:"launching-obs",      label:"OBS Studio",          cat:"apps",    phrase:"Launching OBS Studio." },
  { id:"opening-terminal",   label:"Terminal",            cat:"apps",    phrase:"Opening terminal." },
  { id:"opening-files",      label:"File Manager",        cat:"apps",    phrase:"Opening file manager." },
  { id:"app-not-found",      label:"App Not Found",       cat:"apps",    phrase:"Application not recognized, sir." },
  // Windows / workspaces
  { id:"closing-window",     label:"Close Window",        cat:"windows", phrase:"Closing window." },
  { id:"window-fullscreen",  label:"Fullscreen",          cat:"windows", phrase:"Fullscreen mode." },
  { id:"window-tile",        label:"Tile",                cat:"windows", phrase:"Tiling window." },
  { id:"window-float",       label:"Float",               cat:"windows", phrase:"Setting window to float." },
  { id:"window-center",      label:"Center",              cat:"windows", phrase:"Centering window." },
  { id:"workspace-switch",   label:"Workspace Switch",    cat:"windows", phrase:"Workspace changed." },
  { id:"workspace-next",     label:"Workspace Next",      cat:"windows", phrase:"Moving to next workspace." },
  { id:"workspace-previous", label:"Workspace Prev",      cat:"windows", phrase:"Moving to previous workspace." },
  // System actions
  { id:"screenshot",         label:"Screenshot",          cat:"system",  phrase:"Screenshot captured." },
  { id:"jarvis-screen-capture",label:"Screen Capture",    cat:"system",  phrase:"Screen capture initiated." },
  { id:"locking-screen",     label:"Lock Screen",         cat:"system",  phrase:"Locking screen, sir." },
  { id:"reloading-config",   label:"Reload Config",       cat:"system",  phrase:"Reloading configuration." },
  { id:"status-report",      label:"Status Report",       cat:"system",  phrase:"Generating status report, sir." },
  { id:"jarvis-update",      label:"System Update",       cat:"system",  phrase:"Running system update." },
  // JARVIS states
  { id:"greeting",           label:"Greeting",            cat:"jarvis",  phrase:"Hello, sir. How may I assist you?" },
  { id:"you-welcome",        label:"You're Welcome",      cat:"jarvis",  phrase:"My pleasure, sir." },
  { id:"listening",          label:"Listening",           cat:"jarvis",  phrase:"I'm listening, sir." },
  { id:"command-unknown",    label:"Unknown Command",     cat:"jarvis",  phrase:"I'm sorry sir, I don't understand." },
  { id:"jarvis-confirm",     label:"Confirm",             cat:"jarvis",  phrase:"Understood, sir." },
  { id:"photo-mode",         label:"Photo Mode",          cat:"jarvis",  phrase:"Entering photography mode." },
  { id:"photo-export",       label:"Photo Export",        cat:"jarvis",  phrase:"Export complete, sir." },
  { id:"streaming",          label:"Streaming",           cat:"jarvis",  phrase:"Streaming mode activated." },
  { id:"jarvis-streaming",   label:"JARVIS Streaming",    cat:"jarvis",  phrase:"Going live, sir." },
  { id:"jarvis-work",        label:"Work Mode",           cat:"jarvis",  phrase:"Switching to work mode." },
  { id:"gaming",             label:"Gaming",              cat:"jarvis",  phrase:"Gaming mode." },
  { id:"jarvis-gaming",      label:"JARVIS Gaming",       cat:"jarvis",  phrase:"Preparing for combat, sir." },
];

const IDROID_SOUNDS = [
  { id:"gamemode-on",       label:"Gamemode ON",       phrase:"Combat systems online." },
  { id:"gamemode-off",      label:"Gamemode OFF",      phrase:"Returning to normal operations." },
  { id:"steam-launch",      label:"Steam Launch",      phrase:"Game launching." },
  { id:"mission-start",     label:"Mission Start",     phrase:"Mission start." },
  { id:"alert-high",        label:"Alert High",        phrase:"Alert! High priority." },
  { id:"alert-medium",      label:"Alert Medium",      phrase:"Caution." },
  { id:"discord-notify",    label:"Discord Notify",    phrase:"Incoming transmission." },
  { id:"performance-warn",  label:"Perf Warning",      phrase:"System performance critical." },
];

const CATS = ["all","system","alerts","audio","apps","windows","jarvis"];
const CAT_COLORS = { system:C.cyan, alerts:C.red, audio:C.blue, apps:C.green, windows:C.gold, jarvis:C.pink, all:C.text };

const WORKSPACE_MODES = {
  1:  { name:"Browser",       mode:"jarvis",  icon:"🌐" },
  2:  { name:"Terminal/Dev",  mode:"jarvis",  icon:"💻" },
  3:  { name:"Gaming",        mode:"idroid",  icon:"🎮" },
  4:  { name:"Streaming/OBS", mode:"idroid",  icon:"📡" },
  5:  { name:"Photography",   mode:"jarvis",  icon:"📸" },
  6:  { name:"Media/Video",   mode:"idroid",  icon:"🎬" },
  7:  { name:"Communication", mode:"jarvis",  icon:"💬" },
  8:  { name:"Music/Audio",   mode:"jarvis",  icon:"🎵" },
  9:  { name:"Files",         mode:"jarvis",  icon:"📁" },
  10: { name:"Misc",          mode:"jarvis",  icon:"⚙️"  },
};

// ── REUSABLE COMPONENTS ───────────────────────────────────────────────────────

function Scanlines() {
  return <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999,
    background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)" }} />;
}

function Glow({ children, color=C.cyan, size=13, weight=700, mono=true, style={} }) {
  return <span style={{ color, fontSize:size, fontWeight:weight,
    fontFamily: mono ? "'Share Tech Mono',monospace" : "'Rajdhani',sans-serif",
    textShadow:`0 0 8px ${color}90,0 0 24px ${color}40`, letterSpacing:"0.05em", ...style }}>{children}</span>;
}

function Toggle({ on, onChange, color=C.cyan, size=44 }) {
  return (
    <div onClick={() => onChange(!on)} style={{ width:size, height:size*0.48, borderRadius:size*0.24,
      cursor:"pointer", background: on ? `${color}25` : "#100025",
      border:`1px solid ${on ? color : C.muted}`,
      position:"relative", transition:"all 0.25s",
      boxShadow: on ? `0 0 12px ${color}60,inset 0 0 8px ${color}15` : "none",
    }}>
      <div style={{ width:size*0.38, height:size*0.38, borderRadius:"50%",
        background: on ? color : C.muted,
        position:"absolute", top:"50%", transform:"translateY(-50%)",
        left: on ? `calc(100% - ${size*0.44}px)` : size*0.04,
        transition:"all 0.25s",
        boxShadow: on ? `0 0 10px ${color}` : "none",
      }} />
    </div>
  );
}

function Card({ children, style={}, glow, onClick }) {
  return (
    <div onClick={onClick} style={{ background:C.card, borderRadius:3,
      border:`1px solid ${glow ? glow+"35" : C.border}`,
      boxShadow: glow ? `0 0 24px ${glow}12,inset 0 0 24px ${glow}05` : "none",
      transition:"all 0.2s", cursor: onClick ? "pointer" : "default",
      ...style }}>
      {children}
    </div>
  );
}

function SecHead({ children, color=C.cyan, action }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
      <div style={{ width:3, height:18, background:color, borderRadius:2,
        boxShadow:`0 0 8px ${color}` }} />
      <Glow color={color} size={11}>{children}</Glow>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${color}40,transparent)` }} />
      {action}
    </div>
  );
}

// ── VISUALIZER (fake waveform) ────────────────────────────────────────────────
function Waveform({ active, color=C.cyan }) {
  const bars = 32;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:2, height:40 }}>
      {Array.from({length:bars}).map((_,i) => {
        const h = active ? 4 + Math.random()*36 : 4;
        return (
          <div key={i} style={{
            width:3, height: active ? undefined : 4,
            minHeight:4, maxHeight:40,
            background:`linear-gradient(0deg,${color},${color}60)`,
            boxShadow: active ? `0 0 4px ${color}` : "none",
            borderRadius:1, flex:"none",
            animation: active ? `wave${(i%4)} ${0.4+Math.random()*0.6}s ease-in-out infinite alternate` : "none",
          }} />
        );
      })}
    </div>
  );
}

// ── RADAR ANIMATION (for active mode indicator) ───────────────────────────────
function RadarRing({ color, delay=0 }) {
  return (
    <div style={{
      position:"absolute", inset:0, borderRadius:"50%",
      border:`1px solid ${color}`,
      animation:`radarPulse 2s ${delay}s ease-out infinite`,
    }} />
  );
}

// ── SOUND BUTTON ─────────────────────────────────────────────────────────────
function SoundButton({ sound, isPlaying, onPlay }) {
  const catColor = CAT_COLORS[sound.cat] || C.cyan;
  return (
    <div onClick={() => onPlay(sound.id)} style={{
      background: isPlaying ? `${catColor}18` : "#07001a",
      border:`1px solid ${isPlaying ? catColor : C.border}`,
      borderRadius:3, padding:"8px 10px", cursor:"pointer",
      boxShadow: isPlaying ? `0 0 16px ${catColor}40` : "none",
      transition:"all 0.15s",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
        <div style={{ width:6, height:6, borderRadius:"50%",
          background: isPlaying ? catColor : C.muted,
          boxShadow: isPlaying ? `0 0 8px ${catColor}` : "none",
          transition:"all 0.15s", flexShrink:0,
        }} />
        <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11,
          color: isPlaying ? catColor : C.text, fontWeight:700,
          textShadow: isPlaying ? `0 0 8px ${catColor}` : "none",
          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
        }}>{sound.label}</span>
      </div>
      <div style={{ fontSize:9, color:C.muted, fontFamily:"monospace",
        paddingLeft:12, lineHeight:1.4,
        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
      }}>"{sound.phrase}"</div>
    </div>
  );
}

// ── LOG LINE ─────────────────────────────────────────────────────────────────
function LogLine({ entry }) {
  const color = entry.mode === "idroid" ? C.orange : C.cyan;
  return (
    <div style={{ display:"flex", gap:10, padding:"4px 0",
      borderBottom:`1px solid ${C.border}`, fontSize:10, fontFamily:"monospace" }}>
      <span style={{ color:C.muted, flexShrink:0 }}>{entry.time}</span>
      <span style={{ color, flexShrink:0, width:50 }}>[{entry.mode.toUpperCase()}]</span>
      <span style={{ color:C.text }}>{entry.text}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function JarvisPanel() {
  const [mode, setMode]           = useState("jarvis");   // "jarvis" | "idroid"
  const [gaming, setGaming]       = useState(false);
  const [workspace, setWorkspace] = useState(1);
  const [playing, setPlaying]     = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [searchQ, setSearchQ]     = useState("");
  const [log, setLog]             = useState([]);
  const [tab, setTab]             = useState("sounds");    // sounds | workspaces | commands | log
  const [vol, setVol]             = useState(75);
  const [muted, setMuted]         = useState(false);
  const [time, setTime]           = useState(new Date());
  const [waveActive, setWaveActive] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-detect mode from workspace
  useEffect(() => {
    const ws = WORKSPACE_MODES[workspace];
    if (!gaming) setMode(ws.mode);
  }, [workspace, gaming]);

  // Gaming toggle overrides
  useEffect(() => {
    if (gaming) {
      setMode("idroid");
      addLog("idroid", "Gaming mode ENABLED — iDroid systems online");
    } else {
      const ws = WORKSPACE_MODES[workspace];
      setMode(ws.mode);
      addLog("jarvis", "Gaming mode DISABLED — J.A.R.V.I.S. resuming control");
    }
  }, [gaming]);

  const addLog = (m, text) => {
    const entry = { time: new Date().toLocaleTimeString(), mode: m, text, id: Date.now() };
    setLog(prev => [entry, ...prev].slice(0, 60));
  };

  const playSound = (id) => {
    setPlaying(id);
    setWaveActive(true);
    const sound = [...JARVIS_SOUNDS, ...IDROID_SOUNDS].find(s => s.id === id);
    if (sound) addLog(mode, `Playing: ${sound.label} — "${sound.phrase}"`);
    setTimeout(() => { setPlaying(null); setWaveActive(false); }, 2200);
  };

  const switchMode = (m) => {
    setMode(m);
    addLog(m, m === "idroid" ? "Manual override — iDroid tactical mode" : "Manual override — J.A.R.V.I.S. engaged");
  };

  const switchWorkspace = (n) => {
    setWorkspace(n);
    const ws = WORKSPACE_MODES[n];
    addLog(ws.mode, `Workspace ${n}: ${ws.name} — switching to ${ws.mode.toUpperCase()}`);
  };

  const modeColor  = mode === "jarvis" ? C.cyan : C.orange;
  const modeLabel  = mode === "jarvis" ? "J.A.R.V.I.S." : "iDROID";

  const filteredSounds = (mode === "jarvis" ? JARVIS_SOUNDS : [...JARVIS_SOUNDS, ...IDROID_SOUNDS])
    .filter(s => catFilter === "all" || s.cat === catFilter)
    .filter(s => !searchQ || s.label.toLowerCase().includes(searchQ.toLowerCase()) || s.phrase.toLowerCase().includes(searchQ.toLowerCase()));

  const TABS_LIST = [
    { id:"sounds",     label:"SOUNDS" },
    { id:"workspaces", label:"WORKSPACES" },
    { id:"commands",   label:"QUICK COMMANDS" },
    { id:"log",        label:"EVENT LOG" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.bg};overflow-x:hidden}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#080018}
        ::-webkit-scrollbar-thumb{background:${C.cyan}50;border-radius:2px}
        @keyframes wave0{0%{height:4px}100%{height:32px}}
        @keyframes wave1{0%{height:8px}100%{height:24px}}
        @keyframes wave2{0%{height:6px}100%{height:36px}}
        @keyframes wave3{0%{height:12px}100%{height:20px}}
        @keyframes radarPulse{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2.2);opacity:0}}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes flicker{0%,100%{opacity:1}93%{opacity:0.96}94%{opacity:0.72}95%{opacity:1}}
        @keyframes breathe{0%,100%{box-shadow:0 0 20px ${C.cyan}40}50%{box-shadow:0 0 40px ${C.cyan}80,0 0 80px ${C.cyan}20}}
        @keyframes breatheOrange{0%,100%{box-shadow:0 0 20px ${C.orange}40}50%{box-shadow:0 0 40px ${C.orange}80,0 0 80px ${C.orange}20}}
        @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .sound-btn:hover{background:${C.cyan}10!important;border-color:${C.cyan}60!important}
        input:focus{outline:none;border-color:${C.cyan}!important}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:${C.cyan};box-shadow:0 0 8px ${C.cyan}}
      `}</style>
      <Scanlines />

      <div style={{ minHeight:"100vh", background:C.bg, animation:"flicker 10s infinite",
        fontFamily:"'Share Tech Mono',monospace", color:C.text }}>

        {/* ── TOP BAR ── */}
        <div style={{ background:C.panel, borderBottom:`1px solid ${modeColor}30`,
          padding:"10px 24px", display:"flex", alignItems:"center", gap:16,
          boxShadow:`0 4px 30px ${modeColor}10`, transition:"all 0.5s" }}>

          {/* Logo */}
          <div style={{ width:36, height:36, flexShrink:0,
            background:`linear-gradient(135deg,#8b00ff,#3b82ff)`,
            borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:900, fontSize:14, color:"white",
            boxShadow:`0 0 12px ${C.blue}` }}>WS</div>

          <div>
            <Glow color={modeColor} size={16} weight={900}>J.A.R.V.I.S. CONTROL PANEL</Glow>
            <div style={{ fontSize:9, color:C.muted, letterSpacing:"0.15em", marginTop:1 }}>
              WEHTTAMSNAPS — ADAPTIVE VOICE SYSTEM
            </div>
          </div>

          <div style={{ flex:1 }} />

          {/* Live waveform */}
          <div style={{ width:80 }}>
            <Waveform active={waveActive} color={modeColor} />
          </div>

          {/* Mode indicator */}
          <div style={{ display:"flex", alignItems:"center", gap:10,
            background:`${modeColor}10`, border:`1px solid ${modeColor}40`,
            borderRadius:3, padding:"6px 14px",
            animation: mode==="jarvis" ? "breathe 3s infinite" : "breatheOrange 3s infinite",
            transition:"all 0.5s" }}>
            <div style={{ position:"relative", width:10, height:10 }}>
              <div style={{ width:10, height:10, borderRadius:"50%",
                background:modeColor, boxShadow:`0 0 8px ${modeColor}` }} />
              <RadarRing color={modeColor} delay={0} />
              <RadarRing color={modeColor} delay={0.7} />
            </div>
            <Glow color={modeColor} size={13}>{modeLabel} ACTIVE</Glow>
          </div>

          <div style={{ fontSize:11, color:C.muted }}>
            {time.toLocaleTimeString()}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"260px 1fr", minHeight:"calc(100vh - 57px)" }}>

          {/* ── LEFT SIDEBAR ── */}
          <div style={{ background:C.panel, borderRight:`1px solid ${C.border}`,
            padding:16, display:"flex", flexDirection:"column", gap:14 }}>

            {/* Mode toggle */}
            <Card glow={modeColor} style={{ padding:16 }}>
              <SecHead color={modeColor}>VOICE MODE</SecHead>

              {/* JARVIS */}
              <div onClick={() => switchMode("jarvis")} style={{
                display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                marginBottom:8, borderRadius:3, cursor:"pointer",
                background: mode==="jarvis" ? `${C.cyan}15` : "transparent",
                border:`1px solid ${mode==="jarvis" ? C.cyan : C.border}`,
                boxShadow: mode==="jarvis" ? `0 0 16px ${C.cyan}30` : "none",
                transition:"all 0.2s",
              }}>
                <div style={{ width:10, height:10, borderRadius:"50%",
                  background: mode==="jarvis" ? C.cyan : C.muted,
                  boxShadow: mode==="jarvis" ? `0 0 8px ${C.cyan}` : "none" }} />
                <div>
                  <Glow color={mode==="jarvis" ? C.cyan : C.muted} size={12}>J.A.R.V.I.S.</Glow>
                  <div style={{ fontSize:9, color:C.muted, fontFamily:"monospace" }}>Paul Bettany · Professional</div>
                </div>
              </div>

              {/* iDroid */}
              <div onClick={() => switchMode("idroid")} style={{
                display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
                borderRadius:3, cursor:"pointer",
                background: mode==="idroid" ? `${C.orange}15` : "transparent",
                border:`1px solid ${mode==="idroid" ? C.orange : C.border}`,
                boxShadow: mode==="idroid" ? `0 0 16px ${C.orange}30` : "none",
                transition:"all 0.2s",
              }}>
                <div style={{ width:10, height:10, borderRadius:"50%",
                  background: mode==="idroid" ? C.orange : C.muted,
                  boxShadow: mode==="idroid" ? `0 0 8px ${C.orange}` : "none" }} />
                <div>
                  <Glow color={mode==="idroid" ? C.orange : C.muted} size={12}>iDROID</Glow>
                  <div style={{ fontSize:9, color:C.muted, fontFamily:"monospace" }}>Tactical · Gaming</div>
                </div>
              </div>
            </Card>

            {/* Gaming mode */}
            <Card glow={gaming ? C.orange : undefined} style={{ padding:14 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <Glow color={gaming ? C.orange : C.muted} size={12}>GAMING MODE</Glow>
                  <div style={{ fontSize:9, color:C.muted, fontFamily:"monospace", marginTop:2 }}>
                    {gaming ? "iDroid · Max Performance" : "Standard operation"}
                  </div>
                </div>
                <Toggle on={gaming} onChange={setGaming} color={C.orange} />
              </div>
            </Card>

            {/* Volume */}
            <Card style={{ padding:14 }}>
              <SecHead color={C.blue}>AUDIO OUTPUT</SecHead>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <Toggle on={!muted} onChange={v => setMuted(!v)} color={C.blue} size={36} />
                <Glow color={muted ? C.muted : C.blue} size={11}>{muted ? "MUTED" : "LIVE"}</Glow>
              </div>
              <div style={{ fontSize:9, color:C.muted, marginBottom:6 }}>VOLUME — {vol}%</div>
              <input type="range" min={0} max={100} value={vol}
                onChange={e => setVol(+e.target.value)}
                style={{ width:"100%", background:`linear-gradient(90deg,${C.blue} ${vol}%,${C.border} ${vol}%)` }} />
            </Card>

            {/* Current workspace */}
            <Card style={{ padding:14 }}>
              <SecHead color={C.gold}>WORKSPACE</SecHead>
              <div style={{ fontSize:22, textAlign:"center", marginBottom:4 }}>
                {WORKSPACE_MODES[workspace].icon}
              </div>
              <div style={{ textAlign:"center" }}>
                <Glow color={C.gold} size={13}>{workspace} — {WORKSPACE_MODES[workspace].name}</Glow>
                <div style={{ fontSize:9, color:C.muted, fontFamily:"monospace", marginTop:2 }}>
                  Auto-mode: {WORKSPACE_MODES[workspace].mode.toUpperCase()}
                </div>
              </div>
            </Card>

            {/* Stats */}
            <Card style={{ padding:14, marginTop:"auto" }}>
              <SecHead color={C.muted}>SESSION</SecHead>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[
                  ["SOUNDS LOADED", JARVIS_SOUNDS.length + IDROID_SOUNDS.length],
                  ["JARVIS CLIPS", JARVIS_SOUNDS.length],
                  ["iDROID CLIPS", IDROID_SOUNDS.length],
                  ["LOG ENTRIES", log.length],
                ].map(([l,v]) => (
                  <div key={l} style={{ background:"#070015", border:`1px solid ${C.border}`,
                    borderRadius:2, padding:"6px 8px" }}>
                    <div style={{ fontSize:8, color:C.muted, marginBottom:2 }}>{l}</div>
                    <Glow color={C.cyan} size={16}>{v}</Glow>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div style={{ display:"flex", flexDirection:"column" }}>

            {/* Tab bar */}
            <div style={{ background:C.panel, borderBottom:`1px solid ${C.border}`,
              padding:"0 20px", display:"flex", gap:0 }}>
              {TABS_LIST.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding:"10px 18px", background:"none", border:"none",
                  borderBottom:`2px solid ${tab===t.id ? modeColor : "transparent"}`,
                  color: tab===t.id ? modeColor : C.muted,
                  fontFamily:"'Share Tech Mono',monospace", fontSize:11,
                  cursor:"pointer", transition:"all 0.15s",
                  textShadow: tab===t.id ? `0 0 10px ${modeColor}` : "none",
                }}>{t.label}</button>
              ))}
            </div>

            <div style={{ flex:1, padding:20, overflowY:"auto", animation:"slideIn 0.2s ease" }}>

              {/* ══ SOUNDS TAB ══ */}
              {tab==="sounds" && (
                <div>
                  {/* Filter bar */}
                  <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
                    <input placeholder="Search sounds..." value={searchQ}
                      onChange={e => setSearchQ(e.target.value)} style={{
                        background:"#070015", border:`1px solid ${C.borderHi}`,
                        color:C.cyan, padding:"6px 12px", fontFamily:"monospace", fontSize:11,
                        borderRadius:2, width:200,
                      }} />
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {CATS.map(c => (
                        <button key={c} onClick={() => setCatFilter(c)} style={{
                          padding:"4px 10px", background: catFilter===c ? `${CAT_COLORS[c]}20` : "transparent",
                          border:`1px solid ${catFilter===c ? CAT_COLORS[c] : C.border}`,
                          color: catFilter===c ? CAT_COLORS[c] : C.muted,
                          fontFamily:"monospace", fontSize:10, cursor:"pointer", borderRadius:2,
                          textTransform:"uppercase", transition:"all 0.15s",
                        }}>{c}</button>
                      ))}
                    </div>
                    <div style={{ marginLeft:"auto", fontSize:10, color:C.muted }}>
                      {filteredSounds.length} sounds
                    </div>
                  </div>

                  {/* iDroid banner when in idroid mode */}
                  {mode==="idroid" && (
                    <div style={{ background:`${C.orange}10`, border:`1px solid ${C.orange}40`,
                      borderRadius:3, padding:"8px 14px", marginBottom:14,
                      display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%",
                        background:C.orange, boxShadow:`0 0 8px ${C.orange}`,
                        animation:"radarPulse 1.5s ease-out infinite" }} />
                      <Glow color={C.orange} size={11}>iDROID MODE — Tactical sounds active. JARVIS library also available.</Glow>
                    </div>
                  )}

                  {/* iDroid sounds section */}
                  {mode==="idroid" && (catFilter==="all") && (
                    <div style={{ marginBottom:20 }}>
                      <SecHead color={C.orange}>iDROID EXCLUSIVE</SecHead>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
                        {IDROID_SOUNDS.map(s => (
                          <SoundButton key={s.id} sound={{...s, cat:"idroid"}}
                            isPlaying={playing===s.id} onPlay={playSound} />
                        ))}
                      </div>
                      <div style={{ height:1, background:`linear-gradient(90deg,${C.orange}40,transparent)`,
                        margin:"16px 0" }} />
                    </div>
                  )}

                  <div>
                    {catFilter==="all" && <SecHead color={C.cyan}>J.A.R.V.I.S. LIBRARY ({filteredSounds.length})</SecHead>}
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
                      {filteredSounds.map(s => (
                        <SoundButton key={s.id} sound={s}
                          isPlaying={playing===s.id} onPlay={playSound} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ WORKSPACES TAB ══ */}
              {tab==="workspaces" && (
                <div>
                  <SecHead color={C.gold}>WORKSPACE AUTO-MODE MAPPING</SecHead>
                  <p style={{ fontSize:10, color:C.muted, marginBottom:16, lineHeight:1.6 }}>
                    Click a workspace to switch. Voice mode auto-detects based on workspace context.
                    Gaming mode override takes priority.
                  </p>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10 }}>
                    {Object.entries(WORKSPACE_MODES).map(([n, ws]) => {
                      const isActive = +n === workspace;
                      const wColor = ws.mode==="jarvis" ? C.cyan : C.orange;
                      return (
                        <Card key={n} onClick={() => switchWorkspace(+n)}
                          glow={isActive ? wColor : undefined}
                          style={{ padding:14, cursor:"pointer",
                            background: isActive ? `${wColor}10` : C.card }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ fontSize:24 }}>{ws.icon}</div>
                            <div>
                              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <Glow color={isActive ? wColor : C.text} size={13}>
                                  {n} — {ws.name}
                                </Glow>
                              </div>
                              <div style={{ marginTop:3, display:"flex", gap:6 }}>
                                <span style={{ fontSize:9, color:wColor,
                                  border:`1px solid ${wColor}50`, padding:"1px 5px",
                                  fontFamily:"monospace", fontWeight:700 }}>
                                  {ws.mode.toUpperCase()}
                                </span>
                                {isActive && <span style={{ fontSize:9, color:C.gold,
                                  border:`1px solid ${C.gold}50`, padding:"1px 5px",
                                  fontFamily:"monospace" }}>ACTIVE</span>}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ══ QUICK COMMANDS TAB ══ */}
              {tab==="commands" && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {[
                    { label:"APPLICATIONS", color:C.green, cmds:[
                      ["open firefox","Launch Firefox"],["launch steam","Launch Steam"],
                      ["start spotify","Open Spotify"],["open discord","Open Discord"],
                      ["run terminal","Open Terminal"],["open files","File Manager"],
                    ]},
                    { label:"WINDOW CONTROL", color:C.gold, cmds:[
                      ["close window","Close focused window"],["maximize","Maximize window"],
                      ["fullscreen","True fullscreen"],["tile window","Tile window"],
                      ["float window","Float window"],["center window","Center window"],
                    ]},
                    { label:"SYSTEM", color:C.cyan, cmds:[
                      ["screenshot","Capture screen"],["lock","Lock screen"],
                      ["reload","Reload Niri config"],["status","System status report"],
                      ["gaming mode","Toggle gaming mode"],["photography","Photo workflow"],
                    ]},
                    { label:"AUDIO", color:C.blue, cmds:[
                      ["mute","Toggle mute"],["volume up","Increase volume"],
                      ["volume down","Decrease volume"],["play music","Play media"],
                      ["pause","Pause media"],["next track","Skip track"],
                    ]},
                  ].map(({ label, color, cmds }) => (
                    <Card key={label} glow={color} style={{ padding:14 }}>
                      <SecHead color={color}>{label}</SecHead>
                      <div style={{ display:"grid", gap:4 }}>
                        {cmds.map(([cmd, desc]) => (
                          <div key={cmd} onClick={() => {
                            addLog(mode, `Command: jarvis ${cmd}`);
                            playSound(cmd.replace(" ","-"));
                          }} style={{
                            display:"flex", alignItems:"center", justifyContent:"space-between",
                            padding:"6px 10px", borderRadius:2, cursor:"pointer",
                            background:"#070015", border:`1px solid ${C.border}`,
                            transition:"all 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor=color+"60"; e.currentTarget.style.background=color+"10"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background="#070015"; }}>
                            <code style={{ fontSize:11, color, fontFamily:"monospace" }}>jarvis {cmd}</code>
                            <span style={{ fontSize:9, color:C.muted }}>{desc}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* ══ LOG TAB ══ */}
              {tab==="log" && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <SecHead color={C.pink}>EVENT LOG — {log.length} ENTRIES</SecHead>
                    <button onClick={() => setLog([])} style={{
                      background:`${C.pink}10`, border:`1px solid ${C.pink}50`,
                      color:C.pink, fontFamily:"monospace", fontSize:10,
                      padding:"4px 12px", cursor:"pointer", borderRadius:2,
                    }}>CLEAR</button>
                  </div>
                  {log.length === 0 && (
                    <div style={{ color:C.muted, fontFamily:"monospace", fontSize:11,
                      textAlign:"center", padding:"40px 0" }}>
                      — No events logged yet. Play a sound or switch modes. —
                    </div>
                  )}
                  <div ref={logRef} style={{ display:"grid", gap:0 }}>
                    {log.map(entry => <LogLine key={entry.id} entry={entry} />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
