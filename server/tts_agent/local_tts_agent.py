#!/usr/bin/env python3
"""
Alternative TTS Agent using free/local options
For testing without Google Cloud credentials.
"""

import subprocess
from pathlib import Path
from typing import List
from narration_data import DERIVATIVE_NARRATION, get_full_narration_text, get_narration_segments


class LocalTTSAgent:
    """
    Text-to-Speech agent using system TTS (macOS 'say' command).
    This is a free alternative for testing without Google Cloud setup.
    """
    
    def __init__(self):
        """Initialize the local TTS agent."""
        self.voice = "Alex"  # Default macOS voice
        self.rate = 175  # Words per minute
    
    def set_voice(self, voice_name: str = "Alex"):
        """
        Set the voice to use.
        Common macOS voices: Alex, Samantha, Victoria, Fred, Karen
        
        To list all voices: say -v '?'
        """
        self.voice = voice_name
    
    def set_rate(self, rate: int = 175):
        """
        Set speaking rate in words per minute.
        Default: 175 (normal speed)
        Slower: 150-170
        Faster: 180-200
        """
        self.rate = rate
    
    def text_to_speech(self, text: str, output_path: str) -> str:
        """
        Convert text to speech using macOS 'say' command.
        
        Args:
            text: Text to convert
            output_path: Path where audio file will be saved
            
        Returns:
            Path to the generated audio file
        """
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Use macOS 'say' command to generate audio
        cmd = [
            'say',
            '-v', self.voice,
            '-r', str(self.rate),
            '-o', str(output_file),
            '--data-format=LEF32@22050',  # Audio format
            text
        ]
        
        try:
            subprocess.run(cmd, check=True)
            
            # Convert to MP3 if ffmpeg is available
            mp3_path = output_file.with_suffix('.mp3')
            if self._has_ffmpeg():
                self._convert_to_mp3(str(output_file), str(mp3_path))
                output_file.unlink()  # Remove the intermediate file
                output_file = mp3_path
            
            print(f'Audio content written to file "{output_file}"')
            return str(output_file)
            
        except subprocess.CalledProcessError as e:
            print(f"Error generating audio: {e}")
            return ""
        except FileNotFoundError:
            print("Error: 'say' command not found. This feature requires macOS.")
            return ""
    
    def _has_ffmpeg(self) -> bool:
        """Check if ffmpeg is available."""
        try:
            subprocess.run(['ffmpeg', '-version'], 
                         stdout=subprocess.DEVNULL, 
                         stderr=subprocess.DEVNULL)
            return True
        except FileNotFoundError:
            return False
    
    def _convert_to_mp3(self, input_path: str, output_path: str):
        """Convert audio file to MP3 format."""
        cmd = [
            'ffmpeg',
            '-i', input_path,
            '-acodec', 'libmp3lame',
            '-ab', '192k',
            '-y',  # Overwrite output file
            output_path
        ]
        
        subprocess.run(cmd, 
                      stdout=subprocess.DEVNULL, 
                      stderr=subprocess.DEVNULL)
    
    def generate_narration_audio(self, output_dir: str = "output", 
                                 mode: str = "full") -> List[str]:
        """
        Generate audio for the derivative narration.
        
        Args:
            output_dir: Directory where audio files will be saved
            mode: "full" for one complete audio file, "segments" for individual segments
            
        Returns:
            List of paths to generated audio files
        """
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        generated_files = []
        
        if mode == "full":
            # Generate one complete audio file
            full_text = get_full_narration_text()
            output_file = output_path / "derivative_narration_full.aiff"
            result = self.text_to_speech(full_text, str(output_file))
            if result:
                generated_files.append(result)
            
        elif mode == "segments":
            # Generate individual audio files for each segment
            segments = get_narration_segments()
            for i, segment in enumerate(segments, 1):
                output_file = output_path / f"segment_{i:02d}_{segment['title'].replace(' ', '_')}.aiff"
                result = self.text_to_speech(segment['text'], str(output_file))
                if result:
                    generated_files.append(result)
        
        return generated_files
    
    def list_available_voices(self):
        """List all available system voices."""
        try:
            result = subprocess.run(['say', '-v', '?'], 
                                  capture_output=True, 
                                  text=True)
            print("Available voices:\n")
            print(result.stdout)
        except FileNotFoundError:
            print("Error: 'say' command not found. This feature requires macOS.")


def compare_tts_options():
    """Compare different TTS options available."""
    print("\n" + "=" * 60)
    print("   TEXT-TO-SPEECH OPTIONS COMPARISON")
    print("=" * 60 + "\n")
    
    print("1️⃣  GOOGLE CLOUD TEXT-TO-SPEECH (Recommended)")
    print("   ✅ Professional quality")
    print("   ✅ Multiple neural voices")
    print("   ✅ SSML support for fine control")
    print("   ✅ Multiple languages and accents")
    print("   ❌ Requires Google Cloud account")
    print("   💰 Paid (free tier available)\n")
    
    print("2️⃣  MACOS 'SAY' COMMAND (This file)")
    print("   ✅ Free and built-in")
    print("   ✅ No account needed")
    print("   ✅ Good for testing")
    print("   ❌ macOS only")
    print("   ❌ Basic quality")
    print("   ❌ Limited voice options\n")
    
    print("3️⃣  OTHER OPTIONS:")
    print("   • Amazon Polly - Similar to Google TTS")
    print("   • Microsoft Azure TTS - Similar to Google TTS")
    print("   • ElevenLabs - Very high quality, expensive")
    print("   • gTTS (Google Translate TTS) - Free but basic")
    print("   • pyttsx3 - Offline Python library\n")
    
    print("=" * 60 + "\n")


def main():
    """Example usage of the local TTS agent."""
    print("\n🎙️  LOCAL TEXT-TO-SPEECH AGENT (macOS)\n")
    print("This is a free alternative for testing without Google Cloud.\n")
    
    compare_tts_options()
    
    # Initialize agent
    agent = LocalTTSAgent()
    
    print("🔊 Available Voices:")
    agent.list_available_voices()
    
    print("\n📝 Generating Audio...\n")
    
    # Try different voices
    voices_to_try = ["Alex", "Samantha", "Victoria"]
    
    print("Testing different voices:")
    for voice in voices_to_try:
        print(f"\n  Testing voice: {voice}")
        agent.set_voice(voice)
        agent.set_rate(175)
        
        test_text = DERIVATIVE_NARRATION[0]['text']
        output_file = f"../../media/audio/test/local_{voice.lower()}_test.aiff"
        agent.text_to_speech(test_text, output_file)
    
    print("\n✅ Test complete! Check the generated audio files.\n")
    
    # Optionally generate full narration
    user_input = input("Generate full narration? (y/n): ")
    if user_input.lower() == 'y':
        print("\nGenerating full narration with Alex voice...")
        agent.set_voice("Alex")
        agent.set_rate(170)  # Slightly slower for clarity
        
        files = agent.generate_narration_audio(
            output_dir="../../media/audio/narration_local",
            mode="full"
        )
        
        print(f"\n✅ Generated: {files[0]}")
        print("\n💡 Note: For professional quality, use Google Cloud TTS (google_tts_agent.py)")


if __name__ == "__main__":
    main()
