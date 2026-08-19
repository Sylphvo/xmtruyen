from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
import edge_tts
import os
import uuid
from pydub import AudioSegment as PydubAudioSegment
import re

app = FastAPI(title="XomTruyen Audio Worker")

# --- Models ---
class TtsSegment(BaseModel):
    text: str
    voice: str
    speed: Optional[float] = 1.0
    provider: Optional[str] = "edge_tts"
    pauseAfter: Optional[int] = 500

class TtsRequest(BaseModel):
    segments: List[TtsSegment]
    outputFormat: Optional[str] = "mp3"
    outputPath: str

class PreprocessRequest(BaseModel):
    sourceType: str
    content: str
    characterVoices: Optional[Dict[str, str]] = {}
    defaultNarrator: Optional[str] = "narrator_male"
    language: Optional[str] = "vi"

# --- Endpoints ---

@app.post("/tts/generate")
async def generate_tts(request: TtsRequest):
    try:
        temp_dir = f"./temp_{uuid.uuid4().hex}"
        os.makedirs(temp_dir, exist_ok=True)
        
        chunk_files = []
        
        # 1. Generate audio for each segment
        for i, seg in enumerate(request.segments):
            if not seg.text.strip():
                continue
                
            chunk_path = f"{temp_dir}/chunk_{i}.mp3"
            
            # Map simplified voice IDs to edge-tts voice IDs if needed
            # In Phase 1 we assume the voice string is already a valid edge_tts voice like 'vi-VN-NamMinhNeural'
            voice = seg.voice
            
            # Rate formatting for edge-tts (e.g. "+0%" or "+10%")
            rate_str = "+0%"
            if seg.speed != 1.0:
                percent = int((seg.speed - 1.0) * 100)
                rate_str = f"+{percent}%" if percent >= 0 else f"{percent}%"
            
            communicate = edge_tts.Communicate(seg.text, voice, rate=rate_str)
            await communicate.save(chunk_path)
            chunk_files.append((chunk_path, seg.pauseAfter))
            
        # 2. Concatenate with pydub
        final_audio = PydubAudioSegment.empty()
        for chunk_path, pause_ms in chunk_files:
            audio = PydubAudioSegment.from_mp3(chunk_path)
            final_audio += audio
            
            # Add pause
            if pause_ms and pause_ms > 0:
                silence = PydubAudioSegment.silent(duration=pause_ms)
                final_audio += silence
                
        # 3. Export
        # Ensure output directory exists
        os.makedirs(os.path.dirname(request.outputPath), exist_ok=True)
        final_audio.export(request.outputPath, format=request.outputFormat)
        
        # Cleanup temp
        for chunk_path, _ in chunk_files:
            os.remove(chunk_path)
        os.rmdir(temp_dir)
        
        return {
            "success": True,
            "duration": len(final_audio) / 1000.0,
            "fileSize": os.path.getsize(request.outputPath),
            "outputUrl": request.outputPath # In real app, this should be an accessible URL
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/audio/preprocess")
async def preprocess_text(request: PreprocessRequest):
    # Basic logic: Strip HTML, split by paragraphs, then split long sentences
    content = request.content
    
    # Very basic HTML strip
    content = re.sub(r'<[^>]+>', '\n', content)
    paragraphs = [p.strip() for p in content.split('\n') if p.strip()]
    
    segments = []
    idx = 0
    
    for p in paragraphs:
        # Simple dialog detection: text wrapped in quotes
        # This is a naive implementation for Phase 1 MVP
        if p.startswith('"') and p.endswith('"'):
            # It's a dialog
            speaker = "unknown"
            voice = request.defaultNarrator # Default fallback
            
            segments.append({
                "index": idx,
                "type": "dialog",
                "text": p,
                "voice": voice,
                "speaker": speaker,
                "speed": 1.0,
                "pauseAfter": 800
            })
        else:
            # It's narration
            segments.append({
                "index": idx,
                "type": "narration",
                "text": p,
                "voice": request.defaultNarrator,
                "speed": 1.0,
                "pauseAfter": 800
            })
        idx += 1
        
    return {
        "segments": segments,
        "totalSegments": len(segments),
        "estimatedDuration": len(segments) * 5 # Naive estimate: 5s per segment
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
