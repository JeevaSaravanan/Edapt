"""
Google Text-to-Speech Agent
Converts text narration to speech using Google Cloud Text-to-Speech API.
"""

import os
from pathlib import Path
from typing import Optional, List, Dict
from google.cloud import texttospeech
from narration_data import DERIVATIVE_NARRATION, get_full_narration_text, get_narration_segments


class GoogleTTSAgent:
    """Agent for converting text to speech using Google Cloud TTS."""
    
    def __init__(self, credentials_path: Optional[str] = None):
        """
        Initialize the TTS agent.
        
        Args:
            credentials_path: Path to Google Cloud service account JSON file.
                            If not provided, uses GOOGLE_APPLICATION_CREDENTIALS env variable.
        """
        if credentials_path:
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path
        
        self.client = texttospeech.TextToSpeechClient()
        
        # Default voice settings
        self.voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            name="en-US-Neural2-J",  # Male voice, good for educational content
            ssml_gender=texttospeech.SsmlVoiceGender.MALE
        )
        
        # Default audio settings
        self.audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=1.0,  # Normal speed
            pitch=0.0,  # Normal pitch
            effects_profile_id=["small-bluetooth-speaker-class-device"]
        )
    
    def set_voice(self, language_code: str = "en-US", name: str = "en-US-Neural2-J", 
                  gender: str = "MALE"):
        """
        Configure voice settings.
        
        Args:
            language_code: Language code (e.g., "en-US")
            name: Voice name (e.g., "en-US-Neural2-J")
            gender: Voice gender ("MALE", "FEMALE", "NEUTRAL")
        """
        gender_map = {
            "MALE": texttospeech.SsmlVoiceGender.MALE,
            "FEMALE": texttospeech.SsmlVoiceGender.FEMALE,
            "NEUTRAL": texttospeech.SsmlVoiceGender.NEUTRAL
        }
        
        self.voice = texttospeech.VoiceSelectionParams(
            language_code=language_code,
            name=name,
            ssml_gender=gender_map.get(gender.upper(), texttospeech.SsmlVoiceGender.MALE)
        )
    
    def set_audio_config(self, speaking_rate: float = 1.0, pitch: float = 0.0,
                        audio_format: str = "MP3"):
        """
        Configure audio settings.
        
        Args:
            speaking_rate: Speaking rate (0.25 to 4.0, default 1.0)
            pitch: Voice pitch (-20.0 to 20.0, default 0.0)
            audio_format: Audio format ("MP3", "WAV", "OGG")
        """
        format_map = {
            "MP3": texttospeech.AudioEncoding.MP3,
            "WAV": texttospeech.AudioEncoding.LINEAR16,
            "OGG": texttospeech.AudioEncoding.OGG_OPUS
        }
        
        self.audio_config = texttospeech.AudioConfig(
            audio_encoding=format_map.get(audio_format.upper(), texttospeech.AudioEncoding.MP3),
            speaking_rate=speaking_rate,
            pitch=pitch,
            effects_profile_id=["small-bluetooth-speaker-class-device"]
        )
    
    def text_to_speech(self, text: str, output_path: str) -> str:
        """
        Convert text to speech and save as audio file.
        
        Args:
            text: Text to convert to speech
            output_path: Path where audio file will be saved
            
        Returns:
            Path to the generated audio file
        """
        # Create synthesis input
        synthesis_input = texttospeech.SynthesisInput(text=text)
        
        # Perform the text-to-speech request
        response = self.client.synthesize_speech(
            input=synthesis_input,
            voice=self.voice,
            audio_config=self.audio_config
        )
        
        # Ensure output directory exists
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Write the response to the output file
        with open(output_file, 'wb') as out:
            out.write(response.audio_content)
        
        print(f'Audio content written to file "{output_file}"')
        return str(output_file)
    
    def ssml_to_speech(self, ssml_text: str, output_path: str) -> str:
        """
        Convert SSML (Speech Synthesis Markup Language) to speech.
        SSML allows for more control over pronunciation, pauses, emphasis, etc.
        
        Args:
            ssml_text: SSML text to convert
            output_path: Path where audio file will be saved
            
        Returns:
            Path to the generated audio file
        """
        # Create synthesis input from SSML
        synthesis_input = texttospeech.SynthesisInput(ssml=ssml_text)
        
        # Perform the text-to-speech request
        response = self.client.synthesize_speech(
            input=synthesis_input,
            voice=self.voice,
            audio_config=self.audio_config
        )
        
        # Ensure output directory exists
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Write the response to the output file
        with open(output_file, 'wb') as out:
            out.write(response.audio_content)
        
        print(f'Audio content written to file "{output_file}"')
        return str(output_file)
    
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
            output_file = output_path / "derivative_narration_full.mp3"
            self.text_to_speech(full_text, str(output_file))
            generated_files.append(str(output_file))
            
        elif mode == "segments":
            # Generate individual audio files for each segment
            segments = get_narration_segments()
            for i, segment in enumerate(segments, 1):
                output_file = output_path / f"segment_{i:02d}_{segment['title'].replace(' ', '_')}.mp3"
                self.text_to_speech(segment['text'], str(output_file))
                generated_files.append(str(output_file))
        
        return generated_files
    
    def create_ssml_narration(self) -> str:
        """
        Create SSML version of narration with pauses and emphasis.
        
        Returns:
            SSML formatted string
        """
        segments = get_narration_segments()
        
        ssml_parts = ['<speak>']
        
        for segment in segments:
            # Add pause before each segment
            ssml_parts.append('<break time="500ms"/>')
            
            # Add the text with some emphasis on key words
            text = segment['text']
            
            # Add emphasis to mathematical terms
            text = text.replace('derivative', '<emphasis level="moderate">derivative</emphasis>')
            text = text.replace('tangent line', '<emphasis level="moderate">tangent line</emphasis>')
            text = text.replace('secant line', '<emphasis level="moderate">secant line</emphasis>')
            
            ssml_parts.append(text)
        
        ssml_parts.append('</speak>')
        
        return ''.join(ssml_parts)
    
    def list_available_voices(self, language_code: str = "en-US") -> List[Dict]:
        """
        List all available voices for a given language.
        
        Args:
            language_code: Language code to filter voices
            
        Returns:
            List of voice dictionaries with name, gender, and language info
        """
        voices = self.client.list_voices(language_code=language_code)
        
        voice_list = []
        for voice in voices.voices:
            for language in voice.language_codes:
                if language.startswith(language_code):
                    voice_list.append({
                        'name': voice.name,
                        'gender': texttospeech.SsmlVoiceGender(voice.ssml_gender).name,
                        'language': language,
                        'natural_sample_rate': voice.natural_sample_rate_hertz
                    })
        
        return voice_list


