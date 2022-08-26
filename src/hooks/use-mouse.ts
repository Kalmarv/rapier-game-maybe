import { useThree, useFrame } from '@react-three/fiber'
import { useState } from 'react'
import * as THREE from 'three'

type useMouse = {
  intersectionObject: THREE.Mesh | null
  displayObject: THREE.Mesh | null
  updateMouseObject?: boolean
  zOffset?: number
}

export const useMouse = (params: useMouse): THREE.Vector3 => {
  const { intersectionObject, displayObject } = params
  const { camera, raycaster } = useThree()
  const showMouse = params.updateMouseObject ?? false
  const zOffset = params.zOffset ?? 0
  const [mouseCoords, setMouseCoords] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))

  useFrame(({ mouse }) => {
    const mousePosition = new THREE.Vector3(mouse.x, mouse.y, 0)

    if (intersectionObject && displayObject) {
      raycaster.setFromCamera(mousePosition, camera)
      const intersections = raycaster.intersectObject(intersectionObject)
      const intersectionPoint = intersections?.[0]
        ? [intersections[0].point.x, intersections[0].point.y + zOffset, intersections[0].point.z]
        : [0, 0, 0]

      const [x, y, z] = intersectionPoint
      setMouseCoords(new THREE.Vector3(x, y, z))

      showMouse ? displayObject.position.set(x, y, z) : null
    }
  })

  return mouseCoords
}
