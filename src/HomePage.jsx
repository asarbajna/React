import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import confetti from 'canvas-confetti'; // <-- Add this line
import './HomePage.css';

function HomePage() {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [fullAnswer, setFullAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false); // <-- Add this line
  const audioRef = useRef(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setAnswer('');
    setFullAnswer('');
    setIsTyping(false);
    try {
      const response = await fetch('http://localhost:8080/ai/test/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();
      setFullAnswer(data.answer);
    } catch (error) {
      setFullAnswer('❌ Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setAnswer('');
    setFullAnswer('');
    setIsTyping(false);
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  // Show congratulation popup and confetti when answer is fully typed
  // ...existing code...
  useEffect(() => {
    if (!fullAnswer) return;
//start from index = -1
    let index = -1;
    setIsTyping(true);
    setAnswer('');
    const interval = setInterval(() => {
      setAnswer((prev) => prev + fullAnswer.charAt(index));
      if (audioRef.current && fullAnswer.charAt(index)) {
        try {
          audioRef.current.play();
        } catch (err) {
          console.warn('Audio playback failed:', err);
        }
      }
      index++;
      if (index >= fullAnswer.length) {
        clearInterval(interval);
        setIsTyping(false);
        // Show congratulation popup and confetti
        setShowCongrats(true);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => setShowCongrats(false), 2000);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [fullAnswer]);
// ...existing code...

  return (
    <div className="homepage">
      <audio ref={audioRef} src="/type-sound.mp3" preload="auto" />
      <div className="bubble">💬 Ask me anything</div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Thinking...' : 'Ask'}
        </button>
        <button onClick={handleVoiceInput}>🎤</button>
        <button onClick={handleClear}>🧹</button>
      </div>

      {answer && (
        <div className="response">
          <h3>🧠 AI Answer:</h3>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {answer}
          </ReactMarkdown>
          {isTyping && <span className="cursor">▌</span>}
        </div>
      )}

      {showCongrats && (
        <div className="congrats-popup">
          <div className="congrats-content">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>Your answer is ready!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;