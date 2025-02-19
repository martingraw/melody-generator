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
    console.log('Sending request with params:', params);
    const response = await axios.post('/.netlify/functions/generate-melody', params);
    console.log('Received response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error generating melody:', error.response?.data || error.message);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to generate melody. Please check the console for details.');
  }
};
