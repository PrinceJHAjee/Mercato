import React, { useState } from 'react';

const VoiceSearchButton = ({ isDarkMode, onSearch }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const searchTerm = event.results[0][0].transcript;
      onSearch(searchTerm);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <button
      onClick={handleVoiceSearch}
      className={`voice-search-button ${isListening ? 'listening' : ''} ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      disabled={isListening}
    >
      {isDarkMode ? (
        <i className="ri-mic-line"></i> // Dark mode icon
      ) : (
        <i className="ri-mic-fill"></i> // Light mode icon
      )}
    </button>
  );
};

export default VoiceSearchButton;
