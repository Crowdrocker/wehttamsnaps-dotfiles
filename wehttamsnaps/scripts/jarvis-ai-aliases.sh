#!/bin/bash
# WehttamSnaps J.A.R.V.I.S. AI Aliases
# Add to ~/.bashrc or source directly
# Author: Matthew (WehttamSnaps)

# ═══════════════════════════════════════════════════════════════════
# SOURCE AI FUNCTIONS
# ═══════════════════════════════════════════════════════════════════

if [ -f "$HOME/.config/wehttamsnaps/scripts/jarvis-ai.sh" ]; then
    source "$HOME/.config/wehttamsnaps/scripts/jarvis-ai.sh"
fi

# ═══════════════════════════════════════════════════════════════════
# QUICK ACCESS ALIASES
# ═══════════════════════════════════════════════════════════════════

# General AI
alias jarvis='jarvis-ask'
alias j='jarvis-ask'
alias ask='jarvis-ask'

# Ultra-quick shortcuts
alias wtf='jarvis-explain-error'
alias why='jarvis-diagnose'

# Friendly aliases for the renamed functions
alias learn='learn-cmd'
alias docs='get-docs'
alias examples='get-examples'

# ═══════════════════════════════════════════════════════════════════
# NIRI COMPOSITOR ALIASES
# ═══════════════════════════════════════════════════════════════════

alias niri-help='jarvis-niri-help'
alias niri-fix='jarvis-debug-niri'
alias niri-analyze='jarvis-analyze-config ~/.config/niri/config.kdl'
alias config-check='jarvis-analyze-config'

# Quick config optimizations
alias optimize-niri='jarvis-ask "analyze my Niri config and suggest performance improvements for gaming and photography"'

# ═══════════════════════════════════════════════════════════════════
# GAMING ALIASES
# ═══════════════════════════════════════════════════════════════════

alias game-fix='jarvis-proton-debug'
alias game-settings='jarvis-game-settings'
alias proton-help='jarvis-ask "explain Proton compatibility and how to troubleshoot games on Linux"'

# Quick game-specific help
alias cyberpunk-help='jarvis-game-settings "Cyberpunk 2077"'
alias division-help='jarvis-game-settings "The Division 2"'
alias fallout-help='jarvis-game-settings "Fallout 4"'

# ═══════════════════════════════════════════════════════════════════
# PHOTOGRAPHY WORKFLOW ALIASES
# ═══════════════════════════════════════════════════════════════════

alias photo-help='jarvis-photo-tips'
alias dt-help='jarvis-darktable-help'
alias darktable-tips='jarvis-photo-tips "Darktable workflow for landscape photography"'

# Quick module help
alias tone-help='jarvis-darktable-help "tone equalizer"'
alias color-help='jarvis-darktable-help "color balance rgb"'
alias denoise-help='jarvis-darktable-help "denoise profiled"'

# ═══════════════════════════════════════════════════════════════════
# CODE & SCRIPT ALIASES
# ═══════════════════════════════════════════════════════════════════

alias explain='jarvis-explain-script'
alias review='jarvis-code-review'
alias generate='jarvis-generate-script'

# Quick script analysis
alias check-script='jarvis-code-review'
alias what-does-this-do='jarvis-explain-script'

# ═══════════════════════════════════════════════════════════════════
# SYSTEM DIAGNOSTIC ALIASES
# ═══════════════════════════════════════════════════════════════════

alias diagnose='jarvis-diagnose'
alias check-system='jarvis-diagnose'
alias audio-check='jarvis-analyze-audio'
alias gpu-check='jarvis-ask "analyze my AMD RX 580 status and performance"'

# ═══════════════════════════════════════════════════════════════════
# PIPED INPUT HELPERS
# ═══════════════════════════════════════════════════════════════════

# These work great with pipes!
# Example: cat error.log | jarvis-explain
alias jarvis-explain='gemini "Explain this output in simple terms:"'
alias jarvis-optimize='gemini "Suggest optimizations for this:"'
alias jarvis-debug='gemini "Debug this error and provide solutions:"'
alias jarvis-summarize='gemini "Summarize this concisely:"'

