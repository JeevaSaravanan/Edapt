#!/usr/bin/env python3
"""
Quick Start Guide for Google TTS Agent
This script will help you get started with the Text-to-Speech agent.
"""

import os
import sys
from pathlib import Path


def check_credentials():
    """Check if Google Cloud credentials are configured."""
    creds_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    
    if not creds_path:
        print("❌ GOOGLE_APPLICATION_CREDENTIALS not set")
        return False
    
    if not Path(creds_path).exists():
        print(f"❌ Credentials file not found: {creds_path}")
        return False
    
    print(f"✅ Credentials configured: {creds_path}")
    return True


def setup_guide():
    """Display setup instructions."""
    print("\n" + "=" * 60)
    print("   GOOGLE TEXT-TO-SPEECH AGENT - QUICK START")
    print("=" * 60 + "\n")
    
    print("📋 SETUP STEPS:\n")
    
    print("1️⃣  Set up Google Cloud Project")
    print("   → Go to: https://console.cloud.google.com/")
    print("   → Create a new project or select existing one\n")
    
    print("2️⃣  Enable Text-to-Speech API")
    print("   → Navigate to: APIs & Services > Library")
    print("   → Search for 'Cloud Text-to-Speech API'")
    print("   → Click 'Enable'\n")
    
    print("3️⃣  Create Service Account")
    print("   → Go to: IAM & Admin > Service Accounts")
    print("   → Click 'Create Service Account'")
    print("   → Name: 'tts-agent' (or your choice)")
    print("   → Grant role: 'Cloud Text-to-Speech User'")
    print("   → Create and download JSON key file\n")
    
    print("4️⃣  Set Environment Variable")
    print("   → For current session:")
    print("      export GOOGLE_APPLICATION_CREDENTIALS='/path/to/key.json'")
    print("   → Or add to your shell config (~/.zshrc or ~/.bashrc):")
    print("      echo 'export GOOGLE_APPLICATION_CREDENTIALS=\"/path/to/key.json\"' >> ~/.zshrc")
    print("   → Reload: source ~/.zshrc\n")
    
    print("5️⃣  Verify Installation")
    print("   → Run: python quick_start.py\n")
    
    print("=" * 60 + "\n")


def test_connection():
    """Test connection to Google Cloud TTS API."""
    print("🔄 Testing connection to Google Cloud TTS API...\n")
    
    try:
        from google.cloud import texttospeech
        
        client = texttospeech.TextToSpeechClient()
        
        # List voices to test connection
        response = client.list_voices(language_code="en-US")
        
        print(f"✅ Connection successful!")
        print(f"✅ Found {len(response.voices)} voices available\n")
        
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}\n")
        return False


def generate_sample_audio():
    """Generate a sample audio file to test the setup."""
    print("🎙️  Generating sample audio...\n")
    
    try:
        from google_tts_agent import GoogleTTSAgent
        
        agent = GoogleTTSAgent()
        
        sample_text = "Hello! This is a test of the Google Text to Speech system. If you can hear this, everything is working correctly."
        
        output_dir = Path("../../media/audio/test")
        output_dir.mkdir(parents=True, exist_ok=True)
        
        output_file = output_dir / "setup_test.mp3"
        
        agent.text_to_speech(sample_text, str(output_file))
        
        print(f"✅ Sample audio generated: {output_file}")
        print("   You can play it to verify the setup\n")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to generate audio: {str(e)}\n")
        return False


def show_next_steps():
    """Show what to do next."""
    print("\n" + "=" * 60)
    print("   NEXT STEPS")
    print("=" * 60 + "\n")
    
    print("🎯 You can now:")
    print("   1. Generate full narration:")
    print("      cd /Users/jeevasaravanabhavanandam/Documents/Edapt/server/tts_agent")
    print("      python google_tts_agent.py\n")
    
    print("   2. Run examples:")
    print("      python example_usage.py\n")
    
    print("   3. Use in your code:")
    print("      from google_tts_agent import GoogleTTSAgent")
    print("      agent = GoogleTTSAgent()")
    print("      agent.generate_narration_audio()\n")
    
    print("📚 Read the full documentation:")
    print("   cat README.md\n")
    
    print("=" * 60 + "\n")


def main():
    """Main function."""
    # Display setup guide
    setup_guide()
    
    # Check credentials
    print("🔍 Checking credentials...\n")
    
    if not check_credentials():
        print("\n⚠️  Please set up Google Cloud credentials first.")
        print("   Follow the setup steps above.\n")
        
        print("💡 Quick tip: You can also use an API key for testing:")
        print("   → Go to: APIs & Services > Credentials > Create API Key")
        print("   → Then set: export GOOGLE_CLOUD_API_KEY='your-key'\n")
        sys.exit(1)
    
    # Test connection
    if not test_connection():
        print("\n⚠️  Could not connect to Google Cloud TTS API.")
        print("   Please check your credentials and API access.\n")
        sys.exit(1)
    
    # Generate sample audio
    if not generate_sample_audio():
        print("\n⚠️  Could not generate sample audio.")
        sys.exit(1)
    
    # Show next steps
    show_next_steps()
    
    print("🎉 Setup complete! You're ready to generate narration audio.\n")


if __name__ == "__main__":
    main()
