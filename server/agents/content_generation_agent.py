"""
Content Generation Agent using Google ADK
Generates mindmaps, summaries, and learning content based on user queries
"""

import os
from typing import Dict, List, Optional
from google.cloud import aiplatform
from vertexai.preview import reasoning_engines
import vertexai
from vertexai.generative_models import GenerativeModel, Part, Content
import json


class ContentGenerationAgent:
    """Agent that generates educational content including mindmaps and narratives"""
    
    def __init__(self, project_id: str = None, location: str = "us-central1"):
        """
        Initialize the Content Generation Agent
        
        Args:
            project_id: Google Cloud project ID
            location: Google Cloud region
        """
        self.project_id = project_id or os.getenv("GOOGLE_CLOUD_PROJECT")
        self.location = location
        
        # Initialize Vertex AI
        vertexai.init(project=self.project_id, location=self.location)
        
        # Initialize Gemini model for content generation
        self.model = GenerativeModel("gemini-1.5-pro")
        
    def generate_mindmap(self, topic: str, user_query: str = "") -> Dict:
        """
        Generate a Mermaid.js mindmap based on the topic and user query
        
        Args:
            topic: Main topic for the mindmap
            user_query: Optional user query for customization
            
        Returns:
            Dictionary containing mindmap code and metadata
        """
        prompt = f"""You are an expert educational content creator. Generate a comprehensive mindmap 
using Mermaid.js syntax for the topic: "{topic}".

User query: {user_query if user_query else "Create a comprehensive overview"}

Requirements:
1. Use mindmap syntax starting with "mindmap"
2. Create a root node with the main topic
3. Add 5-7 main branches covering key concepts
4. Each branch should have 2-4 sub-nodes with details
5. Use clear, concise labels (no emojis)
6. Focus on educational value and logical hierarchy
7. Include practical applications where relevant

Return ONLY the valid Mermaid.js mindmap code without any markdown code blocks or additional text.
Start directly with "mindmap" keyword.

Example format:
mindmap
  root((Main Topic))
    Branch 1
      Sub-concept 1
      Sub-concept 2
    Branch 2
      Detail A
      Detail B
"""
        
        response = self.model.generate_content(prompt)
        mindmap_code = response.text.strip()
        
        # Clean up the response
        if "```" in mindmap_code:
            # Extract code from markdown blocks
            mindmap_code = mindmap_code.split("```")[1]
            if mindmap_code.startswith("mermaid"):
                mindmap_code = mindmap_code[7:].strip()
        
        return {
            "mindmap_code": mindmap_code,
            "topic": topic,
            "metadata": {
                "generated_by": "content_generation_agent",
                "model": "gemini-1.5-pro"
            }
        }
    
    def generate_narrative_summary(self, topic: str, style: str = "intuitive", 
                                   target_duration: int = 120) -> Dict:
        """
        Generate a narrative summary for TTS conversion
        
        Args:
            topic: Topic to explain
            style: Narrative style (intuitive, formal, conversational, technical)
            target_duration: Target duration in seconds (approximate)
            
        Returns:
            Dictionary containing narrative segments with timestamps
        """
        words_per_second = 2.5  # Average speaking rate
        target_words = int(target_duration * words_per_second)
        
        prompt = f"""You are an expert educator creating audio narration content.
Create a {style} explanation of: "{topic}"

Requirements:
1. Target approximately {target_words} words ({target_duration} seconds of speech)
2. Style: {style}
3. Break the content into 8-12 logical segments
4. Each segment should be 1-3 sentences
5. Use clear, engaging language
6. Include real-world examples and analogies
7. Build from basics to advanced concepts
8. Make it memorable and intuitive

Format your response as a JSON array of segments:
[
  {{
    "segment_id": 1,
    "title": "Introduction",
    "content": "Opening statement...",
    "estimated_duration": 10
  }},
  ...
]

Return ONLY valid JSON without any markdown formatting or additional text.
"""
        
        response = self.model.generate_content(prompt)
        content = response.text.strip()
        
        # Clean up JSON response
        if "```" in content:
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:].strip()
        
        segments = json.loads(content)
        
        # Add cumulative timestamps
        cumulative_time = 0
        for segment in segments:
            segment["start_time"] = cumulative_time
            segment["end_time"] = cumulative_time + segment["estimated_duration"]
            cumulative_time = segment["end_time"]
        
        return {
            "segments": segments,
            "total_duration": cumulative_time,
            "style": style,
            "topic": topic,
            "metadata": {
                "generated_by": "content_generation_agent",
                "model": "gemini-1.5-pro"
            }
        }
    
    def generate_animation_script(self, topic: str, narrative_segments: List[Dict],
                                  duration: int) -> Dict:
        """
        Generate Manim animation code synchronized with narrative
        
        Args:
            topic: Topic to animate
            narrative_segments: List of narrative segments with timing
            duration: Total duration in seconds
            
        Returns:
            Dictionary containing Manim Python code
        """
        segments_text = "\n".join([
            f"Segment {s['segment_id']} ({s['start_time']}-{s['end_time']}s): {s['title']}"
            for s in narrative_segments
        ])
        
        prompt = f"""You are an expert Manim animator. Create a Manim scene for the topic: "{topic}"

The animation should be {duration} seconds long and synchronized with these narrative segments:
{segments_text}

Requirements:
1. Create a complete Manim Scene class named "GeneratedScene"
2. Use manim Community Edition syntax
3. Include visual representations matching the narrative flow
4. Add mathematical formulas, graphs, or diagrams as appropriate
5. Use wait() commands to sync with narrative timing
6. Make it visually engaging with colors and animations
7. Resolution: 854x480 (480p)
8. Frame rate: 15 fps

Important timing notes:
- Total scene duration must be {duration} seconds
- Use self.wait(duration) to control timing
- Align major visual transitions with segment boundaries

Return ONLY the complete Python code without markdown blocks or explanations.
Start with necessary imports and the class definition.

Example structure:
from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Your animation code here
        pass
"""
        
        response = self.model.generate_content(prompt)
        code = response.text.strip()
        
        # Clean up code response
        if "```" in code:
            code = code.split("```")[1]
            if code.startswith("python"):
                code = code[6:].strip()
        
        return {
            "animation_code": code,
            "duration": duration,
            "topic": topic,
            "metadata": {
                "generated_by": "content_generation_agent",
                "model": "gemini-1.5-pro",
                "scene_class": "GeneratedScene"
            }
        }
    
    def generate_complete_content(self, user_query: str, 
                                  narrative_style: str = "intuitive",
                                  target_duration: int = 120) -> Dict:
        """
        Generate all content (mindmap, narrative, animation) in one call
        
        Args:
            user_query: User's learning query
            narrative_style: Style for the narrative
            target_duration: Target duration in seconds
            
        Returns:
            Complete content package
        """
        # Extract topic from query
        topic_prompt = f"Extract the main educational topic from this query in 2-4 words: '{user_query}'"
        topic_response = self.model.generate_content(topic_prompt)
        topic = topic_response.text.strip().strip('"\'')
        
        # Generate all content
        mindmap = self.generate_mindmap(topic, user_query)
        narrative = self.generate_narrative_summary(topic, narrative_style, target_duration)
        animation = self.generate_animation_script(topic, narrative["segments"], 
                                                   narrative["total_duration"])
        
        return {
            "topic": topic,
            "user_query": user_query,
            "mindmap": mindmap,
            "narrative": narrative,
            "animation": animation,
            "metadata": {
                "generated_by": "content_generation_agent",
                "timestamp": None  # Add timestamp in orchestrator
            }
        }


# Example usage
if __name__ == "__main__":
    agent = ContentGenerationAgent()
    
    # Test mindmap generation
    result = agent.generate_mindmap("Derivatives in Calculus", 
                                    "Explain derivatives intuitively")
    print("Mindmap generated:")
    print(result["mindmap_code"][:200] + "...")
    
    # Test narrative generation
    narrative = agent.generate_narrative_summary("Derivatives", "intuitive", 120)
    print(f"\nNarrative generated: {len(narrative['segments'])} segments")
    print(f"Total duration: {narrative['total_duration']}s")
