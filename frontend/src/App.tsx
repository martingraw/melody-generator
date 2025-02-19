import React, { useState } from 'react';
import { generateMelody } from './services/melodyService';
import './App.css';

// Add type definition for the global Tone object
declare global {
  interface Window {
    Tone: any;
  }
}

const MUSICAL_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const STYLES = ['Classical', 'Jazz', 'Pop', 'Rock', 'Electronic', 'Folk'];
const MOODS = ['Happy', 'Sad', 'Energetic', 'Calm', 'Mysterious', 'Epic'];

const App: React.FC = () => {
  const [melodyParams, setMelodyParams] = useState({
    key: 'C',
    tempo: 120,
    style: 'Pop',
    mood: 'Happy'
  });

  const [generatedMelody, setGeneratedMelody] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playMelody = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    try {
      // Create a rich, cinematic organ sound using FM synthesis
      const reverb = new window.Tone.Reverb({
        decay: 2.5,    // Shorter decay
        wet: 0.25      // Less wet/dry mix
      }).toDestination();

      const delay = new window.Tone.FeedbackDelay({
        delayTime: 0.25,  // Slightly faster delay
        feedback: 0.15,   // Less feedback
        wet: 0.15        // Less delay in the mix
      }).connect(reverb);

      // Create a balanced EQ
      const eq = new window.Tone.EQ3({
        low: 2,    // Slight bass boost
        mid: 0,    // Flat mids
        high: -2   // Slightly reduced highs for warmth
      }).connect(delay);

      const synth = new window.Tone.PolySynth(window.Tone.FMSynth, {
        harmonicity: 1.5,     // Reduced for a deeper sound
        modulationIndex: 2,    // Reduced for less brightness
        oscillator: {
          type: "sine"
        },
        envelope: {
          attack: 0.4,        // Slower attack for smoother start
          decay: 0.6,        // Longer decay
          sustain: 0.9,      // Higher sustain level
          release: 2.0       // Longer release for more sustain
        },
        modulation: {
          type: "triangle"    // Changed to triangle for a softer tone
        },
        modulationEnvelope: {
          attack: 0.8,
          decay: 0.2,
          sustain: 0.5,
          release: 0.8
        }
      }).connect(eq);
      
      // Adjust the volume
      synth.volume.value = -8;
      await window.Tone.start();
      
      const startTime = window.Tone.now();
      let time = startTime;
      
      // Calculate note duration based on tempo (in seconds)
      // Multiply by 1.5 to make notes longer than standard duration
      const noteDuration = (60 / melodyParams.tempo) * 1.5;
      
      // Add slight overlap between notes for smoother transitions
      const overlapFactor = 0.1; // 10% overlap
      
      generatedMelody.forEach((note, index) => {
        // Schedule each note to play
        synth.triggerAttackRelease(note, noteDuration, time);
        time += noteDuration * (1 - overlapFactor); // Slightly overlap notes
      });

      // Reset playing state after melody finishes (account for release time)
      const totalDuration = (noteDuration * generatedMelody.length * (1 - overlapFactor)) + 2.0; // Add release time
      setTimeout(() => {
        setIsPlaying(false);
      }, totalDuration * 1000);
    } catch (error) {
      console.error('Error playing melody:', error);
      setError('Failed to play melody. Please try again.');
      setIsPlaying(false);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateMelody(melodyParams);
      setGeneratedMelody(result.melody_notes);
    } catch (error) {
      setError('Failed to generate melody. Please try again.');
      console.error('Melody generation failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="melody-generator">
      <h1>🎵 MelodyMind</h1>
      <div className="controls">
        <div className="control-group">
          <label>Key</label>
          <select 
            value={melodyParams.key} 
            onChange={(e) => setMelodyParams({...melodyParams, key: e.target.value})}
          >
            {MUSICAL_KEYS.map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Tempo (BPM)</label>
          <input 
            type="number" 
            min="40"
            max="200"
            value={melodyParams.tempo} 
            onChange={(e) => setMelodyParams({...melodyParams, tempo: parseInt(e.target.value)})}
          />
        </div>

        <div className="control-group">
          <label>Style</label>
          <select
            value={melodyParams.style}
            onChange={(e) => setMelodyParams({...melodyParams, style: e.target.value})}
          >
            {STYLES.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Mood</label>
          <select
            value={melodyParams.mood}
            onChange={(e) => setMelodyParams({...melodyParams, mood: e.target.value})}
          >
            {MOODS.map(mood => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>
        </div>
      </div>

      <button 
        onClick={handleGenerate}
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : '✨ Generate Melody'}
      </button>

      {error && <div className="error">{error}</div>}

      <div className="melody-display">
        {isLoading ? (
          <div className="loading">Creating your melody...</div>
        ) : generatedMelody.length > 0 ? (
          <>
            <div className="notes-container">
              {generatedMelody.map((note, index) => (
                <span key={index} className="note">{note}</span>
              ))}
            </div>
            <button 
              onClick={playMelody}
              disabled={isPlaying}
              className="play-button"
            >
              {isPlaying ? '🎵 Playing...' : '▶️ Play Melody'}
            </button>
          </>
        ) : (
          <div className="loading">Your melody will appear here</div>
        )}
      </div>
    </div>
  );
};

export default App;
