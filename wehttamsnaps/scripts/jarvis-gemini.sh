#!/bin/bash
# J.A.R.V.I.S. + Gemini CLI Integration
# Author: Matthew (WehttamSnaps)

set -euo pipefail

SOUND_SYSTEM="/usr/local/bin/sound-system"
VOICE_BASE="/usr/share/wehttamsnaps/sounds/jarvis"

# Sound mappings for AI responses
jarvis_think() {
    paplay "$VOICE_BASE/listening.mp3" &
}

jarvis_response() {
    paplay "$VOICE_BASE/jarvis-confirm.mp3" &
}

jarvis_error() {
    paplay "$VOICE_BASE/error.mp3" &
}

jarvis_search() {
    paplay "$VOICE_BASE/searching-google.mp3" &
}

# Main AI function
jarvis_ask() {
    local prompt="$1"
    local output_format="${2:-text}"

    # Play thinking sound
    jarvis_think

    # Get response from Gemini
    local response
    if [[ "$output_format" == "json" ]]; then
        response=$(gemini -p "$prompt" --output-format json 2>/dev/null)
    else
        response=$(gemini -p "$prompt" 2>/dev/null)
    fi

    # Play response sound
    jarvis_response

    # Output result
    echo "$response"
}

# Streaming responses for long operations
jarvis_stream() {
    local prompt="$1"

    jarvis_think
    gemini -p "$prompt" --output-format stream-json | while read -r line; do
        echo "$line"
    done
    jarvis_response
}

# If script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-ask}" in
        ask)
            jarvis_ask "${2:-Hello J.A.R.V.I.S., how can you help me?}"
            ;;
        stream)
            jarvis_stream "${2:-Analyze this system}"
            ;;
        *)
            echo "Usage: $0 {ask|stream} 'prompt'"
            exit 1
            ;;
    esac
fi
