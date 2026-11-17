import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'white' }}>sendham</h1>
      <p style={{ color: '#888' }}>Vite React + TS Web App Starter</p>
      <button onClick={() => setCount(c => c + 1)} style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        Count: {count}
      </button>
    </div>
  );
}
export default App;