/* eslint-disable react/prop-types */
import { Environment, OrbitControls, PerspectiveCamera, Trail } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Debug, Physics, RigidBody, RigidBodyApi } from '@react-three/rapier'
import { useControls } from 'leva'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Euler, Vector3 } from 'three'

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

const Arrow: React.FC<{ cuePosition: Vector3 }> = ({ cuePosition }) => {
  const { viewport } = useThree()

  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2

    setMousePosition({ x, y })
    // ref.current.position.set(x, y, 0)
    // ref.current.rotation.set(-y, x, 0)
  })

  return (
    <>
      <mesh position={cuePosition} rotation={new Euler(mousePosition.x, mousePosition.y, 1)}>
        <cylinderGeometry args={[0.1, 0.1, 10, 6]} />
        <meshStandardMaterial color={'red'} />
      </mesh>
    </>
  )
}

const Cue = ({ ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [cuePosition, setCuePosition] = useState(new Vector3(0, 0, 0))
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
      <Arrow cuePosition={cuePosition} />
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
