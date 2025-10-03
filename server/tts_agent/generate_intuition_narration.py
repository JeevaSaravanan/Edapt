#!/usr/bin/env python3
"""
Generate audio narration for the intuitive derivative explanation.
Uses Google Cloud Text-to-Speech with optimal settings for educational content.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path to import the TTS agent
sys.path.insert(0, str(Path(__file__).parent))

from google_tts_agent import GoogleTTSAgent
from derivative_intuition_narration import get_full_narration_text, DERIVATIVE_INTUITION_NARRATION

def main():
    """Generate the derivative intuition narration audio file."""
    
    # Initialize the TTS agent
    print("🎙️  Initializing Google Cloud Text-to-Speech agent...")
    agent = GoogleTTSAgent()
    
    # Get the full narration text
    narration_text = get_full_narration_text()
    
    print(f"\n📝 Narration Details:")
    print(f"   - Total segments: {len(DERIVATIVE_INTUITION_NARRATION)}")
    print(f"   - Total characters: {len(narration_text)}")
    print(f"   - Estimated duration: ~2:40")
    
    # Define output path (absolute path)
    output_dir = Path(__file__).parent.parent.parent / "media" / "audio" / "narration"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / "derivative_intuition_narration.mp3"
    
    print(f"\n🎵 Generating audio...")
    print(f"   Output: {output_file}")
    
    # Generate audio with optimal settings for narration
    try:
        # Set audio configuration
        agent.set_audio_config(
            speaking_rate=0.95,  # Slightly slower for better comprehension
            pitch=0.0,  # Natural pitch
            audio_format="mp3"
        )
        
        # Set voice
        agent.set_voice(
            language_code="en-us",  # Lowercase to match Google's format
            name="en-US-Neural2-J",  # Clear male voice
            gender="MALE"
        )
        
        # Generate the audio
        result_file = agent.text_to_speech(
            text=narration_text,
            output_path=str(output_file)
        )
        
        # Get file info
        file_size = os.path.getsize(result_file)
        
        print(f"\n✅ Audio generated successfully!")
        print(f"   File: {result_file}")
        print(f"   Size: {file_size / 1024:.1f} KB")
        
        # Play instructions
        print(f"\n🎧 To play the audio:")
        print(f"   afplay {result_file}")
        print(f"   # or")
        print(f"   open {result_file}")
        
        return 0
            
    except Exception as e:
        print(f"\n❌ Error generating audio: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
