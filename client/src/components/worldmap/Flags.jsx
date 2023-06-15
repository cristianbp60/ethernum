import { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import realmsJson from '../../geodata/realms.json';
import realmsOrders from '../../geodata/realms_raw.json';
import * as THREE from 'three';
import useUIStore from '../../hooks/store/useUIStore';
import { useSpring, animated } from '@react-spring/three'
import gsap from 'gsap';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';

const count = realmsJson.features.length;

const orders = [
  'Fox', 'Detection', 'Reflection', 'Twins', 'Power', 'Titans', 'Giants', 'Skill', 'Enlightenment', 'Protection', 'Perfection', 'Brilliance', 'Anger', 'Rage', 'Vitriol', 'Fury'
]

realmsJson.features = realmsJson.features.map((feature, index) => {
  const order = realmsOrders[index].order;
  return {
    ...feature,
    order: order.replace('the ', '')
  }
})

const ordersRealms = orders.map((order) => {
  return realmsJson.features.filter((feature) => feature.order === order)
})

export function Flags (props) {
    const { nodes, materials } = useGLTF('/models/flags_1-transformed.glb')



    const setCameraPosition = useUIStore((state) => state.setCameraPosition);
    const setCameraTarget = useUIStore((state) => state.setCameraTarget);
    const showRealmsFlags = useUIStore((state) => state.showRealmsFlags);
    const setShowRealmsFlags = useUIStore((state) => state.setShowRealmsFlags);

    const [woodInstances, setWoodInstances] = useState([]);
    const [flagInstances, setFlagInstances] = useState([]);

    const { flagsPosition, flagsScale } = useControls({
      flagsPosition:
      {
          value: { x: -0.38, z: 0, y: -0.04 },
          step: 0.01
      },
      flagsScale:
      {
          value: 1,
          step: 0.01
      }
  })

    let scale = new THREE.Vector3();
    const tempObject = new THREE.Object3D();
    let matrix = new THREE.Matrix4();

    const updateFlagScale = (id, _scale, meshIndex) => {
      if (!woodInstances.length || !flagInstances.length) return;
      scale.set(_scale, _scale, _scale);
      //woodInstances.getMatrixAt(id, matrix);
      woodInstances[meshIndex].getMatrixAt(id, matrix);
      matrix.decompose(tempObject.position, tempObject.quaternion, tempObject.scale);
      tempObject.scale.copy(scale);
      tempObject.updateMatrix();
      
      woodInstances[meshIndex].setMatrixAt(id, tempObject.matrix);
      flagInstances[meshIndex].setMatrixAt(id, tempObject.matrix);
    }

    useFrame(({ camera }) => {
      const pos = camera.position;
      if (pos) {
          const needShowFlags = pos.y <= 50;
          if (needShowFlags !== showRealmsFlags) {
              setShowRealmsFlags(needShowFlags);
          }
      }
    })

    useEffect(() => {
      if (!woodInstances.length || !flagInstances.length) return;

      const scales = {
        startScale: showRealmsFlags ? 0.01 : 0.5,
        endScale: showRealmsFlags ? 0.5 : 0.01
      }
      const tl = gsap.timeline();
      tl.to(scales, {
        startScale: scales.endScale,
        duration: 0.7,
        ease: 'Bounce.easeOut',
        onUpdate: () => {
          //console.log('scales.startScale', scales.startScale);
          ordersRealms.forEach((orderRealms, index) => {
            orderRealms.forEach((realm, i) => {
              updateFlagScale(i, scales.startScale, index);
            })
          })
          
          woodInstances.forEach((woodInstance) => {
            woodInstance.instanceMatrix.needsUpdate = true;
          })
          flagInstances.forEach((flagInstance) => {
            flagInstance.instanceMatrix.needsUpdate = true;
          })
        }
      })


    }, [showRealmsFlags, woodInstances, flagInstances])

    useEffect(() => {

      let woodMeshes, flagMeshes;
      let woodGeometry, flagGeometry;
      let woodMaterial;
  
      const _woodMesh = nodes.Plane003_1.geometry;
      const _flagMesh = nodes.Plane003.geometry;
  
      woodGeometry = _woodMesh.clone();
      flagGeometry = _flagMesh.clone();
      woodMaterial = materials.Wood
      

      const _position = new THREE.Vector3();
      const dummy = new THREE.Object3D();
  
      const defaultTransform = new THREE.Matrix4()
            .makeRotationX( -Math.PI / 2 )
            .multiply( new THREE.Matrix4().makeScale( 0.3, 0.3, 0.3 ) );
  
      woodGeometry.applyMatrix4( defaultTransform );
      flagGeometry.applyMatrix4( defaultTransform );
  
  
      //woodMesh = new THREE.InstancedMesh( woodGeometry, woodMaterial, count )
      //flagMesh = new THREE.InstancedMesh( flagGeometry, flagMaterial, count )
      woodMeshes = orders.map((order, i) => new THREE.InstancedMesh( woodGeometry, woodMaterial, ordersRealms[i].length ))
      flagMeshes = orders.map((order, i) => new THREE.InstancedMesh( flagGeometry, materials[order], ordersRealms[i].length ))

      woodMeshes.forEach((woodMesh) => {
        woodMesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
      })
      flagMeshes.forEach((flagMesh) => {
        flagMesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
      })
  
      ordersRealms.forEach((orderRealms, index) => {
        orderRealms.forEach((realm, i) => {
          const x = realm.xy[0];
          const y = realm.xy[1];
          const z = -0.7
          _position.set( x, y, z );
          dummy.position.copy( _position );
          dummy.rotateZ(
            //random
            Math.random() * Math.PI * 2
          );
          dummy.updateMatrix();

          woodMeshes[index].setMatrixAt( i, dummy.matrix );
          flagMeshes[index].setMatrixAt( i, dummy.matrix );
        })
      })
      setWoodInstances(woodMeshes);
      setFlagInstances(flagMeshes);
    }, [])

    const clickHandler = (e, index) => {
      e.stopPropagation()
      console.log(e.intersections)
      if ( e.intersections.length > 0 ) {
        const instanceId = e.intersections[ 0 ].instanceId;
        const point = e.intersections[ 0 ].point;
        // updateFlagScale(instanceId, 2);
        // woodInstances.instanceMatrix.needsUpdate = true;
        // flagInstances.instanceMatrix.needsUpdate = true;
        const targetPos = new THREE.Vector3(point.x, point.y, point.z)
        const cameraPos = new THREE.Vector3(point.x + 25 * (Math.random() < 0.5 ? 1 : -1), 25, point.z + 25 * (Math.random() < 0.5 ? 1 : -1))
        setCameraTarget(targetPos)
        setCameraPosition(cameraPos)

        console.log(targetPos, cameraPos, instanceId, index, realmsJson.features[instanceId + index * 500].xy)
      }
    }
    
    return (
      <group {...props} dispose={null}
      position={[flagsPosition.x, flagsPosition.y, flagsPosition.z]}
      scale={[flagsScale, flagsScale, flagsScale]}
      rotation={[
        -Math.PI / 2,
        Math.PI,
        0
      ]} >
        {woodInstances.map((woodInstance, index) => {
          return (
            <group key={index} onClick={(e) => clickHandler(e, index)}>
              <primitive object={woodInstance} />
              <primitive object={flagInstances[index]} />
            </group>
          )
        })}
      </group>
    )
}

  
useGLTF.preload('/models/flags_1-transformed.glb')