import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { Client } from 'colyseus.js';

const App = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const client = new Client('ws://localhost:2567');
    client.joinOrCreate("my_room").then(room => {
      console.log("joined successfully", room);
      room.onStateChange.once(state => {
        console.log("initial room state:", state);
      });

      // listen to patches coming from the server
      room.onStateChange((state) => {
        // this signal is triggered on each patch
      });

      // listening to messages sent from the server
      room.onMessage("message_type", (message) => {
        console.log("received message from the server:", message);
      });
    }).catch(e => {
      console.log("join error", e);
    });

    // Animation
    const animate = function () {
      requestAnimationFrame(animate);

      // Rotation
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    // Start the animation
    animate();

    // Handle window resizing
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    // Clean up on unmount
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
    
  }, []);

  return <div ref={mountRef} />;
};

export default App;