def main():
    """Example usage of the TTS agent."""
    # Initialize agent
    # Note: Set GOOGLE_APPLICATION_CREDENTIALS environment variable
    # or pass credentials_path parameter
    agent = GoogleTTSAgent()
    
    print("Google Text-to-Speech Agent initialized")
    print("\n--- Available Voices ---")
    voices = agent.list_available_voices()
    for voice in voices[:5]:  # Show first 5 voices
        print(f"Name: {voice['name']}, Gender: {voice['gender']}")
    
    print("\n--- Generating Audio ---")
    
    # Generate full narration
    print("\n1. Generating full narration...")
    full_files = agent.generate_narration_audio(
        output_dir="../../media/audio/narration",
        mode="full"
    )
    print(f"Generated: {full_files}")
    
    # Generate segments
    print("\n2. Generating individual segments...")
    agent.set_audio_config(speaking_rate=0.95, pitch=0.0)  # Slightly slower for clarity
    segment_files = agent.generate_narration_audio(
        output_dir="../../media/audio/narration_segments",
        mode="segments"
    )
    print(f"Generated {len(segment_files)} segment files")
    
    # Generate SSML version with emphasis
    print("\n3. Generating SSML version with emphasis...")
    ssml_text = agent.create_ssml_narration()
    agent.ssml_to_speech(
        ssml_text,
        "../../media/audio/narration/derivative_narration_enhanced.mp3"
    )


if __name__ == "__main__":
    main()
