import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0010",
  bgCard: "#0d0018",
  bgPanel: "#110020",
  cyan: "#00ffd1",
  pink: "#ff5af1",
  blue: "#3b82ff",
  orange: "#ff6a00",
  yellow: "#ffe600",
  text: "#c8d0e0",
  muted: "#5a6070",
  border: "#1e0a30",
  borderGlow: "#2a0040",
};

const TABS = ["SETUP", "DEPENDENCIES", "FIXES", "NXM LINKS", "SHORTCUT", "FLATPAK", "INSTANCES", "PLUGINS"];

const DEPS = [
  { name: "PROTON-GE", version: "9.26", status: "ok", desc: "GloriousEggroll custom proton" },
  { name: "WINETRICKS", version: "20240105", status: "ok", desc: "Wine helper scripts" },
  { name: "PROTONTRICKS", version: "1.12.0", status: "missing", desc: "Proton winetricks wrapper" },
  { name: "WINE-STAGING", version: "9.4", status: "ok", desc: "Wine with staging patches" },
  { name: "DOTNET48", version: "4.8", status: "warn", desc: "Requires winetricks" },
  { name: "GAMEMODE", version: "1.8.1", status: "ok", desc: "CPU performance mode" },
  { name: "MANGOHUD", version: "0.7.1", status: "ok", desc: "Performance overlay" },
  { name: "VKBASALT", version: "0.3.2", status: "missing", desc: "Vulkan post-processing" },
];

const GAMES = [
  { name: "Cyberpunk 2077", tag: "FIX 5", tags: ["DXVK", "PROTON-GE"], enabled: true },
  { name: "Fallout 4", tag: "FIX 3", tags: ["XNVSE", "ENBFIX"], enabled: true },
  { name: "Skyrim SE", tag: "FIX 7", tags: ["SKSE64", "ENB"], enabled: false },
  { name: "Fallout NV", tag: "FIX 4", tags: ["NVSE", "4GB"], enabled: true },
  { name: "xEdit", tag: "FIX 2", tags: ["MONO", "DOTNET"], enabled: true },
  { name: "Synthesis", tag: "FIX 2", tags: ["DOTNET6"], enabled: false },
  { name: "BG3", tag: "FIX 1", tags: ["VULKAN"], enabled: true },
  { name: "Elden Ring", tag: "FIX 3", tags: ["ANTICHEAT", "DXVK"], enabled: false },
];

const INSTANCES = [
  { path: "/home/wehttamsnaps/.local/share/ModOrganizer", game: "Cyberpunk 2077" },
  { path: "/run/media/wehttamsnaps/LINUXDRIVE/Modlist_Packs/MO2_Fallout4", game: "Fallout 4" },
  { path: "/home/user/Mod Organizer 2 Portable", game: "Portable Instance" },
];

const PLUGINS = [
  { name: "libgame_cyberpunk.so", version: "2.1.0", status: "ok" },
  { name: "libgame_fallout4.so", version: "1.0.3", status: "ok" },
  { name: "libgame_skyrimse.so", version: "1.2.0", status: "warn" },
  { name: "libgame_witcher3.so", version: "0.9.1", status: "missing" },
];

const TERMINAL_LINES = [
  { text: "[ MO2 LINUX HELPER ] Initializing system scan...", color: COLORS.cyan },
  { text: "[ OK ] Steam detected at /home/wehttamsnaps/.steam", color: COLORS.cyan },
  { text: "[ OK ] Proton-GE 9.26 found", color: COLORS.cyan },
  { text: "[ WARN ] protontricks not installed", color: COLORS.yellow },
  { text: "[ OK ] SteamLibrary: /run/media/wehttamsnaps/LINUXDRIVE/SteamLibrary", color: COLORS.cyan },
  { text: "[ OK ] MO2 instance detected: Cyberpunk 2077", color: COLORS.cyan },
  { text: "[ INFO ] Modlist_Packs: 3 profiles found", color: COLORS.blue },
  { text: "[ SCAN COMPLETE ] 1 missing dependency, 1 warning", color: COLORS.pink },
];

function ScanlineOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
    }} />
  );
}

