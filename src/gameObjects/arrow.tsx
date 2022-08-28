/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useEventListener } from 'usehooks-ts'

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

export default Arrow
