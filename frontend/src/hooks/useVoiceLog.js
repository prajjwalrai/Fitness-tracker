import { useState, useCallback, useRef, useEffect } from 'react';

const useVoiceLog = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedFood, setParsedFood] = useState(null);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setParsedFood(parseVoiceInput(text));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setParsedFood(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, transcript, parsedFood, supported, startListening, stopListening };
};

// Simple NLP parser: "log 200g chicken breast" → { quantity: "200g", food: "chicken breast" }
const parseVoiceInput = (text) => {
  const lower = text.toLowerCase().trim();
  
  // Remove "log", "add", "track" prefixes
  const cleaned = lower.replace(/^(log|add|track|record|save)\s+/i, '');
  
  // Try to extract quantity (e.g., "200g", "2 cups", "1 serving")
  const quantityMatch = cleaned.match(/^(\d+\.?\d*\s*(?:g|kg|oz|ml|l|cups?|servings?|pieces?|slices?|tbsp|tsp)?)\s+/i);
  
  if (quantityMatch) {
    const quantity = quantityMatch[1].trim();
    const food = cleaned.slice(quantityMatch[0].length).trim();
    return { quantity, food, raw: text };
  }
  
  return { quantity: '1 serving', food: cleaned, raw: text };
};

export default useVoiceLog;