function GlowText({ children, color = COLORS.cyan, size = 14, weight = 700, style = {} }) {
  return (
    <span style={{
      color, fontSize: size, fontWeight: weight, fontFamily: "'Share Tech Mono', monospace",
      textShadow: `0 0 8px ${color}80, 0 0 20px ${color}40`,
      letterSpacing: "0.05em", ...style
    }}>
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = { ok: [COLORS.cyan, "OK"], warn: [COLORS.yellow, "WARN"], missing: [COLORS.pink, "MISSING"] };
  const [color, label] = map[status] || [COLORS.muted, status.toUpperCase()];
  return (
    <span style={{
      color, border: `1px solid ${color}60`, borderRadius: 2, padding: "1px 6px",
      fontSize: 10, fontFamily: "'Share Tech Mono', monospace", fontWeight: 700,
      textShadow: `0 0 6px ${color}`, boxShadow: `inset 0 0 6px ${color}20`,
    }}>{label}</span>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <div onClick={() => onChange(!enabled)} style={{
      width: 40, height: 20, borderRadius: 10, cursor: "pointer",
      background: enabled ? `${COLORS.cyan}30` : "#1a0030",
      border: `1px solid ${enabled ? COLORS.cyan : COLORS.muted}`,
      position: "relative", transition: "all 0.2s",
      boxShadow: enabled ? `0 0 8px ${COLORS.cyan}60` : "none",
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: "50%",
        background: enabled ? COLORS.cyan : COLORS.muted,
        position: "absolute", top: 2,
        left: enabled ? 22 : 2, transition: "all 0.2s",
        boxShadow: enabled ? `0 0 8px ${COLORS.cyan}` : "none",
      }} />
    </div>
  );
}

function Card({ children, style = {}, glow }) {
  return (
    <div style={{
      background: COLORS.bgCard,
      border: `1px solid ${glow ? glow + "40" : COLORS.border}`,
      borderRadius: 4, padding: 16,
      boxShadow: glow ? `0 0 20px ${glow}15, inset 0 0 20px ${glow}05` : "none",
      ...style
    }}>
      {children}
    </div>
  );
}

function SectionHeader({ children, color = COLORS.cyan }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ width: 3, height: 16, background: color, boxShadow: `0 0 8px ${color}` }} />
      <GlowText color={color} size={12}>{children}</GlowText>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}40, transparent)` }} />
    </div>
  );
}

function SetupTab() {
  const [progress, setProgress] = useState(0);
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(false);
  const [installPath, setInstallPath] = useState("/opt/mo2");
  const [dryRun, setDryRun] = useState(false);
  const termRef = useRef(null);

  const runSetup = () => {
    if (running) return;
    setRunning(true);
    setLines([]);
    setProgress(0);
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        setProgress(Math.round(((i + 1) / TERMINAL_LINES.length) * 100));
        if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
        if (i === TERMINAL_LINES.length - 1) setRunning(false);
      }, i * 400);
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card glow={COLORS.cyan}>
        <SectionHeader>SETUP WIZARD</SectionHeader>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: COLORS.muted, fontFamily: "monospace", marginBottom: 6 }}>INSTALL PATH</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={installPath} onChange={e => setInstallPath(e.target.value)} style={{
              flex: 1, background: "#0a001a", border: `1px solid ${COLORS.borderGlow}`,
              color: COLORS.cyan, padding: "6px 10px", fontFamily: "monospace", fontSize: 12,
              borderRadius: 2, outline: "none",
            }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <Toggle enabled={dryRun} onChange={setDryRun} />
          <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: "monospace" }}>DRY RUN MODE</span>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: COLORS.muted, fontFamily: "monospace", marginBottom: 6 }}>
            PROGRESS — {progress}%
          </div>
          <div style={{ height: 8, background: "#1a0030", borderRadius: 2, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
            <div style={{
              height: "100%", width: `${progress}%`, transition: "width 0.4s",
              background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.blue})`,
              boxShadow: `0 0 10px ${COLORS.cyan}`,
            }} />
          </div>
        </div>
        <button onClick={runSetup} disabled={running} style={{
          width: "100%", padding: "8px 0", background: running ? "#1a0030" : `${COLORS.cyan}15`,
          border: `1px solid ${running ? COLORS.muted : COLORS.cyan}`, borderRadius: 2, cursor: running ? "not-allowed" : "pointer",
          color: running ? COLORS.muted : COLORS.cyan, fontFamily: "monospace", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.1em", boxShadow: running ? "none" : `0 0 12px ${COLORS.cyan}30`,
          transition: "all 0.2s",
        }}>
          {running ? "[ RUNNING... ]" : "[ INITIALIZE SETUP ]"}
        </button>
      </Card>

      <Card glow={COLORS.blue}>
        <SectionHeader color={COLORS.blue}>TERMINAL OUTPUT</SectionHeader>
        <div ref={termRef} style={{
          height: 220, overflowY: "auto", background: "#050010",
          border: `1px solid ${COLORS.border}`, borderRadius: 2, padding: 10,
          fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
        }}>
          {lines.length === 0 && (
            <div style={{ color: COLORS.muted }}>_ awaiting initialization...</div>
          )}
          {lines.map((l, i) => (
            <div key={i} style={{ color: l.color, marginBottom: 3, lineHeight: 1.5 }}>{l.text}</div>
          ))}
          {running && <div style={{ color: COLORS.cyan, animation: "blink 1s infinite" }}>▌</div>}
        </div>
      </Card>

      <Card style={{ gridColumn: "1 / -1" }} glow={COLORS.orange}>
        <SectionHeader color={COLORS.orange}>STEAM LIBRARY PATHS</SectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "STEAM LIBRARY", path: "/run/media/wehttamsnaps/LINUXDRIVE/SteamLibrary" },
            { label: "MODLIST PACKS", path: "/run/media/wehttamsnaps/LINUXDRIVE/Modlist_Packs" },
            { label: "MOD DOWNLOADS", path: "/run/media/wehttamsnaps/LINUXDRIVE/Modlist_Downloads" },
          ].map(({ label, path }) => (
            <div key={label} style={{ background: "#080014", border: `1px solid ${COLORS.border}`, borderRadius: 2, padding: 10 }}>
              <div style={{ fontSize: 9, color: COLORS.orange, fontFamily: "monospace", marginBottom: 4, fontWeight: 700 }}>{label}</div>
              <div style={{ fontSize: 10, color: COLORS.text, fontFamily: "monospace", wordBreak: "break-all" }}>{path}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DepsTab() {
  const [deps, setDeps] = useState(DEPS);
  const [installing, setInstalling] = useState(null);

  const install = (name) => {
    setInstalling(name);
    setTimeout(() => {
      setDeps(prev => prev.map(d => d.name === name ? { ...d, status: "ok" } : d));
      setInstalling(null);
    }, 1800);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {deps.map(dep => (
        <Card key={dep.name} glow={dep.status === "ok" ? COLORS.cyan : dep.status === "warn" ? COLORS.yellow : COLORS.pink}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <GlowText color={dep.status === "missing" ? COLORS.pink : COLORS.cyan} size={13}>{dep.name}</GlowText>
                <StatusBadge status={dep.status} />
              </div>
              <div style={{ fontSize: 10, color: COLORS.muted, fontFamily: "monospace" }}>{dep.desc}</div>
              <div style={{ fontSize: 10, color: COLORS.blue, fontFamily: "monospace", marginTop: 4 }}>v{dep.version}</div>
            </div>
            {dep.status !== "ok" && (
              <button onClick={() => install(dep.name)} disabled={installing === dep.name} style={{
                background: `${COLORS.cyan}15`, border: `1px solid ${COLORS.cyan}`,
                color: COLORS.cyan, fontFamily: "monospace", fontSize: 10, padding: "4px 10px",
                cursor: "pointer", borderRadius: 2, whiteSpace: "nowrap",
                opacity: installing === dep.name ? 0.5 : 1,
              }}>
                {installing === dep.name ? "INSTALLING..." : "INSTALL"}
              </button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function FixesTab() {
  const [games, setGames] = useState(GAMES);

  const toggle = (name) => {
    setGames(prev => prev.map(g => g.name === name ? { ...g, enabled: !g.enabled } : g));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
      {games.map(game => (
        <Card key={game.name} glow={game.enabled ? COLORS.cyan : undefined}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Toggle enabled={game.enabled} onChange={() => toggle(game.name)} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GlowText color={game.enabled ? COLORS.cyan : COLORS.muted} size={13}>{game.name}</GlowText>
                <span style={{
                  fontSize: 9, color: COLORS.orange, border: `1px solid ${COLORS.orange}60`,
                  padding: "1px 5px", fontFamily: "monospace", fontWeight: 700,
                }}>{game.tag}</span>
                {game.tags.map(t => (
                  <span key={t} style={{
                    fontSize: 9, color: COLORS.blue, border: `1px solid ${COLORS.blue}40`,
                    padding: "1px 5px", fontFamily: "monospace",
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <button style={{
              background: `${COLORS.orange}15`, border: `1px solid ${COLORS.orange}60`,
              color: COLORS.orange, fontFamily: "monospace", fontSize: 10, padding: "4px 12px",
              cursor: "pointer", borderRadius: 2,
            }}>APPLY FIX</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function NxmTab() {
  const [registered, setRegistered] = useState(false);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card glow={registered ? COLORS.cyan : COLORS.pink}>
        <SectionHeader color={registered ? COLORS.cyan : COLORS.pink}>NXM HANDLER STATUS</SectionHeader>
        <div style={{
          fontSize: 28, fontFamily: "monospace", fontWeight: 700, textAlign: "center",
          color: registered ? COLORS.cyan : COLORS.pink,
          textShadow: `0 0 20px ${registered ? COLORS.cyan : COLORS.pink}`,
          padding: "20px 0", marginBottom: 14,
        }}>
          {registered ? "REGISTERED" : "UNREGISTERED"}
        </div>
        <button onClick={() => setRegistered(!registered)} style={{
          width: "100%", padding: "8px 0",
          background: registered ? `${COLORS.pink}15` : `${COLORS.cyan}15`,
          border: `1px solid ${registered ? COLORS.pink : COLORS.cyan}`, borderRadius: 2,
          cursor: "pointer", color: registered ? COLORS.pink : COLORS.cyan,
          fontFamily: "monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
        }}>
          {registered ? "[ UNREGISTER HANDLER ]" : "[ REGISTER NXM HANDLER ]"}
        </button>
      </Card>
      <Card glow={COLORS.blue}>
        <SectionHeader color={COLORS.blue}>GENERATED HANDLER</SectionHeader>
        <div style={{
          background: "#050010", border: `1px solid ${COLORS.border}`,
          padding: 10, fontFamily: "monospace", fontSize: 10, color: COLORS.text,
          lineHeight: 1.8, borderRadius: 2,
        }}>
          <div style={{ color: COLORS.muted }}>[Desktop Entry]</div>
          <div><span style={{ color: COLORS.cyan }}>Name</span>=NXM Handler</div>
          <div><span style={{ color: COLORS.cyan }}>Exec</span>=/usr/local/bin/mo2-nxm.sh %u</div>
          <div><span style={{ color: COLORS.cyan }}>Type</span>=Application</div>
          <div><span style={{ color: COLORS.cyan }}>MimeType</span>=x-scheme-handler/nxm</div>
          <div><span style={{ color: COLORS.cyan }}>NoDisplay</span>=true</div>
        </div>
        <button style={{
          marginTop: 10, width: "100%", padding: "6px 0",
          background: `${COLORS.blue}15`, border: `1px solid ${COLORS.blue}`,
          color: COLORS.blue, fontFamily: "monospace", fontSize: 11, cursor: "pointer", borderRadius: 2,
        }}>[ TEST NXM:// LINK ]</button>
      </Card>
    </div>
  );
}

function ShortcutTab() {
  const [proton, setProton] = useState("GE-Proton9-26");
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <Card glow={COLORS.orange}>
        <SectionHeader color={COLORS.orange}>NON-STEAM SHORTCUT BUILDER</SectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          {[["APP NAME", "Mod Organizer 2"], ["EXECUTABLE", "/home/wehttamsnaps/.local/bin/ModOrganizer.exe"], ["START DIR", "/home/wehttamsnaps/.local/share/ModOrganizer"], ["ICON", "/home/wehttamsnaps/.local/share/icons/mo2.png"]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 9, color: COLORS.orange, fontFamily: "monospace", marginBottom: 4 }}>{label}</div>
              <input defaultValue={val} style={{
                width: "100%", background: "#080014", border: `1px solid ${COLORS.border}`,
                color: COLORS.text, padding: "5px 8px", fontFamily: "monospace", fontSize: 10,
                borderRadius: 2, outline: "none", boxSizing: "border-box",
              }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: COLORS.orange, fontFamily: "monospace", marginBottom: 4 }}>PROTON VERSION</div>
          <select value={proton} onChange={e => setProton(e.target.value)} style={{
            background: "#080014", border: `1px solid ${COLORS.border}`, color: COLORS.cyan,
            padding: "5px 8px", fontFamily: "monospace", fontSize: 11, borderRadius: 2,
          }}>
            {["GE-Proton9-26", "GE-Proton9-20", "Proton 9.0", "Proton 8.0"].map(v => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <div style={{
          background: "#050010", border: `1px solid ${COLORS.border}`,
          padding: 10, fontFamily: "monospace", fontSize: 10, color: COLORS.text, lineHeight: 1.8,
          borderRadius: 2, marginBottom: 12,
        }}>
          <span style={{ color: COLORS.muted }}>LAUNCH OPTIONS: </span>
          <span style={{ color: COLORS.cyan }}>PROTON_USE_WINED3D=1 WINEARCH=win64 %command%</span>
        </div>
        <button style={{
          padding: "8px 24px", background: `${COLORS.orange}15`, border: `1px solid ${COLORS.orange}`,
          color: COLORS.orange, fontFamily: "monospace", fontSize: 12, cursor: "pointer",
          borderRadius: 2, boxShadow: `0 0 10px ${COLORS.orange}30`,
        }}>[ WRITE TO SHORTCUTS.VDF ]</button>
      </Card>
    </div>
  );
}

function FlatpakTab() {
  const [perms, setPerms] = useState({ filesystem: true, network: true, devices: true, steam: false });
  const keys = Object.keys(perms);

  const cmd = `flatpak override com.modorganizer.MO2LinuxHelper${
    perms.filesystem ? " --filesystem=home" : ""}${
    perms.devices ? " --device=all" : ""}${
    perms.network ? " --share=network" : ""}${
    perms.steam ? " --filesystem=/home/wehttamsnaps/.steam" : ""}`;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Card glow={COLORS.pink}>
        <SectionHeader color={COLORS.pink}>FLATPAK PERMISSIONS</SectionHeader>
        {keys.map(k => (
          <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.text, fontWeight: 700 }}>{k.toUpperCase()}</div>
              <div style={{ fontSize: 9, color: COLORS.muted, fontFamily: "monospace" }}>
                {k === "filesystem" ? "--filesystem=home" : k === "network" ? "--share=network" : k === "devices" ? "--device=all" : "--filesystem=steam"}
              </div>
            </div>
            <Toggle enabled={perms[k]} onChange={v => setPerms(p => ({ ...p, [k]: v }))} />
          </div>
        ))}
      </Card>
      <Card glow={COLORS.blue}>
        <SectionHeader color={COLORS.blue}>LIVE OVERRIDE COMMAND</SectionHeader>
        <div style={{
          background: "#050010", border: `1px solid ${COLORS.border}`,
          padding: 12, fontFamily: "monospace", fontSize: 10, color: COLORS.cyan,
          lineHeight: 1.8, borderRadius: 2, wordBreak: "break-all",
          minHeight: 80,
        }}>
          {cmd}
        </div>
        <button style={{
          marginTop: 10, padding: "6px 16px", background: `${COLORS.blue}15`,
          border: `1px solid ${COLORS.blue}`, color: COLORS.blue,
          fontFamily: "monospace", fontSize: 11, cursor: "pointer", borderRadius: 2,
        }}>[ APPLY OVERRIDES ]</button>
      </Card>
    </div>
  );
}

function InstancesTab() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <GlowText color={COLORS.cyan} size={12}>DETECTED INSTANCES — {INSTANCES.length} FOUND</GlowText>
        <button style={{
          background: `${COLORS.cyan}15`, border: `1px solid ${COLORS.cyan}`,
          color: COLORS.cyan, fontFamily: "monospace", fontSize: 11, padding: "4px 12px", cursor: "pointer", borderRadius: 2,
        }}>[ SCAN ]</button>
      </div>
      {INSTANCES.map((inst, i) => (
        <Card key={i} glow={COLORS.blue}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.cyan, marginBottom: 4 }}>{inst.game}</div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: COLORS.muted }}>{inst.path}</div>
            </div>
            <button style={{
              background: `${COLORS.orange}15`, border: `1px solid ${COLORS.orange}`,
              color: COLORS.orange, fontFamily: "monospace", fontSize: 11, padding: "5px 14px",
              cursor: "pointer", borderRadius: 2,
            }}>LAUNCH</button>
            <button style={{
              background: `${COLORS.pink}10`, border: `1px solid ${COLORS.pink}40`,
              color: COLORS.pink, fontFamily: "monospace", fontSize: 11, padding: "5px 10px",
              cursor: "pointer", borderRadius: 2,
            }}>✕</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PluginsTab() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <GlowText color={COLORS.cyan} size={12}>NATIVE PLUGINS — libgame_*.so</GlowText>
        <button style={{
          background: `${COLORS.cyan}15`, border: `1px solid ${COLORS.cyan}`,
          color: COLORS.cyan, fontFamily: "monospace", fontSize: 11, padding: "4px 12px", cursor: "pointer", borderRadius: 2,
        }}>[ UPDATE ALL ]</button>
      </div>
      {PLUGINS.map(plugin => (
        <Card key={plugin.name} glow={plugin.status === "ok" ? COLORS.cyan : plugin.status === "warn" ? COLORS.yellow : COLORS.pink}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <GlowText color={COLORS.cyan} size={12}>{plugin.name}</GlowText>
                <StatusBadge status={plugin.status} />
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: COLORS.muted, marginTop: 3 }}>v{plugin.version}</div>
            </div>
            <button style={{
              background: `${COLORS.blue}15`, border: `1px solid ${COLORS.blue}`,
              color: COLORS.blue, fontFamily: "monospace", fontSize: 11, padding: "5px 12px",
              cursor: "pointer", borderRadius: 2,
            }}>UPDATE</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const tabContent = [
    <SetupTab />, <DepsTab />, <FixesTab />, <NxmTab />,
    <ShortcutTab />, <FlatpakTab />, <InstancesTab />, <PluginsTab />
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.bg}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080014; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.cyan}60; border-radius: 2px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:0.97} 93%{opacity:0.7} 94%{opacity:1} }
        .app-container { animation: flicker 8s infinite; }
      `}</style>
      <ScanlineOverlay />
      <div className="app-container" style={{
        minHeight: "100vh", background: COLORS.bg, padding: 0,
        fontFamily: "'Share Tech Mono', monospace",
      }}>
        {/* TOPBAR */}
        <div style={{
          background: COLORS.bgPanel,
          borderBottom: `1px solid ${COLORS.cyan}30`,
          padding: "10px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: `0 2px 20px ${COLORS.cyan}10`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 32, height: 32, background: `linear-gradient(135deg, #8b00ff, #3b82ff)`,
              borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 900, color: "white", fontFamily: "monospace",
              boxShadow: `0 0 12px ${COLORS.blue}`,
            }}>WS</div>
            <GlowText color={COLORS.cyan} size={18} weight={900}>MO2 LINUX HELPER</GlowText>
            <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: "monospace" }}>v2.0.77</span>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.cyan, boxShadow: `0 0 8px ${COLORS.cyan}`, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 10, color: COLORS.cyan, fontFamily: "monospace" }}>FLATPAK DETECTED</span>
            </div>
            <div style={{ fontSize: 10, color: COLORS.muted, fontFamily: "monospace" }}>
              {time.toLocaleTimeString()}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <StatusBadge status="warn" />
              <span style={{ fontSize: 10, color: COLORS.muted, fontFamily: "monospace" }}>1 MISSING DEP</span>
            </div>
          </div>
        </div>

        {/* TAB BAR */}
        <div style={{
          background: COLORS.bgPanel,
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 24px",
          display: "flex", gap: 0, overflowX: "auto",
        }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} style={{
              padding: "10px 16px", background: "none",
              border: "none", borderBottom: `2px solid ${i === activeTab ? COLORS.cyan : "transparent"}`,
              color: i === activeTab ? COLORS.cyan : COLORS.muted,
              fontFamily: "'Share Tech Mono', monospace", fontSize: 11, cursor: "pointer",
              whiteSpace: "nowrap", transition: "all 0.15s",
              textShadow: i === activeTab ? `0 0 10px ${COLORS.cyan}` : "none",
            }}>{tab}</button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
          {tabContent[activeTab]}
        </div>

        {/* FOOTER */}
        <div style={{
          borderTop: `1px solid ${COLORS.border}`, padding: "8px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: COLORS.bgPanel,
        }}>
          <span style={{ fontSize: 9, color: COLORS.muted, fontFamily: "monospace" }}>
            WehttamSnaps — github.com/Crowdrocker — twitch.tv/WehttamSnaps
          </span>
          <span style={{ fontSize: 9, color: COLORS.muted, fontFamily: "monospace" }}>
            com.modorganizer.MO2LinuxHelper — AUR: mo2-linux-helper
          </span>
        </div>
      </div>
    </>
  );
}
