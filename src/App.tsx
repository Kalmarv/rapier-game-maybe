/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {
  Environment,
  OrbitControls,
  OrbitControlsProps,
  PerspectiveCamera,
} from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Debug, Physics, RigidBody, RigidBodyApi } from '@react-three/rapier'
import { useControls } from 'leva'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useEventListener } from 'usehooks-ts'
import { useMouse } from './hooks/use-mouse'
import { TestRamp } from './TestRamp'

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min

const Base = ({ ...props }) => (
  <RigidBody colliders='trimesh' type='fixed'>
    {/* <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={[50, 1, 50]} />
      <meshStandardMaterial color='green' />
    </mesh> */}
    <TestRamp />
  </RigidBody>
)

const Cue = ({ ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [cuePosition, setCuePosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const cueRef = useRef<RigidBodyApi>(null)
  const cueMeshRef = useRef<THREE.Mesh>(null)
  const floorRef = useRef<THREE.Mesh>(null)
  const { controls }: { controls: OrbitControlsProps } = useThree()

  useEffect(() => {
    if (cueRef.current && isSelected && cueMeshRef.current) {
      cueRef.current.setLinvel({ x: 0, y: 0, z: 0 })
      cueRef.current.setAngvel({ x: 0, y: 0, z: 0 })
      setCuePosition(cueMeshRef.current.getWorldPosition(cueRef.current.translation()))
    }
  }, [cueRef, isSelected])

  const mousePosition = useMouse({
    intersectionObject: floorRef.current,
    relativePoint: cuePosition,
  })

  useEventListener('mousedown', () => {
    if (isHovered) {
      setIsSelected(true)
      controls.enabled = false
    }
  })

  useEventListener('mouseup', () => {
    setIsSelected(false)
    controls.enabled = true
  })

  const shoot = (power: number, direction: THREE.Vector3) => {
    if (cueRef.current) {
      cueRef.current.applyImpulse(direction.multiplyScalar(power / 25))
    }
  }

  return (
    <>
      <RigidBody
        colliders='ball'
        type='dynamic'
        ref={cueRef}
        onSleep={() => console.log('sleep')}
        angularDamping={2.5}>
        <mesh
          {...props}
          ref={cueMeshRef}
          scale={[0.1, 0.1, 0.1]}
          onPointerOver={() => setIsHovered((hovered) => !hovered)}
          onPointerOut={() => setIsHovered((hovered) => !hovered)}>
          <sphereGeometry />
          <meshStandardMaterial color={isHovered ? 'hotpink' : 'white'} />
        </mesh>
      </RigidBody>
      <mesh ref={floorRef}>
        <boxGeometry args={[500, 0, 500]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      {isSelected && <Arrow start={mousePosition} end={cuePosition} shoot={shoot} />}
    </>
  )
}

const Arrow: React.FC<{
  start: THREE.Vector3
  end: THREE.Vector3
  shoot: (power: number, direction: THREE.Vector3) => void
}> = ({ start, end, shoot }) => {
  const arrowRef = useRef<THREE.Mesh>(null)
  const [shotLength, setShotLength] = useState(0)
  const [direction, setDirection] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    const vec = end.clone().sub(start)
    const length = vec.length()
    vec.normalize()
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec)

    if (arrowRef.current) {
      arrowRef.current.scale.set(0.01, length, 0.01)
      arrowRef.current.setRotationFromQuaternion(quaternion)
      arrowRef.current.position.set(end.x, end.y, end.z)
      arrowRef.current.translateOnAxis(new THREE.Vector3(0, 1, 0), -length / 2)
      setShotLength(length)
      setDirection(new THREE.Vector3().subVectors(end, start).normalize())
    }
  }, [start, end])

  useEventListener('mouseup', () => shoot(shotLength, direction))

  return (
    <>
      <mesh ref={arrowRef}>
        <cylinderGeometry />
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
      <Base position={[0, -1, 0]} />
    </Physics>
  )
}

const App = () => {
  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh' }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[2, 3, -4]} />
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
