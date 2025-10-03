"""
Orchestrator Agent using Google ADK
Coordinates all agents to generate complete educational content
"""

import os
import json
from pathlib import Path
from typing import Dict, Optional
from datetime import datetime
import asyncio

from agents.content_generation_agent import ContentGenerationAgent
from agents.animation_agent import AnimationAgent
import sys
sys.path.append(str(Path(__file__).parent.parent / "tts_agent"))
from google_tts_agent import GoogleTTSAgent


class OrchestratorAgent:
    """Master agent that orchestrates all content generation"""
    
    def __init__(self, project_id: str = None, output_dir: str = None):
        """
        Initialize the Orchestrator Agent
        
        Args:
            project_id: Google Cloud project ID
            output_dir: Base output directory
        """
        self.project_id = project_id or os.getenv("GOOGLE_CLOUD_PROJECT")
        self.output_dir = Path(output_dir) if output_dir else Path.cwd() / "generated_content"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize all agents
        self.content_agent = ContentGenerationAgent(project_id=self.project_id)
        self.tts_agent = GoogleTTSAgent()
        self.animation_agent = AnimationAgent()
        
        # Set default TTS configuration
        self.tts_agent.set_voice(language_code="en-us", name="en-US-Neural2-J")
        self.tts_agent.set_audio_config(speaking_rate=0.95)
        
    def generate_learning_content(self, user_query: str,
                                  narrative_style: str = "intuitive",
                                  target_duration: int = 120,
                                  include_video: bool = True) -> Dict:
        """
        Generate complete learning content from user query
        
        Args:
            user_query: User's learning query
            narrative_style: Narrative style (intuitive, formal, conversational)
            target_duration: Target duration in seconds
            include_video: Whether to generate animation video
            
        Returns:
            Complete content package with all assets
        """
        session_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        session_dir = self.output_dir / session_id
        session_dir.mkdir(parents=True, exist_ok=True)
        
        results = {
            "session_id": session_id,
            "user_query": user_query,
            "timestamp": datetime.now().isoformat(),
            "status": "processing",
            "assets": {}
        }
        
        try:
            # Step 1: Generate content (mindmap, narrative, animation code)
            print(f"🎯 Generating content for: {user_query}")
            content = self.content_agent.generate_complete_content(
                user_query, narrative_style, target_duration
            )
            
            results["topic"] = content["topic"]
            results["content"] = content
            
            # Save mindmap
            mindmap_file = session_dir / "mindmap.txt"
            mindmap_file.write_text(content["mindmap"]["mindmap_code"])
            results["assets"]["mindmap"] = {
                "path": str(mindmap_file),
                "code": content["mindmap"]["mindmap_code"]
            }
            print(f"✅ Mindmap generated")
            
            # Step 2: Generate audio narration
            print(f"🎙️  Generating audio narration...")
            narrative_segments = content["narrative"]["segments"]
            full_text = " ".join([seg["content"] for seg in narrative_segments])
            
            audio_file = session_dir / "narration.mp3"
            audio_result = self.tts_agent.text_to_speech(
                text=full_text,
                output_file=str(audio_file)
            )
            
            results["assets"]["audio"] = {
                "path": str(audio_file),
                "size": audio_file.stat().st_size,
                "segments": narrative_segments,
                "duration": content["narrative"]["total_duration"]
            }
            print(f"✅ Audio generated: {audio_file.stat().st_size / 1024:.1f} KB")
            
            # Step 3: Generate animation video (if requested)
            if include_video:
                print(f"🎬 Rendering animation video...")
                animation_code = content["animation"]["animation_code"]
                
                # Save animation code
                animation_code_file = session_dir / "animation.py"
                animation_code_file.write_text(animation_code)
                
                # Render animation
                render_result = self.animation_agent.render_animation(
                    animation_code=animation_code,
                    scene_name="GeneratedScene",
                    quality="low",
                    format="mp4"
                )
                
                if render_result["success"]:
                    video_path = render_result["video_path"]
                    print(f"✅ Animation rendered: {Path(video_path).name}")
                    
                    # Add audio to video
                    print(f"🔊 Adding audio to video...")
                    combined_result = self.animation_agent.add_audio_to_video(
                        video_path=video_path,
                        audio_path=str(audio_file),
                        output_path=str(session_dir / "final_video.mp4")
                    )
                    
                    if combined_result["success"]:
                        final_video = combined_result["video_path"]
                        print(f"✅ Final video created: {Path(final_video).name}")
                        
                        results["assets"]["video"] = {
                            "path": final_video,
                            "size": Path(final_video).stat().st_size,
                            "metadata": combined_result["metadata"]
                        }
                    else:
                        results["assets"]["video"] = {
                            "error": combined_result.get("error")
                        }
                else:
                    results["assets"]["video"] = {
                        "error": render_result.get("error")
                    }
            
            # Step 4: Save session metadata
            metadata_file = session_dir / "metadata.json"
            with open(metadata_file, 'w') as f:
                json.dump(results, f, indent=2)
            
            results["status"] = "completed"
            print(f"\n🎉 Content generation completed!")
            print(f"📁 Session directory: {session_dir}")
            
            return results
            
        except Exception as e:
            results["status"] = "failed"
            results["error"] = str(e)
            print(f"❌ Error: {e}")
            return results
    
    def copy_to_public(self, session_id: str, public_dir: str) -> Dict:
        """
        Copy generated assets to public directory for web serving
        
        Args:
            session_id: Session ID
            public_dir: Public directory path
            
        Returns:
            Dictionary with public paths
        """
        session_dir = self.output_dir / session_id
        public_dir = Path(public_dir)
        
        if not session_dir.exists():
            return {"success": False, "error": "Session not found"}
        
        try:
            # Create public subdirectories
            public_session = public_dir / "generated" / session_id
            public_session.mkdir(parents=True, exist_ok=True)
            
            public_paths = {}
            
            # Copy audio
            audio_src = session_dir / "narration.mp3"
            if audio_src.exists():
                audio_dest = public_session / "narration.mp3"
                import shutil
                shutil.copy2(audio_src, audio_dest)
                public_paths["audio"] = f"/generated/{session_id}/narration.mp3"
            
            # Copy video
            video_src = session_dir / "final_video.mp4"
            if video_src.exists():
                video_dest = public_session / "video.mp4"
                import shutil
                shutil.copy2(video_src, video_dest)
                public_paths["video"] = f"/generated/{session_id}/video.mp4"
            
            # Copy mindmap
            mindmap_src = session_dir / "mindmap.txt"
            if mindmap_src.exists():
                mindmap_dest = public_session / "mindmap.txt"
                import shutil
                shutil.copy2(mindmap_src, mindmap_dest)
                public_paths["mindmap"] = mindmap_src.read_text()
            
            return {
                "success": True,
                "session_id": session_id,
                "public_paths": public_paths
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


# Example usage
if __name__ == "__main__":
    orchestrator = OrchestratorAgent()
    
    # Generate content from user query
    result = orchestrator.generate_learning_content(
        user_query="Explain derivatives in calculus using intuitive examples",
        narrative_style="intuitive",
        target_duration=120,
        include_video=True
    )
    
    print("\n" + "="*50)
    print("GENERATION SUMMARY")
    print("="*50)
    print(f"Status: {result['status']}")
    print(f"Topic: {result.get('topic', 'N/A')}")
    print(f"Session ID: {result['session_id']}")
    
    if result["status"] == "completed":
        print("\nGenerated Assets:")
        for asset_type, asset_info in result["assets"].items():
            if "path" in asset_info:
                print(f"  - {asset_type}: {asset_info['path']}")
