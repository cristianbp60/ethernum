/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.11 --types --keepnames --keepgroups --keepmeshes --transform --precision 6 public/models/realm-landscape.glb 
Files: public/models/realm-landscape.glb [164.18KB] > realm-landscape-transformed.glb [172.77KB] (-5%)
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { Sparkles, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useControls } from "leva";

type GLTFResult = GLTF & {
  nodes: {
    rivers_small: THREE.Mesh;
    ocean_small: THREE.Mesh;
    forest_small: THREE.Mesh;
    Cone001: THREE.Mesh;
    Cone001_1: THREE.Mesh;
    Cone001: THREE.Mesh;
    Cone001_1: THREE.Mesh;
    Plane006: THREE.Mesh;
    Plane006_1: THREE.Mesh;
    Plane006_2: THREE.Mesh;
    Plane006_3: THREE.Mesh;
    Plane006_4: THREE.Mesh;
    Plane006_5: THREE.Mesh;
    Plane006_6: THREE.Mesh;
    Cylinder001: THREE.Mesh;
    Cone002: THREE.Mesh;
    Cone002_1: THREE.Mesh;
    Cone: THREE.Mesh;
    Cone_1: THREE.Mesh;
  };
  materials: {
    PaletteMaterial001: THREE.MeshPhysicalMaterial;
    PaletteMaterial003: THREE.MeshStandardMaterial;
    PaletteMaterial004: THREE.MeshStandardMaterial;
    PaletteMaterial002: THREE.MeshStandardMaterial;
    PaletteMaterial006: THREE.MeshStandardMaterial;
    PaletteMaterial007: THREE.MeshStandardMaterial;
    PaletteMaterial005: THREE.MeshStandardMaterial;
    PaletteMaterial008: THREE.MeshStandardMaterial;
    PaletteMaterial009: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>>;

const RealmLandscape = (props: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF("/models/realm-landscape-transformed.glb") as GLTFResult;

  const { color, roughness, metalness, reflectivity, clearcoat, clearcoatRoughness, opacity } = useControls({
    color: "#28374e",
    roughness: 0.23,
    metalness: 0.2,
    reflectivity: 0.8,
    opacity: 0.98,
    clearcoat: 1,
    clearcoatRoughness: 0,
  });

  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="rivers_small"
          geometry={nodes.rivers_small.geometry}
          position={[2.455429, 1.826893, -3.053192]}
          scale={35}
        >
          <meshPhysicalMaterial
            attach="material"
            color={color}
            transparent
            opacity={opacity}
            roughness={roughness}
            metalness={metalness}
            reflectivity={reflectivity}
            clearcoat={clearcoat}
            clearcoatRoughness={clearcoatRoughness}
          />
        </mesh>
        <mesh
          name="ocean_small"
          geometry={nodes.ocean_small.geometry}
          position={[-2.583561, 1.317971, -2.678211]}
          scale={[3.574031, 0.03574, 3.574031]}
        >
          <meshPhysicalMaterial
            attach="material"
            color={color}
            transparent
            opacity={opacity}
            roughness={roughness}
            metalness={metalness}
            reflectivity={reflectivity}
            clearcoat={clearcoat}
            clearcoatRoughness={clearcoatRoughness}
          />
        </mesh>
        <mesh
          name="forest_small"
          castShadow
          geometry={nodes.forest_small.geometry}
          material={materials.PaletteMaterial003}
        />
        <group
          name="deciduous-tree189"
          castShadow
          position={[494.866547, 4.604025, 284.570831]}
          rotation={[0, -0.79251, 0]}
          scale={[0.602762, 0.776755, 0.602762]}
        >
          <mesh castShadow name="Cone001" geometry={nodes.Cone001.geometry} material={materials.PaletteMaterial003} />
          <mesh
            castShadow
            name="Cone001_1"
            geometry={nodes.Cone001_1.geometry}
            material={materials.PaletteMaterial004}
          />
        </group>
        <group
          name="deciduous-tree190"
          castShadow
          position={[497.886841, 4.604025, 285.281494]}
          rotation={[Math.PI, -1.275876, Math.PI]}
          scale={[0.602762, 0.776755, 0.602762]}
        >
          <mesh castShadow name="Cone001" geometry={nodes.Cone001.geometry} material={materials.PaletteMaterial003} />
          <mesh
            castShadow
            name="Cone001_1"
            geometry={nodes.Cone001_1.geometry}
            material={materials.PaletteMaterial004}
          />
        </group>
        <group receiveShadow name="terrain_small">
          <mesh
            receiveShadow
            name="Plane006"
            geometry={nodes.Plane006.geometry}
            material={materials.PaletteMaterial002}
          />
          <mesh
            receiveShadow
            name="Plane006_1"
            geometry={nodes.Plane006_1.geometry}
            material={materials.PaletteMaterial006}
          />
          <mesh
            receiveShadow
            name="Plane006_2"
            geometry={nodes.Plane006_2.geometry}
            material={materials.PaletteMaterial007}
          />
          <mesh
            receiveShadow
            name="Plane006_3"
            geometry={nodes.Plane006_3.geometry}
            material={materials.PaletteMaterial005}
          />
          <mesh
            receiveShadow
            name="Plane006_4"
            geometry={nodes.Plane006_4.geometry}
            material={materials.PaletteMaterial008}
          />
          <mesh
            receiveShadow
            name="Plane006_5"
            geometry={nodes.Plane006_5.geometry}
            material={materials.PaletteMaterial005}
          />
          <mesh
            receiveShadow
            name="Plane006_6"
            geometry={nodes.Plane006_6.geometry}
            material={materials.PaletteMaterial009}
          />
        </group>
        <instancedMesh
          castShadow
          args={[nodes.Cylinder001.geometry, materials.PaletteMaterial002, 35]}
          name="Cylinder001"
          instanceMatrix={nodes.Cylinder001.instanceMatrix}
        />
        <group>
          <instancedMesh
            castShadow
            args={[nodes.Cone002.geometry, materials.PaletteMaterial003, 244]}
            name="Cone002"
            instanceMatrix={nodes.Cone002.instanceMatrix}
          />
          <instancedMesh
            castShadow
            args={[nodes.Cone002_1.geometry, materials.PaletteMaterial004, 244]}
            name="Cone002_1"
            instanceMatrix={nodes.Cone002_1.instanceMatrix}
          />
        </group>
        <group>
          <instancedMesh
            castShadow
            args={[nodes.Cone.geometry, materials.PaletteMaterial005, 76]}
            name="Cone"
            instanceMatrix={nodes.Cone.instanceMatrix}
          />
          <instancedMesh
            castShadow
            args={[nodes.Cone_1.geometry, materials.PaletteMaterial004, 76]}
            name="Cone_1"
            instanceMatrix={nodes.Cone_1.instanceMatrix}
          />
        </group>
      </group>
    </group>
  );
};

useGLTF.preload("/models/realm-landscape-transformed.glb");

export default RealmLandscape;
