import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  MeshTransmissionMaterial,
  Float,
  Text,
  // CameraControls,
} from "@react-three/drei";
// import { useControls } from "leva";
// import { Perf } from "r3f-perf";
import {
  EffectComposer,
  N8AO,
  TiltShift2,
  Bloom,
} from "@react-three/postprocessing";
// import { easing } from "maath";
import TWEEN from "@tweenjs/tween.js";

export default function Hero3D({ hoveredLink }) {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 0], fov: 50 }}>
        <color attach="background" args={["#2F2F37"]} />

        <Groups3D link={hoveredLink} />

        {/* <CameraControls />
         <axesHelper /> */}
        {/* <Perf position="top-left" /> */}

        {/* <Rig /> */}

        <EffectComposer disableNormalPass>
          <N8AO aoRadius={1} intensity={2} />
          <TiltShift2 blur={0.2} />
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.2} height={300} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

// Moove camera cursor position
/* 
function Rig() {
  useFrame((state, delta) => {
    const { camera, pointer } = state;

    easing.damp3(
      camera.position,
      [
        Math.sin(-pointer.x / 3) * 2,
        Math.sin(-pointer.y / 3) * 2,
        Math.cos(pointer.x / 3) * 5,
      ],
      0.2,
      delta
    );
    camera.lookAt(0, 0, 0);
  });
} */

export function Groups3D(link) {
  const objectsGroupRef = useRef(null);
  let objRota;
  useFrame(() => {
    TWEEN.update();
  });

  if (objectsGroupRef.current !== null) {
    function HandleHomeObject(rota) {
      new TWEEN.Tween(objectsGroupRef.current.rotation)
        .to(new THREE.Vector3(0, rota, 0), 1500)
        .easing(TWEEN.Easing.Elastic.Out)
        .start();
    }

    if (link.link === "Home") {
      objRota = 0;
    } else if (link.link === "Projects") {
      objRota = Math.PI / 2;
    } else if (link.link === "About") {
      objRota = Math.PI;
    } else if (link.link === "Contact") {
      objRota = Math.PI / -2;
    }

    HandleHomeObject(objRota);
  }

  return (
    <group ref={objectsGroupRef}>
      <Object3D
        link={"Home"}
        objectIndex={0}
        position={[0, 0, -25]}
        rotation={[0, 0, 0]}
      />
      <Object3D
        link={"Projects"}
        objectIndex={1}
        position={[25, 0, 0]}
        rotation={[0, Math.PI / -2, 0]}
      />
      <Object3D
        link={"About"}
        objectIndex={2}
        position={[0, 0, 25]}
        rotation={[0, Math.PI, 0]}
      />
      <Object3D
        link={"Contact"}
        objectIndex={3}
        position={[-25, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}

export function Object3D(objectInfo) {
  const { link, objectIndex, position, rotation } = objectInfo;
  const { nodes } = useGLTF("/3DObjects.glb");

  const geom = [
    nodes.home.geometry,
    nodes.projects.geometry,
    nodes.about.geometry,
    nodes.contact.geometry,
  ];

  return (
    <group position={position} rotation={rotation}>
      <Float floatIntensity={5}>
        <mesh geometry={geom[objectIndex]} scale={3} position={[0, 0, 0]}>
          <MeshTransmissionMaterial
            samples={10}
            ior={1.2}
            thickness={2}
            anisotropy={0.1}
            chromaticAberration={0.04}
          />
        </mesh>
      </Float>
      <Status hoveredLink={link} />
    </group>
  );
}

function Status({ hoveredLink }) {
  return (
    <group position={[0, 0, -5]}>
      <Text fontSize={14} color="#fbfefb">
        {hoveredLink}
      </Text>
    </group>
  );
}
