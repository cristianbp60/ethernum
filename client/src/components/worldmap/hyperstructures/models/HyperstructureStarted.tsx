/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 --types --keepnames --keepgroups --keepmeshes --transform public/models/hyperstructure-started.glb 
Files: public/models/hyperstructure-started.glb [802.53KB] > hyperstructure-started-transformed.glb [344.78KB] (57%)
*/

import * as THREE from "three";
import React, { useEffect } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { HyperStructureInterface } from "../../../../hooks/helpers/useHyperstructure";

type GLTFResult = GLTF & {
  nodes: {
    tower_initialized: THREE.Mesh;
    tower_initialized_scaffolds: THREE.Mesh;
  };
  materials: {
    Stone_Rough: THREE.MeshStandardMaterial;
    Wood: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>>;

export default function HyperstructureStarted(
  props: JSX.IntrinsicElements["group"] & { hyperstructure?: HyperStructureInterface },
) {
  const { nodes, materials } = useGLTF("/models/hyperstructure-started-transformed.glb") as GLTFResult;
  const { hyperstructure } = props;

  const uninitializedMaterials = {
    Wood: materials.Wood.clone(),
    Stone_Rough: materials.Stone_Rough.clone(),
  };

  useEffect(() => {
    if (!hyperstructure?.initialized) {
      Object.values(uninitializedMaterials).forEach((material) => {
        material.opacity = 0.2;
        material.transparent = true;
        // need to rerender
        material.needsUpdate = true;
      });
    }
  }, [hyperstructure, uninitializedMaterials]);

  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        {!hyperstructure?.initialized && (
          <Html distanceFactor={10}>
            <div className="p-2 text-white -translate-x-1/2 bg-black rounded-lg whitespace-nowrap">Not Initialized</div>
          </Html>
        )}
        {hyperstructure?.initialized && (
          <Html position={[0, -1.1, 0]} distanceFactor={10}>
            <div className="p-2 text-white -translate-x-1/2 bg-black rounded-lg whitespace-nowrap">
              Progress: {hyperstructure?.progress}%
            </div>
          </Html>
        )}
        <mesh
          name="tower_initialized"
          geometry={nodes.tower_initialized.geometry}
          material={hyperstructure?.initialized ? materials.Stone_Rough : uninitializedMaterials.Stone_Rough}
          position={[0, -0.096, -0.634]}
        />
        <mesh
          name="tower_initialized_scaffolds"
          geometry={nodes.tower_initialized_scaffolds.geometry}
          material={hyperstructure?.initialized ? materials.Wood : uninitializedMaterials.Wood}
          position={[0.118, -0.001, -1.24]}
          rotation={[-Math.PI, 0.719, -Math.PI]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/hyperstructure-started-transformed.glb");
