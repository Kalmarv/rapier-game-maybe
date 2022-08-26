/* eslint-disable react/prop-types */
import { Environment, OrbitControls, PerspectiveCamera, Trail } from '@react-three/drei'
import { Canvas, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber'
import { Debug, Physics, RigidBody, RigidBodyApi } from '@react-three/rapier'
import { useControls } from 'leva'
import { Suspense, useEffect, useRef, useState } from 'react'
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

const MouseIdentifier = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const floorRef = useRef<THREE.Mesh>(null)
  const { camera, raycaster } = useThree()

  useFrame(({ mouse }) => {
    const mousePosition = new THREE.Vector3(mouse.x, mouse.y, 0)

    if (meshRef.current && floorRef.current) {
      raycaster.setFromCamera(mousePosition, camera)
      const intersections = raycaster.intersectObject(floorRef.current)
      const intersectionPoint = intersections?.[0]
        ? [intersections[0].point.x, intersections[0].point.y + 1, intersections[0].point.z]
        : [0, 0, 0]

      const [x, y, z] = intersectionPoint

      meshRef.current.position.set(x, y, z)
    }
  })

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry />
        <meshStandardMaterial color={'red'} />
      </mesh>
      <mesh ref={floorRef}>
        <boxGeometry args={[50, 1, 50]} />
        <meshStandardMaterial visible={false} />
      </mesh>
    </>
  )
}

const Cue = ({ ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [cuePosition, setCuePosition] = useState(new THREE.Vector3(0, 0, 0))
  const cueRef = useRef<RigidBodyApi>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  // useFrame((state, delta) => {
  //   console.log(meshRef.current.getWorldPosition(cueRef.current.translation()))
  // })

  useEffect(() => {
    if (cueRef.current && isSelected) {
      // cueRef.current.applyImpulse({ x: 0, y: 0, z: 10 })
      cueRef.current.setLinvel({ x: 0, y: 0, z: 0 })
      cueRef.current.setAngvel({ x: 0, y: 0, z: 0 })
      setCuePosition(meshRef.current.getWorldPosition(cueRef.current.translation()))
      // console.log(cueRef.current.translation())
    }
  }, [cueRef, isSelected])

  return (
    <>
      <RigidBody colliders='ball' type='dynamic' ref={cueRef}>
        <mesh
          {...props}
          ref={meshRef}
          onPointerOver={() => setIsHovered((hovered) => !hovered)}
          onPointerOut={() => setIsHovered((hovered) => !hovered)}
          onPointerDown={() => setIsSelected((selected) => !selected)}
          onPointerUp={() => setIsSelected((selected) => !selected)}>
          <sphereGeometry />
          <meshStandardMaterial color={isHovered ? 'hotpink' : 'white'} />
        </mesh>
      </RigidBody>
    </>
  )
}

const Stage = () => {
  const { debug } = useControls({ debug: true })
  return (
    <Physics colliders={false}>
      {debug && <Debug />}
      <MouseIdentifier />
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
