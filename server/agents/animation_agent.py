"""
Animation Agent using Google ADK
Generates and renders Manim animations
"""

import os
import subprocess
import tempfile
from pathlib import Path
from typing import Dict, Optional
import shutil


class AnimationAgent:
    """Agent that generates and renders Manim animations"""
    
    def __init__(self, output_dir: str = None):
        """
        Initialize the Animation Agent
        
        Args:
            output_dir: Directory for output videos
        """
        self.output_dir = Path(output_dir) if output_dir else Path.cwd() / "media" / "videos"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def render_animation(self, animation_code: str, scene_name: str = "GeneratedScene",
                        quality: str = "low", format: str = "mp4") -> Dict:
        """
        Render a Manim animation from code
        
        Args:
            animation_code: Python code containing Manim scene
            scene_name: Name of the scene class to render
            quality: Quality level (low, medium, high)
            format: Output format (mp4, mov, gif)
            
        Returns:
            Dictionary with video path and metadata
        """
        # Create temporary file for the animation code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(animation_code)
            temp_file = f.name
        
        try:
            # Quality settings
            quality_flags = {
                "low": "-ql",      # 480p15
                "medium": "-qm",   # 720p30
                "high": "-qh"      # 1080p60
            }
            
            quality_flag = quality_flags.get(quality, "-ql")
            
            # Run manim command
            cmd = [
                "manim",
                quality_flag,
                temp_file,
                scene_name,
                "--format", format,
                "--media_dir", str(self.output_dir.parent)
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True
            )
            
            # Find the generated video
            quality_dirs = {
                "low": "480p15",
                "medium": "720p30",
                "high": "1080p60"
            }
            
            quality_dir = quality_dirs.get(quality, "480p15")
            video_name = Path(temp_file).stem
            video_path = self.output_dir / video_name / quality_dir / f"{scene_name}.{format}"
            
            if not video_path.exists():
                raise FileNotFoundError(f"Generated video not found at {video_path}")
            
            # Get video info
            video_info = self._get_video_info(video_path)
            
            return {
                "success": True,
                "video_path": str(video_path),
                "video_name": f"{scene_name}.{format}",
                "quality": quality,
                "format": format,
                "file_size": video_path.stat().st_size,
                "metadata": video_info
            }
            
        except subprocess.CalledProcessError as e:
            return {
                "success": False,
                "error": str(e),
                "stdout": e.stdout,
                "stderr": e.stderr
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
        finally:
            # Cleanup temp file
            if os.path.exists(temp_file):
                os.unlink(temp_file)
    
    def add_audio_to_video(self, video_path: str, audio_path: str, 
                          output_path: str = None, speed_adjustment: float = 1.0) -> Dict:
        """
        Add audio narration to the video
        
        Args:
            video_path: Path to the video file
            audio_path: Path to the audio file
            output_path: Path for output video (optional)
            speed_adjustment: Video speed adjustment factor
            
        Returns:
            Dictionary with combined video path and metadata
        """
        video_path = Path(video_path)
        audio_path = Path(audio_path)
        
        if not output_path:
            output_path = video_path.parent / f"{video_path.stem}_with_audio.mp4"
        else:
            output_path = Path(output_path)
        
        try:
            # Build ffmpeg command
            if speed_adjustment != 1.0:
                # Adjust video speed
                speed_filter = f"setpts={1/speed_adjustment}*PTS"
                cmd = [
                    "ffmpeg", "-y",
                    "-i", str(video_path),
                    "-i", str(audio_path),
                    "-filter:v", speed_filter,
                    "-c:v", "libx264",
                    "-c:a", "aac",
                    "-shortest",
                    str(output_path)
                ]
            else:
                # No speed adjustment
                cmd = [
                    "ffmpeg", "-y",
                    "-i", str(video_path),
                    "-i", str(audio_path),
                    "-c:v", "copy",
                    "-c:a", "aac",
                    "-shortest",
                    str(output_path)
                ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True
            )
            
            video_info = self._get_video_info(output_path)
            
            return {
                "success": True,
                "video_path": str(output_path),
                "file_size": output_path.stat().st_size,
                "speed_adjustment": speed_adjustment,
                "metadata": video_info
            }
            
        except subprocess.CalledProcessError as e:
            return {
                "success": False,
                "error": str(e),
                "stderr": e.stderr
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _get_video_info(self, video_path: Path) -> Dict:
        """Get video information using ffprobe"""
        try:
            cmd = [
                "ffprobe",
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                str(video_path)
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True
            )
            
            import json
            info = json.loads(result.stdout)
            
            # Extract relevant info
            video_stream = next((s for s in info.get("streams", []) 
                               if s.get("codec_type") == "video"), {})
            
            return {
                "duration": float(info.get("format", {}).get("duration", 0)),
                "width": video_stream.get("width"),
                "height": video_stream.get("height"),
                "fps": eval(video_stream.get("r_frame_rate", "0/1")),
                "codec": video_stream.get("codec_name")
            }
        except Exception:
            return {}
    
    def copy_to_public(self, video_path: str, public_dir: str) -> Dict:
        """
        Copy video to public directory for web serving
        
        Args:
            video_path: Source video path
            public_dir: Public directory path
            
        Returns:
            Dictionary with public path
        """
        video_path = Path(video_path)
        public_dir = Path(public_dir)
        public_dir.mkdir(parents=True, exist_ok=True)
        
        dest_path = public_dir / video_path.name
        
        try:
            shutil.copy2(video_path, dest_path)
            return {
                "success": True,
                "public_path": str(dest_path),
                "relative_path": str(dest_path.relative_to(public_dir.parent))
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


# Example usage
if __name__ == "__main__":
    agent = AnimationAgent()
    
    # Example animation code
    test_code = """
from manim import *

class GeneratedScene(Scene):
    def construct(self):
        title = Text("Test Animation")
        self.play(Write(title))
        self.wait(2)
        self.play(FadeOut(title))
"""
    
    result = agent.render_animation(test_code, "GeneratedScene", quality="low")
    print(f"Render result: {result}")
