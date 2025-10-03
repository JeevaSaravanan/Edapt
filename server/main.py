from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, Dict
from pathlib import Path
import sys
import uuid
import json

# Add agents to path
sys.path.append(str(Path(__file__).parent))

try:
    from agents.orchestrator_agent import OrchestratorAgent
    AGENTS_AVAILABLE = True
except ImportError:
    AGENTS_AVAILABLE = False
    print("Warning: Agent modules not available. Using fallback mode.")

# Initialize the FastAPI app
app = FastAPI(
    title="Edapt Learning Content API",
    description="AI-powered learning content generation using Google ADK",
    version="2.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount public directory
public_dir = Path(__file__).parent.parent / "public"
public_dir.mkdir(parents=True, exist_ok=True)
app.mount("/public", StaticFiles(directory=str(public_dir)), name="public")

# Initialize orchestrator
orchestrator = OrchestratorAgent() if AGENTS_AVAILABLE else None

# In-memory storage for generation status
generation_status: Dict[str, Dict] = {}


class ContentRequest(BaseModel):
    query: str
    narrative_style: str = "intuitive"
    target_duration: int = 120
    include_video: bool = True


class ContentResponse(BaseModel):
    session_id: str
    status: str
    message: str


@app.get("/")
async def root():
    return {
        "service": "Edapt Learning Content API",
        "version": "2.0.0",
        "status": "running",
        "agents_available": AGENTS_AVAILABLE
    }


@app.post("/api/generate-content", response_model=ContentResponse)
async def generate_content(request: ContentRequest, background_tasks: BackgroundTasks):
    """
    Generate complete learning content from user query using AI agents
    """
    if not AGENTS_AVAILABLE or not orchestrator:
        raise HTTPException(status_code=503, detail="Agent services not available")
    
    try:
        # Generate temporary session ID
        temp_session_id = str(uuid.uuid4())
        
        generation_status[temp_session_id] = {
            "session_id": temp_session_id,
            "status": "processing",
            "query": request.query
        }
        
        def generate_in_background():
            try:
                result = orchestrator.generate_learning_content(
                    user_query=request.query,
                    narrative_style=request.narrative_style,
                    target_duration=request.target_duration,
                    include_video=request.include_video
                )
                
                actual_session_id = result["session_id"]
                generation_status[actual_session_id] = result
                generation_status[temp_session_id] = result  # Update temp ID too
                
                # Copy to public directory
                orchestrator.copy_to_public(
                    session_id=actual_session_id,
                    public_dir=str(public_dir)
                )
                
            except Exception as e:
                generation_status[temp_session_id] = {
                    "session_id": temp_session_id,
                    "status": "failed",
                    "error": str(e)
                }
        
        background_tasks.add_task(generate_in_background)
        
        return ContentResponse(
            session_id=temp_session_id,
            status="processing",
            message="Content generation started. Check status with /api/status/{session_id}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/status/{session_id}")
async def get_status(session_id: str):
    """
    Get generation status
    """
    if session_id not in generation_status:
        return {
            "session_id": session_id,
            "status": "not_found",
            "message": "Session not found or still initializing"
        }
    
    result = generation_status[session_id]
    
    # Return simplified status
    return {
        "session_id": result.get("session_id", session_id),
        "status": result.get("status"),
        "topic": result.get("topic"),
        "message": result.get("error") if result.get("status") == "failed" else None
    }


@app.get("/api/content/{session_id}")
async def get_content(session_id: str):
    """
    Get generated content for a session
    """
    if session_id not in generation_status:
        raise HTTPException(status_code=404, detail="Session not found")
    
    result = generation_status[session_id]
    
    if result["status"] != "completed":
        return {
            "session_id": session_id,
            "status": result["status"],
            "message": "Content generation not completed yet" if result["status"] == "processing" else result.get("error")
        }
    
    # Get actual session ID
    actual_session_id = result.get("session_id", session_id)
    
    # Read mindmap content
    mindmap_code = None
    if orchestrator:
        mindmap_file = Path(orchestrator.output_dir) / actual_session_id / "mindmap.txt"
        if mindmap_file.exists():
            mindmap_code = mindmap_file.read_text()
        
        # Read metadata
        metadata_file = Path(orchestrator.output_dir) / actual_session_id / "metadata.json"
        metadata = {}
        if metadata_file.exists():
            with open(metadata_file) as f:
                metadata = json.load(f)
    
    return {
        "session_id": actual_session_id,
        "status": "completed",
        "topic": result.get("topic"),
        "mindmap_code": mindmap_code,
        "audio_url": f"/public/generated/{actual_session_id}/narration.mp3",
        "video_url": f"/public/generated/{actual_session_id}/video.mp4",
        "narrative": result.get("content", {}).get("narrative", {}),
        "assets": result.get("assets", {})
    }


@app.get("/api/sessions")
async def list_sessions():
    """
    List all generation sessions
    """
    if not orchestrator:
        return {"sessions": []}
    
    sessions = []
    session_dir = orchestrator.output_dir
    
    if session_dir.exists():
        for item in session_dir.iterdir():
            if item.is_dir():
                metadata_file = item / "metadata.json"
                if metadata_file.exists():
                    with open(metadata_file) as f:
                        metadata = json.load(f)
                    sessions.append({
                        "session_id": item.name,
                        "topic": metadata.get("topic"),
                        "status": metadata.get("status"),
                        "timestamp": metadata.get("timestamp"),
                        "query": metadata.get("user_query")
                    })
    
    return {"sessions": sessions}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)