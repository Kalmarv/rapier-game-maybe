/* eslint-disable react/prop-types */
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Debug, Physics, RigidBody } from '@react-three/rapier'
import { useControls } from 'leva'
import { Suspense } from 'react'
import GolfBall from './gameObjects/golf-ball'
import { Model as HoleOneColliders } from './levels/HoleOneColliders'
import { Model as HoleOneScenery } from './levels/HoleOneScenery'

const Base = () => (
  <>
    <RigidBody colliders='trimesh' type='fixed'>
      <HoleOneColliders />
    </RigidBody>
    <HoleOneScenery />
  </>
)

const Stage = () => {
  const { debug } = useControls({ debug: false })

  // Not sure how to to not have the golf balls collide with each other, but with the ground
  return (
    <>
      <Physics colliders={false}>
        {debug && <Debug />}
        <GolfBall position={[0, 5, 0]} />
        <Base />
      </Physics>
    </>
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
          <Environment preset='park' background />
          <pointLight position={[10, 10, 10]} />
          <Stage />
        </Suspense>
      </Canvas>
    </>
  )
}

export default App
