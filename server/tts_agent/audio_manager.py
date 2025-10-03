#!/usr/bin/env python3
"""
Quick commands for working with the generated narration audio.
"""

import os
from pathlib import Path

AUDIO_FILE = Path(__file__).parent.parent.parent / "media" / "audio" / "narration" / "derivative_narration_full.mp3"

def show_info():
    """Show audio file information."""
    print("\n" + "=" * 60)
    print("   🎙️  DERIVATIVE NARRATION AUDIO")
    print("=" * 60 + "\n")
    
    if not AUDIO_FILE.exists():
        print("❌ Audio file not found!")
        print(f"   Expected: {AUDIO_FILE}")
        print("\n   Run: python generate-narration.py")
        return False
    
    size_kb = AUDIO_FILE.stat().st_size / 1024
    
    print(f"📄 File: {AUDIO_FILE.name}")
    print(f"📍 Location: {AUDIO_FILE.parent}")
    print(f"📦 Size: {size_kb:.1f} KB")
    print(f"⏱️  Duration: ~1 minute 58 seconds\n")
    
    return True

def play_audio():
    """Play the audio file."""
    if not AUDIO_FILE.exists():
        print("❌ Audio file not found! Generate it first.")
        return
    
    print("🎧 Playing audio...")
    print("   Press Ctrl+C to stop\n")
    os.system(f'afplay "{AUDIO_FILE}"')
    print("\n✅ Playback complete!")

def open_folder():
    """Open the folder containing the audio."""
    if not AUDIO_FILE.parent.exists():
        print("❌ Audio folder not found!")
        return
    
    os.system(f'open "{AUDIO_FILE.parent}"')
    print(f"📂 Opened: {AUDIO_FILE.parent}")

def show_commands():
    """Show useful commands."""
    print("\n" + "=" * 60)
    print("   📋 QUICK COMMANDS")
    print("=" * 60 + "\n")
    
    print("🎬 INTEGRATE WITH MANIM:")
    print("   Option 1: Add during render")
    print("   manim -pqh server/animation_manim/manim-sample.py \\\n"
          "         DerivativeExplanation \\\n"
          f"         --add_audio {AUDIO_FILE}\n")
    
    print("   Option 2: Add in scene code")
    print("   self.add_sound('media/audio/narration/derivative_narration_full.mp3')\n")
    
    print("🔄 REGENERATE AUDIO:")
    print("   cd server/tts_agent")
    print("   python generate-narration.py\n")
    
    print("🎧 PLAY AUDIO:")
    print(f"   afplay {AUDIO_FILE}\n")
    
    print("📂 OPEN FOLDER:")
    print(f"   open {AUDIO_FILE.parent}\n")
    
    print("📊 GET INFO:")
    print(f"   afinfo {AUDIO_FILE}\n")

def main():
    """Main menu."""
    print("\n" + "=" * 60)
    print("   🎙️  NARRATION AUDIO MANAGER")
    print("=" * 60)
    
    if not show_info():
        return
    
    print("\n📋 What would you like to do?\n")
    print("   1. Play audio")
    print("   2. Open folder in Finder")
    print("   3. Show integration commands")
    print("   4. Show file info")
    print("   5. Exit\n")
    
    choice = input("Enter choice (1-5): ").strip()
    
    if choice == "1":
        play_audio()
    elif choice == "2":
        open_folder()
    elif choice == "3":
        show_commands()
    elif choice == "4":
        show_info()
    elif choice == "5":
        print("\n👋 Goodbye!")
    else:
        print("\n❌ Invalid choice")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Interrupted. Goodbye!")
