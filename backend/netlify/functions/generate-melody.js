// Predefined scales and notes
const scales = {
  'C': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  'G': ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'],
  'D': ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'],
  'A': ['A4', 'B4', 'C#5', 'D5', 'E5', 'F#5', 'G#5', 'A5'],
  'E': ['E4', 'F#4', 'G#4', 'A4', 'B4', 'C#5', 'D#5', 'E5'],
  'F': ['F4', 'G4', 'A4', 'Bb4', 'C5', 'D5', 'E5', 'F5']
};

// Predefined rhythms for different moods
const rhythms = {
  'Happy': ['4th', '8th', '8th', '4th', '4th'],
  'Sad': ['2nd', '4th', '4th', '2nd'],
  'Energetic': ['8th', '8th', '8th', '8th', '16th', '16th', '4th'],
  'Calm': ['2nd', '2nd', '1st'],
  'Mysterious': ['4th.', '8th', '2nd', '4th'],
  'Epic': ['4th', '4th', '4th', '8th', '8th', '2nd']
};

// Helper functions
const getScaleNotes = (key) => scales[key] || scales['C'];
const getMoodRhythm = (mood) => rhythms[mood] || rhythms['Happy'];

// Main handler function
exports.handler = async (event, context) => {
  console.log('Received event:', event);

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const key = body.key || 'C';
    const mood = body.mood || 'Happy';

    console.log(`Generating melody with key: ${key}, mood: ${mood}`);

    const notes = getScaleNotes(key);
    const rhythm = getMoodRhythm(mood);
    const melody = Array(8)
      .fill(null)
      .map(() => notes[Math.floor(Math.random() * notes.length)]);

    console.log('Generated melody:', melody);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        melody_notes: melody,
        rhythm: rhythm
      })
    };
  } catch (error) {
    console.error('Error in generate-melody:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
