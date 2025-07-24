// src/components/CubeModel.js
import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

/**
 * A fallback component to show while the main model is loading.
 * This helps us see if the component itself is rendering, even if the model fails.
 */
function LoadingFallback(props) {
  return (
    <mesh {...props}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color="hotpink" wireframe />
    </mesh>
  );
}

/**
 * The actual component that loads and displays the GLTF model.
 */
function Model(props) {
  // We will try to load the GLTF model from the public folder.
  // Make sure this path is exactly correct.
  const modelPath = '/models/cube/Cube.gltf';
  
  // The useGLTF hook loads the model.
  // It will throw an error if the file is not found, which Suspense will catch.
  const { scene } = useGLTF(modelPath);

  // This log will appear in the browser's developer console if the model loads successfully.
  console.log('GLTF model loaded successfully:', scene);

  // We are creating a clone of the scene. This is good practice to avoid issues
  // when using the same model multiple times.
  return (
    // Render the loaded scene with the specified scale and other props.
    // The scale of 0.2 makes it about the size of a basketball.
    <primitive object={scene.clone()} scale={0.2} {...props} />
  );
}

export default function CubeModel(props) {
  return (
    // Suspense is a React component that lets you "wait" for some code to load.
    // We wrap our model in it.
    // If the <Model> component is still loading (or fails),
    // Suspense will show the `fallback` component instead.
    <Suspense fallback={<LoadingFallback {...props} />}>
      <Model {...props} />
    </Suspense>
  );
}