from google_tts_agent import GoogleTTSAgent
import os
from pathlib import Path

agent = GoogleTTSAgent()

# Professional male voice for education
agent.set_voice(
    name="en-US-Neural2-J",
    gender="MALE"
)

# Slightly slower for clarity
agent.set_audio_config(
    speaking_rate=0.92,
    pitch=-0.5,
    audio_format="MP3"
)

# Use absolute path
project_root = Path(__file__).parent.parent.parent
output_dir = project_root / "media" / "audio" / "narration"

print(f"\n📂 Output directory: {output_dir}")
print(f"   (Absolute path: {output_dir.absolute()})\n")

# Generate
files = agent.generate_narration_audio(
    output_dir=str(output_dir),
    mode="full"
)

print(f"\n✅ Audio generation complete!")
print(f"📄 Generated files:")
for file in files:
    file_path = Path(file)
    if file_path.exists():
        size = file_path.stat().st_size / 1024  # KB
        print(f"   ✓ {file}")
        print(f"     Size: {size:.1f} KB")
    else:
        print(f"   ⚠️  File not found: {file}")

print(f"\n🎧 You can now play the audio file or add it to your manim video!")