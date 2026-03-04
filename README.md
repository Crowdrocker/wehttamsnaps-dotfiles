<div align="center">

```
██╗    ██╗███████╗██╗  ██╗████████╗████████╗ █████╗ ███╗   ███╗███████╗███╗   ██╗ █████╗ ██████╗ ███████╗
██║    ██║██╔════╝██║  ██║╚══██╔══╝╚══██╔══╝██╔══██╗████╗ ████║██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔════╝
██║ █╗ ██║█████╗  ███████║   ██║      ██║   ███████║██╔████╔██║███████╗██╔██╗ ██║███████║██████╔╝███████╗
██║███╗██║██╔══╝  ██╔══██║   ██║      ██║   ██╔══██║██║╚██╔╝██║╚════██║██║╚██╗██║██╔══██║██╔═══╝ ╚════██║
╚███╔███╔╝███████╗██║  ██║   ██║      ██║   ██║  ██║██║ ╚═╝ ██║███████║██║ ╚████║██║  ██║██║     ███████║
 ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚══════╝
```

**Arch Linux · Niri Compositor · J.A.R.V.I.S. Sound System · Tauri Apps**

[![Arch Linux](https://img.shields.io/badge/Arch_Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white)](https://archlinux.org)
[![Niri](https://img.shields.io/badge/Niri-Wayland-00ffd1?style=for-the-badge)](https://github.com/YaLTeR/niri)
[![Rust](https://img.shields.io/badge/Rust-Tauri-ff5af1?style=for-the-badge&logo=rust&logoColor=white)](https://tauri.app)
[![Twitch](https://img.shields.io/badge/Twitch-WehttamSnaps-9b00ff?style=for-the-badge&logo=twitch&logoColor=white)](https://twitch.tv/WehttamSnaps)
[![YouTube](https://img.shields.io/badge/YouTube-@WehttamSnaps-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@WehttamSnaps)

*Photography · Gaming · Content Creation*

</div>

---

## 👋 About

My personal Arch Linux dotfiles optimised for **photography editing**, **PC gaming**, **content creation**, and **live streaming** — all running on a budget build with an AMD RX 580.

The setup is built around a **J.A.R.V.I.S. themed experience** — the system uses a context-aware voice sound system that automatically switches between J.A.R.V.I.S. (Paul Bettany) for work/photography and iDroid (Metal Gear) for gaming, three native **Tauri desktop apps**, and a modular Niri Wayland compositor config.

---

## 🖥️ Hardware

| Component | Spec |
|-----------|------|
| **Machine** | Dell XPS 8700 |
| **CPU** | Intel Core i7-4790 @ 4.00GHz (8 threads) |
| **RAM** | 16GB DDR3 |
| **GPU** | AMD Radeon RX 580 (RADV / Mesa) |
| **Boot Drive** | 120GB SSD |
| **Storage** | 1TB HDD — SteamLibrary, Mods, Photos |
| **Display** | 1920x1080 @ 60Hz (DP-2) |

---

## 🧩 What's Included

```
wehttamsnaps-dotfiles/
├── configs/
│   ├── niri/                    # Niri compositor config (modular)
│   │   ├── config.kdl           # Main config — input, output, layout, env
│   │   └── snaps/
│   │       ├── 00-base.kdl      # Base settings
│   │       ├── 05-wiri_startup.kdl   # Autostart — tiered startup order
│   │       ├── 10-wiri_keybinds.kdl  # All keybindings (12 sections)
│   │       ├── 20-wiri_rules.kdl     # Window rules per app
│   │       ├── 30-workspaces.kdl     # Workspace definitions
│   │       ├── 40-gaming.kdl         # Gaming performance settings
│   │       └── 99-overrides.kdl      # Personal tweaks
│   └── wehttamsnaps/
│       └── scripts/             # Custom shell scripts
├── apps/                        # Tauri app source (JSX)
│   ├── jarvis-panel.jsx         # J.A.R.V.I.S. control panel
│   ├── mo2-helper.jsx           # MO2 Linux Helper
│   └── welcome-screen.jsx       # Animated boot dashboard
├── sounds/
│   ├── jarvis/README.md         # Download instructions for JARVIS clips
│   └── idroid/README.md         # Download instructions for iDroid clips
├── packages/
│   └── main_packages.list       # Full yay package list
└── docs/
    └── WehttamSnaps-Rebuild-Guide.docx  # Full rebuild reference
```

---

## ✨ Features

### 🎙️ Adaptive J.A.R.V.I.S. Sound System
Context-aware voice feedback that auto-switches based on workspace and gaming mode:

- **J.A.R.V.I.S. mode** (Paul Bettany) — work, photography, productivity
- **iDroid mode** (Metal Gear Solid) — gaming, streaming, combat
- **57 J.A.R.V.I.S. clips** + **8 iDroid clips** — voice feedback for every action
- Auto-detects mode from active workspace (gaming workspaces → iDroid)
- Manual override always available

```bash
sound-system gaming-toggle    # Switch between JARVIS and iDroid
sound-system mute             # Volume controls with voice feedback  
sound-system status           # Show current mode
```

### 🖥️ Three Native Tauri Desktop Apps

| App | Keybind | Description |
|-----|---------|-------------|
| **J.A.R.V.I.S. Control Panel** | `Mod+Alt+Shift+J` | Manage voice modes, browse all 65 sound clips, workspace mapping, event log |
| **MO2 Linux Helper** | `Mod+Alt+Shift+M` | Mod Organizer 2 setup tool — dependencies, game fixes, NXM links, Proton config |
| **WehttamSnaps Welcome** | *Auto on boot* | Animated boot sequence → system dashboard with CPU/RAM stats, live clock, channel links |

### 🪟 Niri Wayland Compositor
- Modular config split across 7 files — easy to maintain and override
- WehttamSnaps brand gradients (purple → cyan borders, pink → blue focus rings)
- Spring-physics window animations tuned for feel
- RX 580 optimised environment variables (RADV, ACO compiler, mesa_glthread)
- Gaming mode toggle disables animations and switches to performance profile

### ⌨️ Keybindings
12 organised sections covering everything — J.A.R.V.I.S. shortcuts, window management, workspaces, gaming, screenshots with sound, audio controls. All with `hotkey-overlay-title` for the Niri overlay.

### 🎮 Gaming Setup
- GameMode + Gamescope integration
- Proton-GE via ProtonUp-Qt
- MO2 Linux Helper for Cyberpunk 2077, Fallout 4, Skyrim SE, and more
- iDroid voice mode activates automatically on gaming workspaces
- Steam launch with iDroid sound: `Mod+Shift+S`

### 📸 Photography Workflow
- Workspace 5 dedicated to photography (auto JARVIS mode)
- DigiKam → Darktable → GIMP → Krita pipeline
- Photo export sound feedback via J.A.R.V.I.S.

---

## 🚀 Quick Install

> ⚠️ **These are my personal dotfiles.** Review everything before applying to your own system. Paths and hardware-specific settings will need adjusting for your setup.

### 1. Clone the repo

```bash
git clone https://github.com/Crowdrocker/wehttamsnaps-dotfiles.git
cd wehttamsnaps-dotfiles
```

### 2. Install packages

```bash
# Install yay first if you don't have it
sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/yay-bin.git && cd yay-bin && makepkg -si

# Then install everything
bash packages/main_packages.list
```

### 3. Copy configs

```bash
cp -r configs/niri/        ~/.config/niri/
cp -r configs/wehttamsnaps/ ~/.config/wehttamsnaps/
```

### 4. Set up sound system

```bash
# Create directory structure
sound-system setup

# Download sounds (see sounds/jarvis/README.md and sounds/idroid/README.md)
# Place .mp3 files in:
#   /usr/share/wehttamsnaps/sounds/jarvis/
#   /usr/share/wehttamsnaps/sounds/idroid/
```

### 5. Build the Tauri apps

```bash
# Install prerequisites (Rust, Node, Tauri CLI)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source ~/.cargo/env
cargo install tauri-cli --locked

# Build each app
for APP in jarvis-panel mo2-helper welcome-screen; do
  mkdir -p ~/Projects/wehttamsnaps/$APP
  # See docs/WehttamSnaps-Rebuild-Guide.docx for full step-by-step
done
```

> See **`docs/WehttamSnaps-Rebuild-Guide.docx`** for the complete step-by-step rebuild guide including every command, common errors, and a checklist.

---

## ⌨️ Key Keybindings

| Keybind | Action |
|---------|--------|
| `Mod+Space` | J.A.R.V.I.S. main menu |
| `Mod+G` | Toggle gaming mode (iDroid / J.A.R.V.I.S.) |
| `Mod+Alt+J` | J.A.R.V.I.S. interactive terminal |
| `Mod+Alt+H` | KeyHints cheat sheet |
| `Mod+Alt+Shift+J` | J.A.R.V.I.S. Control Panel app |
| `Mod+Alt+Shift+M` | MO2 Linux Helper app |
| `Mod+Print` | Screenshot + J.A.R.V.I.S. sound |
| `Mod+Shift+S` | Steam + iDroid launch sound |
| `Mod+1` to `Mod+0` | Switch workspace + voice feedback |
| `XF86AudioMute` | Mute with J.A.R.V.I.S. confirmation |

Full keybind reference: `~/.config/niri/snaps/10-wiri_keybinds.kdl`

---

## 🗂️ Workspace Layout

| # | Name | Voice Mode |
|---|------|-----------|
| 1 | Browser | J.A.R.V.I.S. |
| 2 | Terminal / Dev | J.A.R.V.I.S. |
| 3 | Gaming | iDroid |
| 4 | Streaming / OBS | iDroid |
| 5 | Photography | J.A.R.V.I.S. |
| 6 | Media / Video | iDroid |
| 7 | Communication | J.A.R.V.I.S. |
| 8 | Music / Audio | J.A.R.V.I.S. |
| 9 | Files | J.A.R.V.I.S. |
| 10 | Misc | J.A.R.V.I.S. |

---

## 📦 Key Packages

<details>
<summary>Click to expand full package list</summary>

**Compositor & Shell**
`niri` `quickshell-git` `niriswitcher` `swww` `dunst` `swaylock` `swayidle` `waybar` `rofi` `wofi`

**Terminal & Shell**
`ghostty` `konsole` `zsh` `zsh-autosuggestions` `zsh-syntax-highlighting` `zsh-theme-powerlevel10k-git` `starship` `fastfetch` `btop` `bat` `lsd` `fzf`

**Gaming**
`steam` `gamemode` `gamescope` `proton-ge-custom-bin` `protonup-qt` `lutris` `mangohud` `vkbasalt` `goverlay` `lib32-gamemode` `lib32-mangohud`

**Photography & Creative**
`darktable` `gimp` `krita` `rawtherapee` `digikam` `inkscape` `blender` `obs-studio`

**Audio**
`pipewire` `pipewire-pulse` `wireplumber` `qpwgraph` `easyeffects` `pavucontrol` `playerctl`

**Development**
`code` `git` `github-desktop-bin` `nodejs` `npm` `pnpm` `rust` (via rustup) `python` `docker`

**Browsers & Web**
`firefox` `brave-bin` `vivaldi`

**Communication**
`discord` `vesktop` `telegram-desktop`

**Utilities**
`cliphist` `wl-clipboard` `grim` `slurp` `satty` `udiskie` `blueman` `network-manager-applet` `keepassxc`

</details>

---

## 🔊 Sound Files

Sound clips are **not included** in this repo for copyright reasons. Download them from:

- **J.A.R.V.I.S.** (Paul Bettany): [101soundboards.com/boards/10155](https://www.101soundboards.com/boards/10155)
- **iDroid** (Metal Gear Solid): [101soundboards.com/boards/10060](https://www.101soundboards.com/boards/10060)

Place `.mp3` files in:
```
/usr/share/wehttamsnaps/sounds/jarvis/
/usr/share/wehttamsnaps/sounds/idroid/
```

Run `sound-system list` to verify all clips are found.

---

## 📺 Find Me

| Platform | Link |
|----------|------|
| 🎮 Twitch | [twitch.tv/WehttamSnaps](https://twitch.tv/WehttamSnaps) |
| 📺 YouTube | [@WehttamSnaps](https://youtube.com/@WehttamSnaps) |
| 🐙 GitHub | [github.com/Crowdrocker](https://github.com/Crowdrocker) |

---

## 📄 License

Personal dotfiles — feel free to use anything here as inspiration or reference. If you use significant portions, a credit or shoutout would be appreciated!

---

<div align="center">

*Made with ❤️ by WehttamSnaps — Photography · Gaming · Content Creation*

</div>
