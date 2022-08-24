import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Cylinder, Environment, OrbitControls, PerspectiveCamera, Line } from '@react-three/drei'
import {
  Debug,
  Physics,
  RigidBody,
  RigidBodyApi,
  RigidBodyApiRef,
  useRapier,
} from '@react-three/rapier'
import { useControls } from 'leva'

const Floor = ({ ...props }) => (
  <RigidBody colliders='cuboid' type='fixed'>
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={[25, 1, 25]} />
      <meshStandardMaterial color='lightblue' />
    </mesh>
  </RigidBody>
)

const Box = ({ ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const boxRef = useRef<RigidBodyApi>(null!)

  useEffect(() => {
    if (boxRef.current && isSelected) {
      boxRef.current.setLinvel({ x: 0, y: 10, z: 0 })
    }
  }, [boxRef, isSelected])
  return (
    <>
      {/* <Line
        points={[
          [0, 0, 0],
          [10, 10, 10],
        ]}
      /> */}
      <RigidBody colliders='ball' type='dynamic' ref={boxRef}>
        <mesh
          castShadow
          receiveShadow
          {...props}
          onPointerOver={() => setIsHovered((hovered) => !hovered)}
          onPointerOut={() => setIsHovered((hovered) => !hovered)}
          onPointerDown={() => setIsSelected((selected) => !selected)}
          onPointerUp={() => setIsSelected((selected) => !selected)}>
          <sphereGeometry />
          <meshStandardMaterial color={isHovered ? 'hotpink' : 'orange'} />
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
      <Box position={[-3, 11, 0]} rotation={[0, 0, -0.5]} />
      <Box position={[-8.6, 12.3, 0]} rotation={[0, 0, -0.1]} />
      <Floor position={[0, -1, 0]} />
    </Physics>
  )
}

const App = () => {
  return (
    <>
      <Canvas style={{ width: '100%', height: '100vh' }}>
        <PerspectiveCamera makeDefault position={[10, 15, 30]} />
        <ambientLight />
        <OrbitControls makeDefault />
        <Environment preset='sunset' />
        <pointLight position={[10, 10, 10]} />
        <Stage />
      </Canvas>
    </>
  )
}

export default App
