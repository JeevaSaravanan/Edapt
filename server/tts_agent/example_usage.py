"""
Example usage scripts for the Google TTS Agent.
"""

from google_tts_agent import GoogleTTSAgent
from narration_data import DERIVATIVE_NARRATION


def example_1_basic_usage():
    """Basic usage: Generate full narration audio."""
    print("=== Example 1: Basic Usage ===\n")
    
    agent = GoogleTTSAgent()
    
    # Generate full narration
    files = agent.generate_narration_audio(
        output_dir="../../media/audio/narration",
        mode="full"
    )
    
    print(f"\nGenerated: {files[0]}")


def example_2_custom_voice():
    """Use a different voice."""
    print("\n=== Example 2: Custom Voice ===\n")
    
    agent = GoogleTTSAgent()
    
    # Try a female voice
    agent.set_voice(
        language_code="en-US",
        name="en-US-Neural2-F",
        gender="FEMALE"
    )
    
    # Generate with new voice
    text = DERIVATIVE_NARRATION[0]['text']
    agent.text_to_speech(
        text=text,
        output_path="../../media/audio/test/female_voice_test.mp3"
    )
    
    print("Generated audio with female voice")


def example_3_slow_narration():
    """Generate slower narration for better comprehension."""
    print("\n=== Example 3: Slow Narration ===\n")
    
    agent = GoogleTTSAgent()
    
    # Slow down the speech
    agent.set_audio_config(
        speaking_rate=0.85,  # 85% speed
        pitch=-1.0,          # Slightly lower pitch
        audio_format="MP3"
    )
    
    # Generate slow version
    files = agent.generate_narration_audio(
        output_dir="../../media/audio/narration",
        mode="full"
    )
    
    print("Generated slow narration for study purposes")


def example_4_segment_generation():
    """Generate individual audio segments."""
    print("\n=== Example 4: Individual Segments ===\n")
    
    agent = GoogleTTSAgent()
    
    # Generate all segments
    files = agent.generate_narration_audio(
        output_dir="../../media/audio/narration_segments",
        mode="segments"
    )
    
    print(f"Generated {len(files)} individual segment files:")
    for i, file in enumerate(files[:3], 1):  # Show first 3
        print(f"  {i}. {file}")
    print(f"  ... and {len(files) - 3} more")


def example_5_ssml_enhanced():
    """Generate audio with SSML enhancements."""
    print("\n=== Example 5: SSML Enhanced ===\n")
    
    agent = GoogleTTSAgent()
    
    # Create SSML with pauses and emphasis
    ssml = agent.create_ssml_narration()
    
    # Generate enhanced audio
    agent.ssml_to_speech(
        ssml_text=ssml,
        output_path="../../media/audio/narration/enhanced_narration.mp3"
    )
    
    print("Generated SSML-enhanced audio with pauses and emphasis")


def example_6_list_voices():
    """List all available voices."""
    print("\n=== Example 6: Available Voices ===\n")
    
    agent = GoogleTTSAgent()
    
    # Get all English US voices
    voices = agent.list_available_voices(language_code="en-US")
    
    print(f"Found {len(voices)} voices for en-US:\n")
    
    # Group by gender
    male_voices = [v for v in voices if v['gender'] == 'MALE']
    female_voices = [v for v in voices if v['gender'] == 'FEMALE']
    
    print("Male Voices:")
    for voice in male_voices[:5]:
        print(f"  - {voice['name']}")
    
    print("\nFemale Voices:")
    for voice in female_voices[:5]:
        print(f"  - {voice['name']}")


def example_7_compare_voices():
    """Generate samples with different voices for comparison."""
    print("\n=== Example 7: Voice Comparison ===\n")
    
    # Test text
    test_text = DERIVATIVE_NARRATION[0]['text']
    
    # Voice configurations to test
    voices_to_test = [
        ("en-US-Neural2-J", "MALE", "professional_male"),
        ("en-US-Neural2-F", "FEMALE", "professional_female"),
        ("en-US-Neural2-A", "MALE", "casual_male"),
        ("en-US-Neural2-C", "FEMALE", "casual_female"),
    ]
    
    for voice_name, gender, label in voices_to_test:
        agent = GoogleTTSAgent()
        agent.set_voice(
            language_code="en-US",
            name=voice_name,
            gender=gender
        )
        
        output_path = f"../../media/audio/test/{label}_sample.mp3"
        agent.text_to_speech(test_text, output_path)
        print(f"Generated: {label}")


def example_8_batch_process():
    """Process all segments with custom settings."""
    print("\n=== Example 8: Batch Processing ===\n")
    
    agent = GoogleTTSAgent()
    
    # Configure for educational content
    agent.set_voice(
        language_code="en-US",
        name="en-US-Neural2-J",
        gender="MALE"
    )
    
    agent.set_audio_config(
        speaking_rate=0.92,  # Slightly slower for clarity
        pitch=-0.5,          # Slightly lower for authority
        audio_format="MP3"
    )
    
    # Generate all formats
    print("Generating full narration...")
    agent.generate_narration_audio(
        output_dir="../../media/audio/final",
        mode="full"
    )
    
    print("Generating segments...")
    agent.generate_narration_audio(
        output_dir="../../media/audio/final/segments",
        mode="segments"
    )
    
    print("Generating SSML enhanced version...")
    ssml = agent.create_ssml_narration()
    agent.ssml_to_speech(
        ssml,
        "../../media/audio/final/enhanced_narration.mp3"
    )
    
    print("\nBatch processing complete!")


def main():
    """Run all examples."""
    print("Google TTS Agent - Example Usage\n")
    print("=" * 50)
    
    examples = [
        ("Basic Usage", example_1_basic_usage),
        ("Custom Voice", example_2_custom_voice),
        ("Slow Narration", example_3_slow_narration),
        ("Individual Segments", example_4_segment_generation),
        ("SSML Enhanced", example_5_ssml_enhanced),
        ("List Voices", example_6_list_voices),
        ("Voice Comparison", example_7_compare_voices),
        ("Batch Processing", example_8_batch_process),
    ]
    
    print("\nAvailable Examples:")
    for i, (name, _) in enumerate(examples, 1):
        print(f"  {i}. {name}")
    
    print("\nTo run a specific example, uncomment the function call below")
    print("or run: python example_usage.py\n")
    
    # Run example 1 by default
    example_1_basic_usage()
    
    # Uncomment to run other examples:
    # example_2_custom_voice()
    # example_3_slow_narration()
    # example_4_segment_generation()
    # example_5_ssml_enhanced()
    # example_6_list_voices()
    # example_7_compare_voices()
    # example_8_batch_process()


if __name__ == "__main__":
    main()
