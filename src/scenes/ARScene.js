// src/scenes/ARScene.js
import { createXRStore, XR } from '@react-three/xr';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import PlaceableModel from '../components/PlaceableModel';

const store = createXRStore();

/**
 * This component now just renders the single interactive model.
 * All hit-test and placement logic has been removed.
 */
function ARContent({ selectedModelUrl }) {
  return (
    <>
      {/* We only render one PlaceableModel. */}
      {/* It will appear at a default position and be ready to drag. */}
      <PlaceableModel modelUrl={selectedModelUrl} />
    </>
  );
}

export default function ARScene({ modelUrl }) {
  return (
    <>
      <button
        style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', zIndex: 10 }}
        onClick={() => store.enterAR()} // We don't need to request any features anymore
      >
        Enter AR
      </button>

      <Canvas onCreated={({ gl }) => { gl.xr.enabled = true; }}>
        <XR store={store}>
          <Suspense fallback={null}>
            <ambientLight intensity={1.5} />
            {/* We pass the modelUrl directly to our ARContent component. */}
            <ARContent selectedModelUrl={modelUrl} />
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
}