/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { Environment, OrbitControls, PerspectiveCamera, Trail } from '@react-three/drei'
import { Canvas, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber'
import { Debug, Physics, RigidBody, RigidBodyApi } from '@react-three/rapier'
import { useControls } from 'leva'
import React, { forwardRef, Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min

const Base = ({ ...props }) => (
  <RigidBody colliders='cuboid' type='fixed'>
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={[50, 1, 50]} />
      <meshStandardMaterial color='green' />
    </mesh>
  </RigidBody>
)

const Ball = ({ ...props }) => {
  return (
    <>
      <RigidBody colliders='ball' type='dynamic'>
        <mesh {...props}>
          <sphereGeometry />
          <meshStandardMaterial color={'orange'} />
        </mesh>
      </RigidBody>
    </>
  )
}

type useMouse = {
  intersectionObject: THREE.Mesh | null
  displayObject: THREE.Mesh | null
}

const useMouse = (params: useMouse) => {
  const { intersectionObject, displayObject } = params
  const { camera, raycaster } = useThree()

  useFrame(({ mouse }) => {
    const mousePosition = new THREE.Vector3(mouse.x, mouse.y, 0)

    if (intersectionObject && displayObject) {
      raycaster.setFromCamera(mousePosition, camera)
      const intersections = raycaster.intersectObject(intersectionObject)
      const intersectionPoint = intersections?.[0]
        ? [intersections[0].point.x, intersections[0].point.y + 0.5, intersections[0].point.z]
        : [0, 0, 0]

      const [x, y, z] = intersectionPoint

      displayObject.position.set(x, y, z)
    }
  })
}

const Cue = ({ ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [cuePosition, setCuePosition] = useState(new THREE.Vector3(0, 0, 0))
  const cueRef = useRef<RigidBodyApi>(null)
  const cueMeshRef = useRef<THREE.Mesh>(null)
  const floorRef = useRef<THREE.Mesh>(null)
  const mousePointRef = useRef<THREE.Mesh>(null)

  // useFrame((state, delta) => {
  //   console.log(meshRef.current.getWorldPosition(cueRef.current.translation()))
  // })

  useEffect(() => {
    if (cueRef.current && isSelected && cueMeshRef.current) {
      // cueRef.current.applyImpulse({ x: 0, y: 0, z: 10 })
      cueRef.current.setLinvel({ x: 0, y: 0, z: 0 })
      cueRef.current.setAngvel({ x: 0, y: 0, z: 0 })
      setCuePosition(cueMeshRef.current.getWorldPosition(cueRef.current.translation()))
    }
  }, [cueRef, isSelected])

  useMouse({ intersectionObject: floorRef.current, displayObject: mousePointRef.current })

  return (
    <>
      {/* {cueMeshRef.current && <MouseIdentifier intersectionObject={cueMeshRef.current} />} */}
      <RigidBody colliders='ball' type='dynamic' ref={cueRef}>
        <mesh
          {...props}
          ref={cueMeshRef}
          onPointerOver={() => setIsHovered((hovered) => !hovered)}
          onPointerOut={() => setIsHovered((hovered) => !hovered)}
          onPointerDown={() => setIsSelected((selected) => !selected)}
          onPointerUp={() => setIsSelected((selected) => !selected)}>
          <sphereGeometry />
          <meshStandardMaterial color={isHovered ? 'hotpink' : 'white'} />
        </mesh>
      </RigidBody>
      <mesh ref={floorRef}>
        <boxGeometry args={[50, 1, 50]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      <mesh ref={mousePointRef}>
        <sphereGeometry />
        <meshStandardMaterial color={'red'} />
      </mesh>
    </>
  )
}

const Stage = () => {
  const { debug } = useControls({ debug: true })
  return (
    <Physics colliders={false}>
      {debug && <Debug />}
      <Cue position={[0, 5, 0]} />
      <Ball position={[randomRange(-5, 5), 10, randomRange(-5, 5)]} />
      <Ball position={[randomRange(-5, 5), 10, randomRange(-5, 5)]} />
      <Ball position={[randomRange(-5, 5), 10, randomRange(-5, 5)]} />
      <Ball position={[randomRange(-5, 5), 10, randomRange(-5, 5)]} />
      <Ball position={[randomRange(-5, 5), 10, randomRange(-5, 5)]} />
      <Ball position={[randomRange(-5, 5), 10, randomRange(-5, 5)]} />
      <Ball position={[randomRange(-5, 5), 10, randomRange(-5, 5)]} />
      <Ball position={[randomRange(-5, 5), 10, randomRange(-5, 5)]} />
      <Base position={[0, -1, 0]} />
    </Physics>
  )
}

const App = () => {
  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh' }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[10, 15, 30]} />
          <ambientLight />
          <OrbitControls makeDefault />
          <Environment preset='sunset' />
          <pointLight position={[10, 10, 10]} />
          <Stage />
        </Suspense>
      </Canvas>
    </>
  )
}

export default App
