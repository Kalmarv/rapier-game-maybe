/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Plane: THREE.Mesh
    FlagPole: THREE.Mesh
    Flag: THREE.Mesh
  }
  materials: {
    Rough: THREE.MeshStandardMaterial
    Pole: THREE.MeshStandardMaterial
    Flag: THREE.MeshStandardMaterial
  }
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/holeOneScenery.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh name="Plane" geometry={nodes.Plane.geometry} material={materials.Rough} position={[0.01, 0.08, 5.41]} scale={9.21} />
      <mesh name="FlagPole" geometry={nodes.FlagPole.geometry} material={materials.Pole} position={[0, 3.29, 13.44]} scale={[0.04, 1.11, 0.04]} />
      <mesh name="Flag" geometry={nodes.Flag.geometry} material={materials.Flag} position={[0.02, 4.07, 13.44]} scale={[0.03, 0.29, 0.01]} />
    </group>
  )
}

useGLTF.preload('/holeOneScenery.glb')
