import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { Client } from 'colyseus.js';
import './TonkRoom.css'

const TonkRoom = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<THREE.Mesh>();
  const joinedRoomRef = useRef(false); // useRef to persist joined state

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    const container = mountRef.current;
    if (!container) return;

    container.appendChild(renderer.domElement);

    // Set renderer size to match the container
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();

    // Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cubeRef.current = cube;
    scene.add(cube);

    //timing
    let lastTime = (new Date()).getTime();


    //setup colyseus joining the game
    const client = new Client('ws://localhost:2567');
    if (!joinedRoomRef.current) {
      client.joinOrCreate("Tonk_Room").then(room => {
        joinedRoomRef.current = true; // set the flag once joined
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
        //silence the playground error message
        room.onMessage('__playground_message_types', (message) => {
          console.log('Received a message for Colyseus development tools:', message);
        });

      }).catch(e => {
        console.log("join error", e);
      });
    }

      // Update function
      const update = (deltaTime: number) => {
        // Update your game state (e.g., cube rotation) here
        if (cubeRef.current) {
          cubeRef.current.rotation.x += deltaTime * 0.001;
          cubeRef.current.rotation.y += deltaTime * 0.001;
        }
      };

      // Render function
      const render = () => {
        renderer.render(scene, camera);
      };

      // Animation
      const animate = function () {
        requestAnimationFrame(animate);

        const currentTime = (new Date()).getTime();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        update(deltaTime);
        render();
      };

      // Start the animation
      animate();

      // Handle window resizing
      window.addEventListener('resize', () => {
        if (mountRef.current) {
            const { clientWidth, clientHeight } = mountRef.current;
            renderer.setSize(clientWidth, clientHeight);
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
          }
      });

      // Clean up on unmount
      return () => {
        mountRef.current?.removeChild(renderer.domElement);
        //leave room when the component unmounts
      };

    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default TonkRoom;
