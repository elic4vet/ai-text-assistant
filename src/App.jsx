import { useState } from 'react';
import './App.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeMode, setActiveMode] = useState(null);

  const generateContent = async (mode) => {
    setError('');
    setOutput('');
    setActiveMode(mode);

    if (!input.trim()) {
      setError('Please enter some text');
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError('API key not found');
      return;
    }

    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
      });

      let prompt;
      if (mode === 'checker') {
        prompt = `Check for spelling and grammar errors in this text. List each error with corrections: ${input}`;
      } else if (mode === 'improver') {
        prompt = `Provide recommendations to improve this text. Include suggestions for clarity, style, tone, and effectiveness: ${input}`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setOutput(text);
    } catch (err) {
      console.error('Error details:', err);

      if (err.message.includes('quota') || err.message.includes('429')) {
        setError('Rate limit exceeded. Please wait a minute and try again.');
      } else {
        setError(`Failed to generate: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">AI Text Assistant</h1>

      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <textarea
            id="text-field"
            className="w-full h-48 border border-gray-300 rounded-lg p-4 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            placeholder="Enter or paste text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            className="flex-1 bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => generateContent('checker')}
            disabled={loading}
          >
            {loading && activeMode === 'checker' ? 'Checking...' : 'Spell Check'}
          </button>
          <button
            className="flex-1 bg-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => generateContent('improver')}
            disabled={loading}
          >
            {loading && activeMode === 'improver' ? 'Analyzing...' : 'AI Text Improvement'}
          </button>
          <button className='reset bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition' onClick={() => { setInput(''); setOutput(''); setError(''); setActiveMode(null); }}>
            Reset
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {output && (
          <div className="p-6 border border-gray-300 rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              {activeMode === 'checker' ? 'Spelling & Grammar Check:' : 'Improvement Recommendations:'}
            </h3>
            <div className="text-gray-700 whitespace-pre-wrap">{output}</div>
          </div>
        )}
      </div>
    </div >
  );
}

export default App;