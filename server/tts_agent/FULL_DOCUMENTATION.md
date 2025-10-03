# 🎙️ Text-to-Speech Agent for Derivative Narration

Complete solution for converting the derivative explanation narration into high-quality audio.

## 📁 Files Structure

```
tts_agent/
├── README.md                    # Main documentation (this file)
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment configuration template
├── narration_data.py           # Narration text and timeline data
├── google_tts_agent.py         # Google Cloud TTS implementation (recommended)
├── local_tts_agent.py          # Free macOS alternative for testing
├── example_usage.py            # Usage examples
└── quick_start.py              # Setup verification script
```

## 🚀 Quick Start

### Option 1: Google Cloud TTS (Recommended for Production)

**Best for:** Professional quality, multiple voices, production use

1. **Install dependencies:**
   ```bash
   cd /Users/jeevasaravanabhavanandam/Documents/Edapt/server/tts_agent
   pip install -r requirements.txt
   ```

2. **Set up Google Cloud:**
   ```bash
   python quick_start.py
   ```
   Follow the on-screen instructions to configure credentials.

3. **Generate narration:**
   ```bash
   python google_tts_agent.py
   ```

### Option 2: Local TTS (Free, for Testing)

**Best for:** Quick testing, no account needed

```bash
python local_tts_agent.py
```

This uses macOS's built-in `say` command (macOS only).

## 📦 Installation

### Install Python Packages

```bash
# Activate virtual environment
source /Users/jeevasaravanabhavanandam/Documents/Edapt/.venv/bin/activate

# Install Google Cloud TTS
pip install google-cloud-texttospeech python-dotenv

# Optional: For audio processing
pip install pydub librosa
```

### Install System Dependencies (Optional)

For audio format conversion:

```bash
# Install ffmpeg (if not already installed)
brew install ffmpeg
```

## 🔧 Configuration

### Google Cloud Setup (Detailed)

1. **Create Google Cloud Project:**
   - Go to https://console.cloud.google.com/
   - Click "Select a project" → "New Project"
   - Name it (e.g., "edapt-tts")
   - Click "Create"

2. **Enable Text-to-Speech API:**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Cloud Text-to-Speech API"
   - Click on it and press "Enable"

3. **Create Service Account:**
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Name: `tts-agent` (or your choice)
   - Click "Create and Continue"
   - Select role: "Cloud Text-to-Speech User"
   - Click "Done"

4. **Generate Key:**
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Save the file securely

5. **Configure Environment:**
   ```bash
   # Set for current session
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-key.json"
   
   # Or add to ~/.zshrc for permanent setup
   echo 'export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-key.json"' >> ~/.zshrc
   source ~/.zshrc
   ```

6. **Verify Setup:**
   ```bash
   python quick_start.py
   ```

## 💻 Usage Examples

### Basic Usage

```python
from google_tts_agent import GoogleTTSAgent

# Initialize
agent = GoogleTTSAgent()

# Generate full narration
agent.generate_narration_audio(
    output_dir="../../media/audio/narration",
    mode="full"
)
```

### Generate Individual Segments

```python
# Generate separate files for each narration segment
agent.generate_narration_audio(
    output_dir="../../media/audio/segments",
    mode="segments"
)
```

### Customize Voice

```python
# Use a female voice
agent.set_voice(
    language_code="en-US",
    name="en-US-Neural2-F",
    gender="FEMALE"
)

# Use British accent
agent.set_voice(
    language_code="en-GB",
    name="en-GB-Neural2-B",
    gender="MALE"
)
```

### Adjust Speaking Speed

```python
# Slower for complex content (recommended for education)
agent.set_audio_config(
    speaking_rate=0.85,  # 85% of normal speed
    pitch=-1.0,          # Slightly lower pitch
    audio_format="MP3"
)

# Generate with new settings
agent.generate_narration_audio(
    output_dir="../../media/audio/slow",
    mode="full"
)
```

### SSML for Fine Control

```python
# Generate audio with pauses and emphasis
ssml_text = agent.create_ssml_narration()
agent.ssml_to_speech(
    ssml_text,
    "../../media/audio/enhanced.mp3"
)
```

### Convert Custom Text

```python
# Any text to speech
custom_text = "This is a custom narration for testing."
agent.text_to_speech(
    text=custom_text,
    output_path="../../media/audio/custom.mp3"
)
```

### List Available Voices

```python
# See all voices
voices = agent.list_available_voices(language_code="en-US")
for voice in voices:
    print(f"{voice['name']} - {voice['gender']}")
```

## 🎯 Run Examples

```bash
# Run all example code
python example_usage.py

# Or use the main script
python google_tts_agent.py
```

## 🎨 Voice Recommendations

### For Educational Content (Best)
- **Male**: `en-US-Neural2-J` - Clear, professional, warm
- **Female**: `en-US-Neural2-F` - Clear, engaging, friendly

### For Different Styles
- **Casual/Friendly**: `en-US-Neural2-A` (M) or `en-US-Neural2-C` (F)
- **Professional**: `en-US-Neural2-D` (M) or `en-US-Neural2-E` (F)
- **Energetic**: `en-US-Neural2-I` (M) or `en-US-Neural2-H` (F)

