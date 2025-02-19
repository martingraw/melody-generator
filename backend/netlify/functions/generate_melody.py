from http.server import BaseHTTPRequestHandler
from music21 import scale
import json
import random

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

def handler(event, context):
    try:
        # Parse request body
        body = json.loads(event['body'])
        key = body.get('key', 'C')
        mood = body.get('mood', 'Happy')
        
        # Get the scale notes for the selected key
        notes = get_scale_notes(key)
        rhythm = get_mood_rhythm(mood)
        
        # Generate a melody using the scale notes and rhythm
        melody_length = 8  # Generate 8 notes
        melody = []
        
        for _ in range(melody_length):
            note = random.choice(notes)
            melody.append(note)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'melody_notes': melody,
                'midi_data': ''
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'error': str(e)
            })
        }
