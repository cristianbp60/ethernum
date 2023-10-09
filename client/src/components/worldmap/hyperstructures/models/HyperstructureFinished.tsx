/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 --types --keepnames --keepgroups --keepmeshes --transform public/models/hyperstructure-finished.glb 
Files: public/models/hyperstructure-finished.glb [133.63KB] > hyperstructure-finished-transformed.glb [78.06KB] (42%)
*/

import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    tower: THREE.Mesh;
    tower_1: THREE.Mesh;
    tower_2: THREE.Mesh;
    tower_3: THREE.Mesh;
  };
  materials: {
    Stone: THREE.MeshStandardMaterial;
    Gold: THREE.MeshStandardMaterial;
    Grass: THREE.MeshStandardMaterial;
    Foilage: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>>;

export default function HyperstructureFinished(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/hyperstructure-finished-transformed.glb") as GLTFResult;

  useEffect(() => {
    Object.values(materials).forEach((material) => {
      material.opacity = 0.2;
      material.transparent = true;
      // need to rerender
      material.needsUpdate = true;
    });
  }, [materials]);
  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        <Html distanceFactor={10}>
          <div className="p-2 text-white -translate-x-1/2 bg-black rounded-lg whitespace-nowrap">Not Initialized</div>
        </Html>
        <group name="tower_finished" position={[0, -0.096, 0]}>
          <mesh name="tower" geometry={nodes.tower.geometry} material={materials.Stone} />
          <mesh name="tower_1" geometry={nodes.tower_1.geometry} material={materials.Gold} />
          <mesh name="tower_2" geometry={nodes.tower_2.geometry} material={materials.Grass} />
          <mesh name="tower_3" geometry={nodes.tower_3.geometry} material={materials.Foilage} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/hyperstructure-finished-transformed.glb");
