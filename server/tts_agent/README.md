# Google Text-to-Speech Agent

This agent converts the derivative explanation narration into speech audio using Google Cloud Text-to-Speech API.

## Features

- **Multiple Voice Options**: Choose from various neural voices
- **Customizable Audio**: Adjust speaking rate, pitch, and audio format
- **SSML Support**: Add pauses, emphasis, and pronunciation controls
- **Segment or Full Generation**: Generate one complete audio or individual segments
- **Educational Optimization**: Configured for clear, educational narration

## Setup

### 1. Install Google Cloud Text-to-Speech

```bash
# Activate your virtual environment
source /Users/jeevasaravanabhavanandam/Documents/Edapt/.venv/bin/activate

# Install the package
pip install google-cloud-texttospeech
```

### 2. Set Up Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Cloud Text-to-Speech API**
4. Create a service account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name (e.g., "tts-agent")
   - Grant it the "Cloud Text-to-Speech User" role
   - Click "Create Key" and download the JSON file

5. Set the credentials environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-key.json"
```

Or add it to your `.env` file:
```
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-service-account-key.json
```

### 3. Alternative: Use API Key (Simpler but less secure)

You can also use an API key instead of service account:

1. Go to APIs & Services > Credentials
2. Create API Key
3. Use it in your code:

```python
import os
os.environ['GOOGLE_CLOUD_API_KEY'] = 'your-api-key-here'
```

## Usage

### Basic Usage

```python
from google_tts_agent import GoogleTTSAgent

# Initialize the agent
agent = GoogleTTSAgent()

# Generate full narration audio
agent.generate_narration_audio(
    output_dir="../../media/audio/narration",
    mode="full"
)
```

### Generate Individual Segments

```python
# Generate audio for each narration segment
agent.generate_narration_audio(
    output_dir="../../media/audio/narration_segments",
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

# Or use a British accent
agent.set_voice(
    language_code="en-GB",
    name="en-GB-Neural2-B",
    gender="MALE"
)
```

### Adjust Audio Settings

```python
# Slower speech for better comprehension
agent.set_audio_config(
    speaking_rate=0.85,  # 85% of normal speed
    pitch=-2.0,          # Slightly lower pitch
    audio_format="MP3"
)
```

### Use SSML for Advanced Control

```python
# Generate audio with SSML markup for pauses and emphasis
ssml_text = agent.create_ssml_narration()
agent.ssml_to_speech(ssml_text, "output/enhanced_narration.mp3")
```

### Convert Custom Text

```python
# Convert any text to speech
agent.text_to_speech(
    text="Hello! This is a custom narration.",
    output_path="output/custom_audio.mp3"
)
```

### List Available Voices

```python
# See all available voices
voices = agent.list_available_voices(language_code="en-US")
for voice in voices:
    print(f"{voice['name']} - {voice['gender']}")
```

## Running the Example

```bash
cd /Users/jeevasaravanabhavanandam/Documents/Edapt/server/tts_agent
python google_tts_agent.py
```

## Voice Recommendations

### For Educational Content (Recommended)
- **Male**: `en-US-Neural2-J` - Clear, professional, warm
- **Female**: `en-US-Neural2-F` - Clear, engaging, friendly

### For Different Styles
- **Casual**: `en-US-Neural2-A` (Male) or `en-US-Neural2-C` (Female)
- **Professional**: `en-US-Neural2-D` (Male) or `en-US-Neural2-E` (Female)
- **Energetic**: `en-US-Neural2-I` (Male) or `en-US-Neural2-H` (Female)

## Audio Quality Settings

### Speaking Rate
- `0.85-0.95`: Slower, better for complex concepts
- `1.0`: Normal speed
- `1.1-1.2`: Faster, for familiar content

### Pitch
- `-5.0 to -2.0`: Lower, more authoritative
- `0.0`: Natural
- `2.0 to 5.0`: Higher, more energetic

## Output Structure

```
media/
└── audio/
    ├── narration/
    │   ├── derivative_narration_full.mp3
    │   └── derivative_narration_enhanced.mp3
    └── narration_segments/
        ├── segment_01_Title_Screen.mp3
        ├── segment_02_Axes_and_Graph_Appear.mp3
        ├── segment_03_Secant_Line_Introduction.mp3
        └── ...
```

## Pricing

Google Cloud Text-to-Speech pricing (as of 2024):
- **Standard voices**: Free for first 0-4 million characters/month
- **Neural2 voices**: $16 per 1 million characters
- **WaveNet voices**: $16 per 1 million characters

The derivative narration is approximately 1,500 characters, so costs are minimal.

## Troubleshooting

### Authentication Error
```
google.auth.exceptions.DefaultCredentialsError
```
**Solution**: Make sure `GOOGLE_APPLICATION_CREDENTIALS` is set correctly.

### API Not Enabled
```
google.api_core.exceptions.PermissionDenied: 403
```
**Solution**: Enable the Cloud Text-to-Speech API in your Google Cloud Console.

### Import Error
```
ModuleNotFoundError: No module named 'google.cloud'
```
**Solution**: Install the package: `pip install google-cloud-texttospeech`

## Next Steps

1. Generate the audio narration
2. Sync audio with manim animation using video editing software
3. Adjust timing in `narration_data.py` to match animation
4. Consider using audio analysis to detect pauses and sync animations programmatically

## Resources

- [Google Cloud TTS Documentation](https://cloud.google.com/text-to-speech/docs)
- [SSML Reference](https://cloud.google.com/text-to-speech/docs/ssml)
- [Voice List](https://cloud.google.com/text-to-speech/docs/voices)
- [Pricing](https://cloud.google.com/text-to-speech/pricing)
