// TTS API utility functions

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ownback-production.up.railway.app/api";

/**
 * Generate TTS audio from text using the backend API
 * @param {string} text - The text to convert to speech
 * @param {string} voice - The voice model to use (default: bella)
 * @returns {Promise<string>} - The audio URL
 */
// Update your generateTTS function
export const generateTTS = async (text, voice = "bella") => {
  try {
    const response = await fetch(`${API_BASE_URL}/text-to-speech/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voice: voice
      })
    });

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Check if server TTS is available
    if (data.tts_available && data.audio_url) {
      return data.audio_url; // Server-generated audio
    } else {
      // Fallback to browser TTS
      console.log(data.message || "Using browser TTS fallback");
      return null; // Signal to use browser TTS
    }
  } catch (error) {
    console.error('TTS generation failed:', error);
    throw error;
  }
};

// Update playAudio to handle browser fallback
export const playAudio = async (audioUrl, text = "", voice = "bella") => {
  if (audioUrl) {
    // Use server-generated audio
    return new Promise((resolve, reject) => {
      // Handle relative URLs by making them absolute
      const fullUrl = audioUrl.startsWith('http') ? audioUrl :
        `${API_BASE_URL.replace('/api', '')}${audioUrl}`;

      const audio = new Audio(fullUrl);
      audio.onended = () => resolve(audio);
      audio.onerror = () => reject(new Error('Failed to play audio'));
      audio.play().catch(reject);
    });
  } else {
    // Use browser TTS fallback
    return new Promise((resolve, reject) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to match voice (basic mapping)
        const voices = speechSynthesis.getVoices();
        if (voice.includes('male') || voice.includes('ek1')) {
          const maleVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('alex'));
          if (maleVoice) utterance.voice = maleVoice;
        }
        
        utterance.onend = () => resolve();
        utterance.onerror = () => reject(new Error('Browser TTS failed'));
        
        speechSynthesis.speak(utterance);
      } else {
        reject(new Error('Browser TTS not supported'));
      }
    });
  }
};

// Updated speakText function
export const speakText = async (text, voice = "bella") => {
  try {
    const audioUrl = await generateTTS(text, voice);
    await playAudio(audioUrl, text, voice);
  } catch (error) {
    console.error('Speech failed:', error);
    // Final fallback to basic browser TTS
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      throw error;
    }
  }
};


/**
 * Play audio from URL
 * @param {string} audioUrl - The URL of the audio file (can be relative or absolute)
 * @returns {Promise<HTMLAudioElement>} - The audio element
 */


/**
 * Generate and play TTS audio
 * @param {string} text - The text to convert to speech
 * @param {string} voice - The voice model to use
 * @returns {Promise<void>}
 */
