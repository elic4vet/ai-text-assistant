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
    <div className="flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 items-center justify-center min-h-screen p-4">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-slate-800 mb-2">AI Text Assistant</h1>
        <p className="text-slate-600">Improve your writing with AI-powered suggestions</p>
      </div>

      <div className="w-full max-w-3xl">
        <div className="mb-6">
          <textarea
            id="text-field"
            className="w-full h-48 border-2 border-slate-300 rounded-xl p-4 resize-none outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
            placeholder="Enter or paste your text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:brightness-110"
            onClick={() => generateContent('checker')}
            disabled={loading}
          >
            {loading && activeMode === 'checker' ? 'Checking...' : 'Spell Check'}
          </button>
          <button
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:brightness-110"
            onClick={() => generateContent('improver')}
            disabled={loading}
          >
            {loading && activeMode === 'improver' ? 'Analyzing...' : 'AI Text Improvement'}
          </button>
          <button
            className="bg-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:brightness-110"
            onClick={() => {
              setInput('');
              setOutput('');
              setError('');
              setActiveMode(null);
            }}
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 text-red-700 rounded-xl shadow-sm">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {output && (
          <div className="p-6 border-2 border-slate-200 rounded-xl bg-white shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-slate-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {activeMode === 'checker' ? 'Spelling & Grammar Check' : 'Improvement Recommendations'}
            </h3>
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">{output}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;