# ═══════════════════════════════════════════════════════════════════
# CONTEXT-AWARE HELPERS
# ═══════════════════════════════════════════════════════════════════

# Learn commands as you use them
learn-cmd() {
    if [ -z "$1" ]; then
        echo "Usage: learn-cmd <command>"
        echo "Example: learn-cmd pacman -Syu"
        return 1
    fi

    jarvis-ask "Explain this command and what it does: $*"
}

# Quick documentation
get-docs() {
    local topic="$*"
    if [ -z "$topic" ]; then
        echo "Usage: get-docs <topic>"
        echo "Example: get-docs niri window rules"
        return 1
    fi

    jarvis-ask "Provide documentation and examples for: $topic"
}

# Find examples
get-examples() {
    local topic="$*"
    if [ -z "$topic" ]; then
        echo "Usage: get-examples <topic>"
        return 1
    fi

    jarvis-ask "Show me 3-5 practical examples of: $topic"
}

# ═══════════════════════════════════════════════════════════════════
# WORKFLOW-SPECIFIC COMBINATIONS
# ═══════════════════════════════════════════════════════════════════

# Photography workflow
photo-export() {
    sound-system photo-export
    jarvis-ask "What are the best export settings for web vs print in Darktable?"
}

# Gaming mode with AI tips
gaming-mode() {
    sound-system gaming-toggle
    jarvis-ask "I just enabled gaming mode. Give me quick performance tips for AMD RX 580 on Linux."
}

# Check what's using resources
resource-hog() {
    echo "Top CPU processes:"
    ps aux --sort=-%cpu | head -6
    echo ""
    ps aux --sort=-%cpu | head -6 | jarvis-explain
}

# ═══════════════════════════════════════════════════════════════════
# SMART WORKSPACE HELPERS
# ═══════════════════════════════════════════════════════════════════

# Get context-aware tips when switching workspaces
ws() {
    local workspace="$1"

    if [ -z "$workspace" ]; then
        echo "Usage: ws <workspace number>"
        return 1
    fi

    # Switch workspace with sound
    sound-system workspace "$workspace"

    # Give contextual tips
    case "$workspace" in
        2)
            jarvis-ask "I'm on my gaming workspace. Quick tip for optimal performance?"
            ;;
        3)
            jarvis-ask "I'm in my photography workspace. One quick Darktable tip?"
            ;;
        4)
            jarvis-ask "I'm on my streaming workspace. OBS optimization tip?"
            ;;
    esac
}

# ═══════════════════════════════════════════════════════════════════
# SOUND SYSTEM INTEGRATION
# ═══════════════════════════════════════════════════════════════════

# Analyze sound system
check-sounds() {
    sound-system list
    echo ""
    jarvis-ask "I have J.A.R.V.I.S. and iDroid sound packs. Suggest creative ways to use them in my window manager."
}

# Test AI with sound feedback
test-jarvis() {
    sound-system notification
    jarvis-ask "Say 'Systems online, sir. All diagnostic checks complete.' in your best J.A.R.V.I.S. impression."
    sound-system notification
}

# ═══════════════════════════════════════════════════════════════════
# EXPORT FUNCTIONS
# ═══════════════════════════════════════════════════════════════════

export -f learn-cmd get-docs get-examples
export -f photo-export gaming-mode resource-hog ws
export -f check-sounds test-jarvis

# ═══════════════════════════════════════════════════════════════════
# WELCOME MESSAGE (optional - comment out if annoying)
# ═══════════════════════════════════════════════════════════════════

if [ -n "$PS1" ]; then
    # Only show on interactive shells, once per session
    if [ -z "${JARVIS_AI_LOADED:-}" ]; then
        export JARVIS_AI_LOADED=1

        echo -e "\033[0;36m╔═══════════════════════════════════════════════════════╗\033[0m"
        echo -e "\033[0;36m║   J.A.R.V.I.S. AI Integration Active                 ║\033[0m"
        echo -e "\033[0;36m╚═══════════════════════════════════════════════════════╝\033[0m"
        echo -e "\033[1;33mQuick commands: j, wtf, why, game-fix, photo-help\033[0m"
        echo -e "\033[0;90mType 'jarvis-ai.sh' for full command list\033[0m"
        echo ""
    fi
fi
