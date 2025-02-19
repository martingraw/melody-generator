import json
import random

def log_error(error_msg):
    print(f"Error in generate_melody: {error_msg}")

def get_scale_notes(key: str) -> list:
    # Simplified scale generation without music21
    scales = {
        'C': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
        'G': ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'],
        'D': ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'],
        'A': ['A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G#5', 'A5'],
        'E': ['E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D#5', 'E5'],
        'F': ['F4', 'G4', 'A4', 'Bb4', 'C5', 'D5', 'E5', 'F5']
    }
    return scales.get(key, scales['C'])

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
        # Log the incoming event
        print(f"Received event: {event}")
        
        # Handle OPTIONS request for CORS
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': ''
            }
        
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        key = body.get('key', 'C')
        mood = body.get('mood', 'Happy')
        
        print(f"Generating melody with key: {key}, mood: {mood}")
        
        # Get the scale notes for the selected key
        notes = get_scale_notes(key)
        rhythm = get_mood_rhythm(mood)
        
        # Generate a melody using the scale notes and rhythm
        melody_length = 8  # Generate 8 notes
        melody = []
        
        for _ in range(melody_length):
            note = random.choice(notes)
            melody.append(note)
        
        print(f"Generated melody: {melody}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'melody_notes': melody,
                'rhythm': rhythm
            })
        }
    except Exception as e:
        error_msg = str(e)
        log_error(error_msg)
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'error': error_msg
            })
        }