### British Accent
- **Male**: `en-GB-Neural2-B` or `en-GB-Neural2-D`
- **Female**: `en-GB-Neural2-A` or `en-GB-Neural2-C`

## ⚙️ Audio Settings Guide

### Speaking Rate
- **0.75-0.85**: Slow, for complex mathematical concepts
- **0.85-0.95**: Moderate slow, recommended for education
- **1.0**: Normal conversational speed
- **1.1-1.2**: Faster, for familiar content
- **1.2-1.5**: Very fast, for time-constrained content

### Pitch
- **-5.0 to -2.0**: Lower, more authoritative/serious
- **-1.0 to 1.0**: Natural range
- **2.0 to 5.0**: Higher, more energetic/friendly

### Audio Format
- **MP3**: Best for web, small file size, good quality
- **WAV**: Uncompressed, highest quality, large files
- **OGG**: Good compression, open format

## 📊 Output Structure

After running the agent:

```
media/
└── audio/
    ├── narration/
    │   ├── derivative_narration_full.mp3         # Complete narration
    │   └── derivative_narration_enhanced.mp3     # SSML version
    ├── narration_segments/
    │   ├── segment_01_Title_Screen.mp3
    │   ├── segment_02_Axes_and_Graph_Appear.mp3
    │   ├── segment_03_Secant_Line_Introduction.mp3
    │   └── ... (12 segments total)
    └── test/
        └── setup_test.mp3                         # Verification file
```

## 💰 Pricing

### Google Cloud Text-to-Speech
- **Standard voices**: $4 per 1 million characters (not recommended)
- **Neural2 voices**: $16 per 1 million characters (recommended)
- **First 0-4 million characters**: Free each month (standard voices only)

For this project:
- Full narration: ~1,500 characters
- Cost: ~$0.024 per generation (negligible)
- Free tier covers ~2,666 generations per month (standard voices)

### Alternatives
- **macOS 'say'**: Free, built-in (basic quality)
- **Amazon Polly**: Similar pricing to Google
- **Microsoft Azure TTS**: Similar pricing to Google
- **ElevenLabs**: $5-$99/month (very high quality)

## 🔧 Troubleshooting

### "DefaultCredentialsError"
```
google.auth.exceptions.DefaultCredentialsError
```
**Solution:** Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-key.json"
```

### "PermissionDenied: 403"
```
google.api_core.exceptions.PermissionDenied: 403
```
**Solution:** Enable the Cloud Text-to-Speech API in Google Cloud Console.

### "ModuleNotFoundError"
```
ModuleNotFoundError: No module named 'google.cloud'
```
**Solution:** Install the package:
```bash
pip install google-cloud-texttospeech
```

### "command not found: say"
When using `local_tts_agent.py` on non-macOS systems.
**Solution:** Use `google_tts_agent.py` instead, or install alternative TTS:
```bash
pip install gtts  # Google Translate TTS (free, basic)
pip install pyttsx3  # Cross-platform offline TTS
```

### Audio quality is poor
**Solution:** 
1. Use Neural2 voices instead of standard voices
2. Adjust speaking rate (try 0.92-0.95 for education)
3. Use WAV format for highest quality

## 🎬 Integration with Manim

### Synchronize Audio with Animation

```python
# In your manim scene
from manim import *
import librosa

class DerivativeWithNarration(Scene):
    def construct(self):
        # Load audio
        audio_file = "media/audio/narration/derivative_narration_full.mp3"
        self.add_sound(audio_file)
        
        # Get audio duration
        duration = librosa.get_duration(path=audio_file)
        
        # Your animation code with proper timing
        # ...
```

### Render with Audio

```bash
# Render manim scene with audio
manim -pql --disable_caching scene.py SceneName

# Or specify audio file
manim -pql scene.py SceneName --add_audio media/audio/narration/full.mp3
```

## 📝 Customizing Narration

Edit `narration_data.py` to modify the text:

```python
DERIVATIVE_NARRATION = [
    {
        "timestamp": "[0:00 - 0:03]",
        "title": "Title Screen",
        "text": "Your custom narration text here..."
    },
    # Add more segments...
]
```

Then regenerate audio:
```bash
python google_tts_agent.py
```

## 🔗 Resources

- [Google Cloud TTS Docs](https://cloud.google.com/text-to-speech/docs)
- [SSML Reference](https://cloud.google.com/text-to-speech/docs/ssml)
- [Available Voices](https://cloud.google.com/text-to-speech/docs/voices)
- [Pricing Calculator](https://cloud.google.com/text-to-speech/pricing)
- [Python Client Library](https://googleapis.dev/python/texttospeech/latest/)

## 🆘 Support

If you encounter issues:

1. Run the quick start: `python quick_start.py`
2. Check credentials setup
3. Verify API is enabled in Google Cloud Console
4. Test with local TTS: `python local_tts_agent.py`

## 📄 License

This TTS agent is part of the Edapt project.

---

**Need help?** Check the examples in `example_usage.py` or run `python quick_start.py` for setup guidance.
