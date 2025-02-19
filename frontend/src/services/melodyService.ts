import axios from 'axios';

interface MelodyParams {
  key: string;
  tempo: number;
  style: string;
  mood: string;
}

interface MelodyResponse {
  melody_notes: string[];
  midi_data: string;
}

export const generateMelody = async (params: MelodyParams): Promise<MelodyResponse> => {
  try {
    const response = await axios.post('/.netlify/functions/generate_melody', params);
    return response.data;
  } catch (error) {
    console.error('Error generating melody', error);
    throw error;
  }
};
