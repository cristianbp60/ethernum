/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 --types --keepnames --keepgroups --keepmeshes --transform public/models/hyperstructure-started.glb 
Files: public/models/hyperstructure-started.glb [802.53KB] > hyperstructure-started-transformed.glb [344.78KB] (57%)
*/

import * as THREE from "three";
import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { HyperStructureInterface } from "@bibliothecadao/eternum";
import useUIStore from "../../../../hooks/store/useUIStore";

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

export default function HyperstructureStarted(
  props: JSX.IntrinsicElements["group"] & { hyperstructure?: HyperStructureInterface },
) {
  const { nodes, materials } = useGLTF("/models/hyperstructure3_init_LOW-transformed.glb") as GLTFResult;

  const uninitializedMaterials = {
    Wood: materials.Wood.clone(),
    Stone_Rough: materials.Stone_Rough.clone(),
  };

  const hyperstructures: (HyperStructureInterface | undefined)[] = useUIStore((state) => state.hyperstructures);

  const uninitializedHyperstructures = useMemo(
    () => hyperstructures.filter((hyperstructure) => hyperstructure?.level === 0),
    [hyperstructures],
  );

  const initializedHyperstructures = useMemo(
    () => hyperstructures.filter((hyperstructure) => hyperstructure?.level === 1),
    [hyperstructures],
  );

  const uninitializedInstancedTowers = useMemo(
    () =>
      new THREE.InstancedMesh(
        nodes.tower_initialized.geometry,
        uninitializedMaterials.Stone_Rough,
        uninitializedHyperstructures.length,
      ),
    [uninitializedHyperstructures],
  );

  const uninitializedInstancedScaffolds = useMemo(
    () =>
      new THREE.InstancedMesh(
        nodes.tower_initialized_scaffolds.geometry,
        uninitializedMaterials.Wood,
        uninitializedHyperstructures.length,
      ),
    [uninitializedHyperstructures],
  );

  const initializedInstancedTowers = useMemo(
    () =>
      new THREE.InstancedMesh(
        nodes.tower_initialized.geometry,
        materials.Stone_Rough,
        initializedHyperstructures.length,
      ),
    [initializedHyperstructures],
  );

  const initializedInstancedScaffolds = useMemo(
    () =>
      new THREE.InstancedMesh(
        nodes.tower_initialized_scaffolds.geometry,
        materials.Wood,
        initializedHyperstructures.length,
      ),
    [initializedHyperstructures],
  );

  useEffect(() => {
    uninitializedHyperstructures.forEach((hyperstructure, i) => {
      const _position = new THREE.Vector3();
      const dummy = new THREE.Object3D();
      if (hyperstructure) {
        _position.set(
          hyperstructure.uiPosition.x,
          hyperstructure.uiPosition.y - 0.096,
          hyperstructure.uiPosition.z - 0.634,
        );
        dummy.position.copy(_position);
        dummy.updateMatrix();
        uninitializedInstancedTowers.setMatrixAt(i, dummy.matrix);
        _position.set(
          hyperstructure.uiPosition.x + 0.118,
          hyperstructure.uiPosition.y - 0.001,
          hyperstructure.uiPosition.z - 1.24,
        );
        dummy.position.copy(_position);
        dummy.rotateX(-Math.PI);
        dummy.rotateY(0.719);
        dummy.rotateZ(-Math.PI);
        dummy.updateMatrix();
        uninitializedInstancedScaffolds.setMatrixAt(i, dummy.matrix);
      }
    });
    uninitializedInstancedTowers.instanceMatrix.needsUpdate = true;
    uninitializedInstancedScaffolds.instanceMatrix.needsUpdate = true;
  }, [hyperstructures, uninitializedHyperstructures]);

  useEffect(() => {
    initializedHyperstructures.forEach((hyperstructure, i) => {
      const _position = new THREE.Vector3();
      const dummy = new THREE.Object3D();
      if (hyperstructure) {
        _position.set(
          hyperstructure.uiPosition.x,
          hyperstructure.uiPosition.y - 0.096,
          hyperstructure.uiPosition.z - 0.634,
        );
        dummy.position.copy(_position);
        dummy.updateMatrix();
        initializedInstancedTowers.setMatrixAt(i, dummy.matrix);
        _position.set(
          hyperstructure.uiPosition.x + 0.118,
          hyperstructure.uiPosition.y - 0.001,
          hyperstructure.uiPosition.z - 1.24,
        );
        dummy.position.copy(_position);
        dummy.rotateX(-Math.PI);
        dummy.rotateY(0.719);
        dummy.rotateZ(-Math.PI);
        dummy.updateMatrix();
        initializedInstancedScaffolds.setMatrixAt(i, dummy.matrix);
      }
    });
    initializedInstancedTowers.instanceMatrix.needsUpdate = true;
    initializedInstancedScaffolds.instanceMatrix.needsUpdate = true;
  }, [hyperstructures, initializedHyperstructures]);

  useEffect(() => {
    Object.values(uninitializedMaterials).forEach((material) => {
      material.opacity = 0.2;
      material.transparent = true;
      // need to rerender
      material.needsUpdate = true;
    });
  }, [uninitializedMaterials]);

  // const currentLevel = hyperstructure?.level || 0;

  return (
    <group {...props} dispose={null}>
      <primitive object={initializedInstancedTowers} />
      <primitive object={initializedInstancedScaffolds} />
      <primitive object={uninitializedInstancedTowers} />
      <primitive object={uninitializedInstancedScaffolds} />
      {/* <group name="Scene">
        <Html position={[0, -1.1, 0]} distanceFactor={10}>
          <div className="p-2 text-center text-white -translate-x-1/2 bg-black rounded-lg whitespace-nowrap">
            <div> Level {currentLevel}</div>
            <div> Progress: {hyperstructure?.progress.toFixed(2)}%</div>
          </div>
        </Html>
        <mesh
          name="tower_initialized"
          geometry={nodes.tower_initialized.geometry}
          material={currentLevel !== 0 ? materials.Stone_Rough : uninitializedMaterials.Stone_Rough}
          position={[0, -0.096, -0.634]}
        />
        <mesh
          name="tower_initialized_scaffolds"
          geometry={nodes.tower_initialized_scaffolds.geometry}
          material={currentLevel !== 0 ? materials.Wood : uninitializedMaterials.Wood}
          position={[0.118, -0.001, -1.24]}
          rotation={[-Math.PI, 0.719, -Math.PI]}
        />
      </group> */}
    </group>
  );
}

useGLTF.preload("/models/hyperstructure3_init_LOW-transformed.glb");
