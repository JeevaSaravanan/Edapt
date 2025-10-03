#!/bin/bash

# Play the generated narration audio

AUDIO_FILE="/Users/jeevasaravanabhavanandam/Documents/Edapt/media/audio/narration/derivative_narration_full.mp3"

echo "🎧 Playing Derivative Narration Audio..."
echo ""
echo "📄 File: $AUDIO_FILE"
echo "⏱️  Duration: 1 minute 58 seconds (~118 seconds)"
echo "📦 Size: 918 KB"
echo ""
echo "Press Ctrl+C to stop playback"
echo ""

afplay "$AUDIO_FILE"

echo ""
echo "✅ Playback complete!"
