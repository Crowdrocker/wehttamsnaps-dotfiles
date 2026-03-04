#!/usr/bin/env bash
# regenerate_cheatsheet.sh
# Wrapper script used by the systemd user service to regenerate the Niri cheatsheet
# when the KDL file changes.
#
# Defaults assume you cloned the repo to: $HOME/WehttamSnaps-Niri
# Edit the variables below if your layout differs.
#
# This script writes its output to OUT_PATH and logs to systemd journal (stdout/stderr).

set -euo pipefail

# --- CONFIG: adjust if your repo is in a different location ---
REPO_ROOT="${REPO_ROOT:-$HOME/WehttamSnaps-Niri}"
KDL_PATH="${KDL_PATH:-$REPO_ROOT/dots/.config/niri/snaps/10-wiri_keybinds.kdl}"
PARSER="${PARSER:-$REPO_ROOT/generate_niri_cheatsheet.py}"
OUT_PATH="${OUT_PATH:-$REPO_ROOT/docs/10-wiri_keybinds-cheatsheet.md}"

# Generator flags
GROUP_FLAG="${GROUP_FLAG:---group}"
STRICT_FLAG="${STRICT_FLAG:---strict-header}"

# Ensure interpreter available
command -v python3 >/dev/null 2>&1 || { echo "python3 not found"; exit 1; }

# Basic checks
if [ ! -f "$KDL_PATH" ]; then
  echo "KDL not found: $KDL_PATH" >&2
  exit 2
fi

if [ ! -f "$PARSER" ]; then
  echo "Parser not found: $PARSER" >&2
  exit 3
fi

# Ensure output dir exists
mkdir -p "$(dirname "$OUT_PATH")"

echo "[$(date -Iseconds)] Regenerating cheatsheet..."
echo "KDL: $KDL_PATH"
echo "PARSER: $PARSER"
echo "OUT: $OUT_PATH"

# Run parser
if python3 "$PARSER" "$KDL_PATH" -o "$OUT_PATH" $GROUP_FLAG $STRICT_FLAG; then
  echo "Cheatsheet regenerated: $OUT_PATH"
  exit 0
else
  echo "Cheatsheet generation failed" >&2
  exit 4
fi