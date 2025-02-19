from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from music21 import scale
import random

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MelodyRequest(BaseModel):
    key: str
    tempo: int
    style: str
    mood: str

class MelodyResponse(BaseModel):
    melody_notes: list
    midi_data: str

def get_scale_notes(key: str) -> list:
    # Create a major scale based on the key
    major_scale = scale.MajorScale(key)
    return [str(p) for p in major_scale.getPitches()[:8]]

def get_mood_rhythm(mood: str) -> list:
    rhythms = {
        'Happy': ['4th', '8th', '8th', '4th', '4th'],
        'Sad': ['2nd', '4th', '4th', '2nd'],
        'Energetic': ['8th', '8th', '8th', '8th', '16th', '16th', '4th'],
        'Calm': ['2nd', '2nd', '1st'],
        'Mysterious': ['4th.', '8th', '2nd', '4th'],
        'Epic': ['4th', '4th', '4th', '8th', '8th', '2nd']
    }
    return rhythms.get(mood, ['4th', '4th', '4th', '4th'])

@app.post("/generate-melody")
def generate_melody(request: MelodyRequest) -> MelodyResponse:
    try:
        # Get the scale notes for the selected key
        notes = get_scale_notes(request.key)
        rhythm = get_mood_rhythm(request.mood)
        
        # Generate a melody using the scale notes and rhythm
        melody_length = 8  # Generate 8 notes
        melody = []
        
        for _ in range(melody_length):
            note = random.choice(notes)
            melody.append(note)
        
        return MelodyResponse(
            melody_notes=melody,
            midi_data=""  # For now, we're not generating MIDI data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # Generate base melody
    melody_notes = []
    for _ in range(16):  # 16 notes
        note_obj = note.Note(key_scale.pitches[np.random.randint(0, len(key_scale.pitches))])
        note_obj.quarterLength = np.random.choice([0.5, 1, 2])  # Varied note lengths
        melody_notes.append(str(note_obj))
    
    return MelodyResponse(
        melody_notes=melody_notes,
        midi_data=""  # Placeholder for MIDI generation
    )

@app.post("/generate-melody")
async def create_melody(request: MelodyRequest):
    try:
        return generate_melody(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
