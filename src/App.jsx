import { useState } from 'react'
import './App.css'
import Checker from './components/Checker'
import Rephraser from './components/Rephraser'

function App() {
  const [count, setCount] = useState(0)
  const [activeComponent, setActiveComponent] = useState(null)

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-4xl font-bold mb-4">Ai text assistant</h1>
        <div className="flex-grow">
          <button className='bg-rose-600 text-white font-bold py-2 px-4 rounded hover:bg-rose-700 transition'>
            <a href="#text-field" className="text-white">Get Started</a>
          </button>
          <div className="flex flex-col items-center justify-center">
            <div id="text-field" className="text-field w-full max-w-md h-32 border border-gray-300 rounded p-2">
              <textarea
                className="w-full h-full resize-none outline-none"
                placeholder="Enter or paste text here..."
              ></textarea>
            </div>
            <button
              className="bg-sky-200 text-white font-bold py-2 px-4 rounded hover:bg-sky-400 transition"
              onClick={() => setActiveComponent('checker')}
            >
              Checker
            </button>
            <button
              className="bg-purple-200 text-white font-bold py-2 px-4 rounded hover:bg-purple-400 transition"
              onClick={() => setActiveComponent('rephraser')}
            >
              Ai Rephraser
            </button>

            {activeComponent === 'checker' && <Checker />}
            {activeComponent === 'rephraser' && <Rephraser />}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
