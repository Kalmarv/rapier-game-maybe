import { useThree, useFrame } from '@react-three/fiber'
import { useState } from 'react'
import * as THREE from 'three'

type useMouse = {
  intersectionObject: THREE.Mesh | null
  relativePoint: THREE.Vector3
  zOffset?: number
}

/**
 * Returns the mouse position projected onto a 2D plane relative to the relativePoint
 *
 * @param intersectionObject a mesh to project the mouse ray onto
 * @param relativePoint the point to translate the intersectionObject to
 * @param zOffset the z offset to apply to the intersectionObject
 *
 */
export const useMouse = (params: useMouse): THREE.Vector3 => {
  const { intersectionObject, relativePoint } = params
  const { camera, raycaster } = useThree()
  const zOffset = params.zOffset ?? 0
  const [mouseCoords, setMouseCoords] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))

  useFrame(({ mouse }) => {
    const mousePosition = new THREE.Vector3(mouse.x, mouse.y, relativePoint.z)

    if (intersectionObject) {
      // Set the intersectionObject's position to the relativePoint Y position
      intersectionObject.position.setY(relativePoint.y)

      // Raycasts from the camera to the mouse position
      raycaster.setFromCamera(mousePosition, camera)
      const intersections = raycaster.intersectObject(intersectionObject)
      const intersectionPoint = intersections?.[0]
        ? [intersections[0].point.x, intersections[0].point.y + zOffset, intersections[0].point.z]
        : [0, 0, 0]
      const [x, y, z] = intersectionPoint

      setMouseCoords(new THREE.Vector3(x, y, z))
    }
  })

  return mouseCoords
}
