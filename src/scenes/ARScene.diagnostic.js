// src/scenes/ARScene.diagnostic.js
import { createXRStore, XR, XRHitTest, useXREvent } from '@react-three/xr';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useRef } from 'react';

// NOTE: We are NOT using CubeModel or Drei's Ring here. This is a minimal test.

const store = createXRStore();

/**
 * Diagnostic component to test rendering and hit-testing.
 */
function DiagnosticPlacer() {
  const [placedBoxes, setPlacedBoxes] = useState([]);
  const reticleRef = useRef();

  // This hook listens for a screen tap.
  useXREvent('select', () => {
    // If the reticle is visible (meaning a surface is detected)...
    if (reticleRef.current?.visible) {
      const newPosition = reticleRef.current.position;
      // ...add its position to our array.
      setPlacedBoxes(prev => [...prev, newPosition.clone()]);
    }
  });

  return (
    <>
      {/* 
        DIAGNOSTIC 1: A floating red box.
        This box is placed at a fixed position in front of the camera.
        If you can see this red box when you enter AR, it means the basic 3D rendering is working.
      */}
      <mesh position={[0, 0, -1]} scale={0.2}>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* 
        This component finds a surface and positions the reticle.
      */}
      <XRHitTest
        onHitTestResult={(hitMatrix) => {
          if (reticleRef.current) {
            const position = hitMatrix.getPosition();
            const quaternion = hitMatrix.getQuaternion();
            reticleRef.current.position.copy(position);
            reticleRef.current.quaternion.copy(quaternion);
            reticleRef.current.visible = true;
          }
        }}
        onHitTestError={() => {
          if (reticleRef.current) reticleRef.current.visible = false;
        }}
      >
        {/* The reticle is now a simple, small white box. */}
        <mesh ref={reticleRef} rotation-x={-Math.PI / 2} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.01]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </XRHitTest>

      {/* 
        DIAGNOSTIC 2: Placed green boxes.
        This maps over our array and places a small green box at each position.
        If you can tap on a surface and a green box appears, it means hit-testing AND placement logic are working.
      */}
      {placedBoxes.map((pos, i) => (
        <mesh key={i} position={pos} scale={0.2}>
          <boxGeometry />
          <meshStandardMaterial color="green" />
        </mesh>
      ))}
    </>
  );
}

export default function ARSceneDiagnostic() {
  return (
    <>
      <button
        style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', zIndex: 10 }}
        onClick={() => store.enterAR({ requiredFeatures: ["hit-test"] })}
      >
        Enter AR
      </button>
      <Canvas onCreated={({ gl }) => { gl.xr.enabled = true; }}>
        <XR store={store}>
          <Suspense fallback={null}>
            <ambientLight intensity={1.0} />
            <DiagnosticPlacer />
          </Suspense>
        </XR>
      </Canvas>
    </>
  );
}