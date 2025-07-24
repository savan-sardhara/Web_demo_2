// src/components/PlaceableModel.js
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useGesture } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/three';

export default function PlaceableModel({ modelUrl }) {
  const { scene } = useGLTF(modelUrl);
  
  // --- CHANGE 1: CREATE REFS TO "REMEMBER" STATE ---
  // These refs will store the last committed position and rotation
  // between gestures, solving the "one-time rotation" bug.
  const lastPosition = useRef([0, 0, -1.2]);
  const lastRotation = useRef([0, 0, 0]);

  // The spring now just handles the smooth animation.
  const [{ position, rotation }, api] = useSpring(() => ({
    position: lastPosition.current,
    rotation: lastRotation.current,
    config: { mass: 1, friction: 30, tension: 220 },
  }));

  useGesture(
    {
      onDrag: ({ active, movement: [mx, my], touches, event }) => {
        event.stopPropagation();

        // --- TWO-FINGER ROTATION LOGIC (NOW ADDITIVE) ---
        if (touches === 2) {
          const rotationSensitivity = 0.01;
          const newRotation = [
            lastRotation.current[0] - my * rotationSensitivity,
            lastRotation.current[1] + mx * rotationSensitivity,
            lastRotation.current[2]
          ];
          api.start({ rotation: newRotation });
        }
        
        // --- ONE-FINGER DRAG LOGIC (NOW ADDITIVE) ---
        else if (touches === 1) {
          const dragSensitivity = 250;
          const newPosition = [
            lastPosition.current[0] + mx / dragSensitivity,
            lastPosition.current[1] - my / dragSensitivity,
            lastPosition.current[2]
          ];
          api.start({ position: newPosition });
        }

        // --- CHANGE 2: COMMIT THE STATE WHEN THE GESTURE ENDS ---
        // When the user lifts their fingers (`active` is false), we update
        // our refs with the final position and rotation from the spring.
        // This is the key to making the next gesture start from the correct place.
        if (!active) {
          lastPosition.current = position.get();
          lastRotation.current = rotation.get();
        }
      },
    },
    {
      target: window,
    }
  );

  return (
    <animated.group
      position={position}
      rotation={rotation}
    >
      <primitive object={scene.clone()} scale={0.25} />
    </animated.group>
  );
}