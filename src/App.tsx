import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Debug, Physics, RigidBody, RigidBodyApi } from '@react-three/rapier'
import { useControls } from 'leva'
import { Suspense, useEffect, useRef, useState } from 'react'

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min

const Base = ({ ...props }) => (
  <RigidBody colliders='cuboid' type='fixed'>
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={[25, 1, 25]} />
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

const Cue = ({ ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const cueRef = useRef<RigidBodyApi>(null!)

  useEffect(() => {
    if (cueRef.current && isSelected) {
      cueRef.current.applyImpulse({ x: 0, y: 25, z: 0 })
    }
    // boxRef.current.translation()
  }, [cueRef, isSelected])

  return (
    <>
      {/* <Line
        points={[
          [0, 0, 0],
          [2, 3, 4],
        ]}
      /> */}
      <RigidBody colliders='ball' type='dynamic' ref={cueRef}>
        <mesh
          {...props}
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
  const { debug } = useControls({ debug: false })
  return (
    <Physics colliders={false}>
      {debug && <Debug />}
      <Cue position={[0, 5, 0]} />
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
