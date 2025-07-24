// src/App.js
import React, { useState } from 'react';
import ARScene from './scenes/ARScene';

function App() {
  // This state will eventually be controlled by your UI buttons.
  // For now, we default to the duck model.
  const [selectedModel, setSelectedModel] = useState('/models/duck/Duck.gltf');
  
  // Here you could add buttons to change the model, for example:
  // <button onClick={() => setSelectedModel('/models/fish/Fish.gltf')}>Select Fish</button>

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* We pass the chosen model URL as a prop to the ARScene. */}
      <ARScene modelUrl={selectedModel} />
    </div>
  );
}

export default App;