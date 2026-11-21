import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Robust Hook for Web Speech API Speech Recognition
 * Supports Hindi (hi-IN) and English (en-IN / en-US) with real-time interim results,
 * detailed error reporting, and resilient lifecycle management.
 *
 * @param {Object} options
 * @param {string} [options.lang='hi-IN'] - Primary language code
 * @param {Function} [options.onResult] - Called with final transcribed text
 * @param {Function} [options.onInterim] - Called with live in-progress speech text
 * @param {Function} [options.onError] - Called when a microphone/speech error occurs
 */
export function useVoice({
  lang = 'hi-IN',
  onResult = () => {},
  onInterim = () => {},
  onError = () => {}
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [interimText, setInterimText] = useState('');

  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  const onInterimRef = useRef(onInterim);
  const onErrorRef = useRef(onError);

  // Keep callback refs updated to avoid re-instantiating SpeechRecognition on every render
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    onInterimRef.current = onInterim;
  }, [onInterim]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Initialize SpeechRecognition once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Handle language setting (support hi-IN, en-IN, en-US)
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
        setInterimText('');
      };

      recognition.onresult = (event) => {
        let interimStr = '';
        let finalStr = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const transcript = item[0].transcript;
          if (item.isFinal) {
            finalStr += transcript;
          } else {
            interimStr += transcript;
          }
        }

        if (interimStr) {
          setInterimText(interimStr);
          onInterimRef.current(interimStr);
        }

        if (finalStr) {
          setInterimText('');
          onResultRef.current(finalStr.trim());
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setInterimText('');
        let userFriendlyMsg = '';

        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            userFriendlyMsg = lang === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।'
              : 'Microphone permission blocked. Please allow mic access in your browser.';
            break;
          case 'no-speech':
            userFriendlyMsg = lang === 'hi'
              ? 'आवाज़ सुनाई नहीं दी। कृपया माइक दबाकर दोबारा बोलें।'
              : 'No speech detected. Please tap mic and speak clearly.';
            break;
          case 'network':
            userFriendlyMsg = lang === 'hi'
              ? 'नेटवर्क समस्या के कारण आवाज़ नहीं पहचानी जा सकी।'
              : 'Network error during speech recognition.';
            break;
          case 'audio-capture':
            userFriendlyMsg = lang === 'hi'
              ? 'माइक्रोफ़ोन नहीं मिला या व्यस्त है।'
              : 'No microphone found or device is busy.';
            break;
          default:
            userFriendlyMsg = event.message || 'Speech recognition error';
        }

        setErrorMessage(userFriendlyMsg);
        onErrorRef.current(userFriendlyMsg, event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } catch {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort errors
        }
      }
    };
  }, [lang]);

  // Start speech recognition safely
  const startListening = useCallback(() => {
    setErrorMessage(null);
    if (!recognitionRef.current) {
      const err = lang === 'hi'
        ? 'आपके ब्राउज़र में आवाज़ पहचान (Web Speech API) समर्थित नहीं है।'
        : 'Speech recognition is not supported in this browser.';
      setErrorMessage(err);
      onErrorRef.current(err, 'unsupported');
      return;
    }

    try {
      recognitionRef.current.lang = lang;
      recognitionRef.current.start();
    } catch (err) {
      // If already started, restart it
      if (err.name === 'InvalidStateError') {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch {
              // ignore
            }
          }, 150);
        } catch {
          // ignore
        }
      } else {
        setIsListening(false);
      }
    }
  }, [lang]);

  // Stop speech recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setInterimText('');
  }, []);

  return {
    isListening,
    isSupported,
    interimText,
    errorMessage,
    startListening,
    stopListening
  };
}

export default useVoice;
