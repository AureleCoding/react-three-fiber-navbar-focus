import { useRef, useState, useEffect } from "react";
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
import { EffectComposer, N8AO, TiltShift2 } from "@react-three/postprocessing";
// import { easing } from "maath";
import TWEEN from "@tweenjs/tween.js";

export default function App() {
  const [hoveredLink, setHoveredLink] = useState("Home");
  const [barStyles, setBarStyles] = useState({});

  useEffect(() => {
    updateBarStyles();
  }, [hoveredLink]);

  function handleMouseEnter(link) {
    setHoveredLink(link);
  }

  function updateBarStyles() {
    const activeLink = document.querySelector(".navigation .nav-active");
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink;
      setBarStyles({
        width: offsetWidth - 30,
        left: offsetLeft + 15,
      });
    }
  }

  return (
    <>
      <nav className="navigation">
        <a
          className={hoveredLink === "Home" ? "nav-active" : ""}
          onMouseEnter={() => handleMouseEnter("Home")}
        >
          Home
        </a>

        <a
          className={hoveredLink === "Projects" ? "nav-active" : ""}
          onMouseEnter={() => handleMouseEnter("Projects")}
        >
          Projects
        </a>

        <a
          className={hoveredLink === "About" ? "nav-active" : ""}
          onMouseEnter={() => handleMouseEnter("About")}
        >
          About
        </a>

        <a
          className={hoveredLink === "Contact" ? "nav-active" : ""}
          onMouseEnter={() => handleMouseEnter("Contact")}
        >
          Contact
        </a>
        <div className="bar" style={barStyles}></div>
      </nav>

      <Canvas
        //Uncomment to active rig
        // eventSource={document.getElementById("root")}
        // eventPrefix="client"
        shadows
        camera={{ position: [0, 0, 0], fov: 50 }}
      >
        <color attach="background" args={["#cfcfcf"]} />

        <Groups3D link={hoveredLink} />

        {/* <CameraControls />
         <axesHelper /> */}
        {/* <Perf position="top-left" /> */}
        {/* <Rig /> */}
        <EffectComposer disableNormalPass>
          <N8AO aoRadius={1} intensity={2} />
          <TiltShift2 blur={0.2} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

function Groups3D({ link }) {
  const objectsGroupRef = useRef();
  useFrame(() => {
    TWEEN.update();
  });

  useEffect(() => {
    function handleHomeObject(rota) {
      new TWEEN.Tween(objectsGroupRef.current.rotation)
        .to(new THREE.Vector3(0, rota, 0), 1500)
        .easing(TWEEN.Easing.Elastic.Out)
        .start();
    }

    let objRota;
    if (link === "Home") {
      objRota = 0;
    } else if (link === "Projects") {
      objRota = Math.PI / 2;
    } else if (link === "About") {
      objRota = Math.PI;
    } else if (link === "Contact") {
      objRota = Math.PI / -2;
    }

    handleHomeObject(objRota);
  }, [link]);

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

function Object3D({ link, objectIndex, position, rotation }) {
  const { nodes } = useGLTF("/3DObjects.glb");

  const geom = [
    nodes.home.geometry.clone(),
    nodes.projects.geometry.clone(),
    nodes.about.geometry.clone(),
    nodes.contact.geometry.clone(),
  ];

  return (
    <group position={position} rotation={rotation}>
      <Float floatIntensity={2}>
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
      <Text fontSize={14} color="black">
        {hoveredLink}
      </Text>
    </group>
  );
}
