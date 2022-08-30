import { OrbitControlsProps } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, RigidBodyApi } from '@react-three/rapier'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useEventListener } from 'usehooks-ts'
import { useMouse } from '../hooks/use-mouse'
import Arrow from './arrow'

const GolfBall = ({ ...props }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isAiming, setIsAiming] = useState(false)
  const [isSleeping, setIsSleeping] = useState(false)
  const [ballPosition, setBallPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const ballPhysicsRef = useRef<RigidBodyApi>(null)
  const ballMeshRef = useRef<THREE.Mesh>(null)
  const floorRef = useRef<THREE.Mesh>(null)
  const { controls, camera }: { controls: OrbitControlsProps; camera: THREE.PerspectiveCamera } =
    useThree()

  useEffect(() => {
    if (ballPhysicsRef.current && isAiming && ballMeshRef.current) {
      setBallPosition(ballMeshRef.current.getWorldPosition(ballPhysicsRef.current.translation()))
    }
  }, [ballPhysicsRef, isAiming])

  const mousePosition = useMouse({
    intersectionObject: floorRef.current,
    relativePoint: ballPosition,
  })

  useEventListener('mousedown', () => {
    if (isHovered && isSleeping) {
      setIsAiming(true)
      controls.enabled = false
    }
  })

  useEventListener('mouseup', () => {
    setIsAiming(false)
    controls.enabled = true
  })

  const shoot = (power: number, direction: THREE.Vector3) => {
    if (ballPhysicsRef.current) {
      ballPhysicsRef.current.applyImpulse(direction.multiplyScalar(power / 25))
    }
  }

  useFrame(() => {
    if (ballPhysicsRef.current) {
      ballPhysicsRef.current.linvel().length() < 0.05 ? setIsSleeping(true) : setIsSleeping(false)
    }
  })

  return (
    <>
      <RigidBody colliders='ball' type='dynamic' ref={ballPhysicsRef} angularDamping={2.5}>
        <mesh
          {...props}
          ref={ballMeshRef}
          scale={[0.1, 0.1, 0.1]}
          onPointerOver={() => setIsHovered(isSleeping ? true : false)}
          onPointerOut={() => setIsHovered(false)}>
          <sphereGeometry />
          <meshStandardMaterial color={isHovered ? 'blue' : isSleeping ? 'hotpink' : 'white'} />
        </mesh>
      </RigidBody>
      <mesh ref={floorRef}>
        <boxGeometry args={[500, 0, 500]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      {isAiming && <Arrow start={mousePosition} end={ballPosition} shoot={shoot} />}
    </>
  )
}

export default GolfBall
